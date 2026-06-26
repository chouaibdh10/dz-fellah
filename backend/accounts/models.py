from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
	ADMIN = 'admin', 'Admin'
	PRODUCER = 'producer', 'Producer'
	CLIENT = 'client', 'Client'


class UserManager(BaseUserManager):
	use_in_migrations = True

	def _create_user(self, email: str, password: str | None, **extra_fields):
		if not email:
			raise ValueError('Email must be set')
		email = self.normalize_email(email)
		user = self.model(email=email, **extra_fields)
		if password:
			user.set_password(password)
		else:
			user.set_unusable_password()
		user.save(using=self._db)
		return user

	def create_user(self, email: str, password: str | None = None, **extra_fields):
		extra_fields.setdefault('is_staff', False)
		extra_fields.setdefault('is_superuser', False)
		extra_fields.setdefault('role', UserRole.CLIENT)
		return self._create_user(email, password, **extra_fields)

	def create_superuser(self, email: str, password: str | None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		extra_fields.setdefault('role', UserRole.ADMIN)
		if extra_fields.get('is_staff') is not True:
			raise ValueError('Superuser must have is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must have is_superuser=True.')
		return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
	username = None
	email = models.EmailField(unique=True)
	role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.CLIENT)
	name = models.CharField(max_length=120, blank=True)
	photo = models.URLField(blank=True)
	phone = models.CharField(max_length=40, blank=True)
	address = models.CharField(max_length=255, blank=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS: list[str] = []

	objects = UserManager()

	def __str__(self) -> str:
		return self.email
