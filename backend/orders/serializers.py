from decimal import Decimal

from rest_framework import serializers

from products.models import Product

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)
    producer_email = serializers.EmailField(source='product.producer.email', read_only=True)
    producer_name = serializers.CharField(source='product.producer.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'product_id',
            'product_name',
            'product_unit',
            'producer_email',
            'producer_name',
            'quantity',
            'unit_price',
        )
        read_only_fields = (
            'id',
            'product_id',
            'product_name',
            'product_unit',
            'producer_email',
            'producer_name',
            'unit_price',
        )


class OrderSerializer(serializers.ModelSerializer):
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    client_email = serializers.EmailField(source='client.email', read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    client_phone = serializers.CharField(source='client.phone', read_only=True)
    client_address = serializers.CharField(source='client.address', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'client_id',
            'client_email',
            'client_name',
            'client_phone',
            'client_address',
            'status',
            'address',
            'created_at',
            'updated_at',
            'items',
        )
        read_only_fields = (
            'id',
            'client_id',
            'client_email',
            'client_name',
            'client_phone',
            'client_address',
            'created_at',
            'updated_at',
            'items',
        )


class CreateOrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderSerializer(serializers.Serializer):
    address = serializers.CharField(required=False, allow_blank=True)
    items = CreateOrderItemInputSerializer(many=True)

    def validate(self, attrs):
        if not attrs.get('items'):
            raise serializers.ValidationError({'items': 'At least one item is required.'})
        return attrs

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        order = Order.objects.create(client=user, address=validated_data.get('address', ''))

        product_ids = [i['product_id'] for i in validated_data['items']]
        products = {p.id: p for p in Product.objects.select_for_update().filter(id__in=product_ids)}

        for item in validated_data['items']:
            product = products.get(item['product_id'])
            if not product:
                raise serializers.ValidationError({'items': f"Unknown product_id={item['product_id']}"})

            quantity = int(item['quantity'])
            if product.stock < quantity:
                raise serializers.ValidationError({'items': f"Insufficient stock for product_id={product.id}"})

            product.stock -= quantity
            product.save(update_fields=['stock'])

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                unit_price=Decimal(product.price),
            )

        return order
