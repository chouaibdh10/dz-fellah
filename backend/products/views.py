from rest_framework import permissions, viewsets

from .models import Product
from .permissions import IsAdminOrProducer
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
	serializer_class = ProductSerializer
	queryset = Product.objects.select_related('producer').all()

	def get_permissions(self):
		if self.action in {'list', 'retrieve'}:
			return [permissions.AllowAny()]
		return [IsAdminOrProducer()]

	def get_queryset(self):
		qs = super().get_queryset()
		user = getattr(self.request, 'user', None)
		if not user or not user.is_authenticated:
			return qs

		role = getattr(user, 'role', None)
		if role == 'producer':
			return qs.filter(producer=user)
		return qs

	def perform_create(self, serializer):
		serializer.save(producer=self.request.user)

# Create your views here.
