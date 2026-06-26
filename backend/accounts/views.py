from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import RegisterSerializer, UserSerializer
from .tokens import TokenObtainPairWithUserSerializer


class RegisterView(generics.CreateAPIView):
	permission_classes = (permissions.AllowAny,)
	serializer_class = RegisterSerializer

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response(UserSerializer(user).data, status=201)


class MeView(APIView):
	permission_classes = (permissions.IsAuthenticated,)

	def get(self, request):
		return Response(UserSerializer(request.user).data)

	def patch(self, request):
		serializer = UserSerializer(request.user, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)


class LoginView(TokenObtainPairView):
	serializer_class = TokenObtainPairWithUserSerializer


class RefreshView(TokenRefreshView):
	pass

# Create your views here.
