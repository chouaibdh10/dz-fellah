from django.db import transaction
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order
from .permissions import IsAdmin, IsClient, IsProducer
from .serializers import CreateOrderSerializer, OrderSerializer


class OrderViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
	queryset = (
		Order.objects.select_related('client')
		.prefetch_related('items', 'items__product', 'items__product__producer')
		.all()
	)

	def get_serializer_class(self):
		if self.action == 'create':
			return CreateOrderSerializer
		return OrderSerializer

	def get_permissions(self):
		if self.action in {'list', 'retrieve'}:
			return [permissions.IsAuthenticated()]
		if self.action in {'create'}:
			return [IsClient()]
		if self.action in {'set_status'}:
			return [permissions.IsAuthenticated()]
		return [permissions.IsAuthenticated()]

	def get_queryset(self):
		qs = super().get_queryset()
		user = self.request.user
		role = getattr(user, 'role', None)

		if role == 'admin':
			return qs
		if role == 'client':
			return qs.filter(client=user)
		if role == 'producer':
			return qs.filter(items__product__producer=user).distinct()
		return qs.none()

	@transaction.atomic
	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		order = serializer.save()
		return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

	@action(detail=True, methods=['patch'], url_path='status')
	def set_status(self, request, pk=None):
		order = self.get_object()
		new_status = request.data.get('status')
		if not new_status:
			return Response({'status': 'This field is required.'}, status=400)

		role = getattr(request.user, 'role', None)

		if role == 'admin':
			order.status = new_status
			order.save(update_fields=['status', 'updated_at'])
			return Response(OrderSerializer(order).data)

		if role == 'producer':
			# Producer can only update orders that contain their products
			has_items = order.items.filter(product__producer=request.user).exists()
			if not has_items:
				return Response({'detail': 'Not allowed.'}, status=403)
			order.status = new_status
			order.save(update_fields=['status', 'updated_at'])
			return Response(OrderSerializer(order).data)

		return Response({'detail': 'Not allowed.'}, status=403)

# Create your views here.
