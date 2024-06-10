from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth import get_user_model, login
from drf_spectacular.utils import extend_schema
from apps.authentication.serializers import RegisterSerializer
from apps.gft.permissions import APIPermissionValidator
from knox.models import AuthToken


User = get_user_model()


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["add_user"]

    @extend_schema(
        request=RegisterSerializer,
        responses=RegisterSerializer,
        description="Register a new user",
        tags=["Authentication"],
    )
    def post(self, request):
        user = request.data
        serializer = self.get_serializer(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        user_data = serializer.data
        return Response(user_data, status=status.HTTP_201_CREATED)


register_api_view = RegisterView.as_view()


class GoogleLoginAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=RegisterSerializer,
        responses={200: RegisterSerializer},
        description="Register a new user",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        username = serializer.validated_data['username']
        first_name = serializer.validated_data.get('first_name', '')
        last_name = serializer.validated_data.get('last_name', '')
        mobile = serializer.validated_data.get('mobile', '')

        user, created = User.objects.get_or_create(
            email=email, defaults={
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                "mobile": mobile
            }
        )
        if created:
            user.set_unusable_password()
            user.save()

        login(request, user)
        _, token = AuthToken.objects.create(user)
        return Response({"user": RegisterSerializer(user).data, "token": token}, status=status.HTTP_200_OK)


login_with_google_api_view = GoogleLoginAPI.as_view()
