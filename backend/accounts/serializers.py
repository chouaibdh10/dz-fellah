from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'role', 'name', 'photo', 'phone', 'address', 'is_active')
        read_only_fields = ('id', 'is_active')


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=('client', 'producer', 'admin'), required=False)
    name = serializers.CharField(required=False, allow_blank=True)
    photo = serializers.URLField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value: str):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Cet email est déjà utilisé.')
        return value

    def validate_role(self, value: str):
        request = self.context.get('request')
        if value == 'admin':
            allow_admin = bool(
                request
                and hasattr(request, 'user')
                and request.user
                and request.user.is_authenticated
                and request.user.is_staff
            )
            # Admin creation is intentionally restricted
            if not allow_admin:
                return 'client'
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.pop('role', 'client')
        user = User.objects.create_user(password=password, role=role, **validated_data)
        return user
