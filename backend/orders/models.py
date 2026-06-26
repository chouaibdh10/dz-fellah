from django.conf import settings
from django.db import models


class OrderStatus(models.TextChoices):
	PENDING = 'pending', 'Pending'
	PROCESSING = 'processing', 'Processing'
	SHIPPED = 'shipped', 'Shipped'
	DELIVERED = 'delivered', 'Delivered'
	CANCELLED = 'cancelled', 'Cancelled'


class Order(models.Model):
	client = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='orders',
	)
	status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)
	address = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self) -> str:
		return f'Order #{self.pk}'


class OrderItem(models.Model):
	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey('products.Product', on_delete=models.PROTECT, related_name='order_items')
	quantity = models.PositiveIntegerField(default=1)
	unit_price = models.DecimalField(max_digits=10, decimal_places=2)

	def __str__(self) -> str:
		return f'Item {self.product_id} x{self.quantity}'
