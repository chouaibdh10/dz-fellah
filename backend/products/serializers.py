from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    producer_id = serializers.IntegerField(source='producer.id', read_only=True)
    producer_email = serializers.EmailField(source='producer.email', read_only=True)
    producer_name = serializers.CharField(source='producer.name', read_only=True)
    producer_phone = serializers.CharField(source='producer.phone', read_only=True)
    producer_address = serializers.CharField(source='producer.address', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id',
            'producer_id',
            'producer_email',
            'producer_name',
            'producer_phone',
            'producer_address',
            'name',
            'price',
            'unit',
            'photo',
            'stock',
            'in_season',
            'category',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'producer_id', 'producer_email', 'created_at', 'updated_at')
