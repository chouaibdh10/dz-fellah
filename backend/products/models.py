from django.conf import settings
from django.db import models


class Product(models.Model):
	producer = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='products',
	)
	name = models.CharField(max_length=200)
	price = models.DecimalField(max_digits=10, decimal_places=2)
	unit = models.CharField(max_length=40, default='kg')
	photo = models.URLField(blank=True)
	stock = models.PositiveIntegerField(default=0)
	in_season = models.BooleanField(default=False)
	category = models.CharField(max_length=80, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self) -> str:
		return self.name
