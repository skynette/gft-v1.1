from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import permissions
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from apps.authentication.serializers import RegisterSerializer, UserRegisterSerializer, SocialAuthSerializer
from apps.gft.permissions import APIPermissionValidator
from knox.models import AuthToken

from helpers.utils import validate_phone


User = get_user_model()


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    # required_permissions = ["add_user"]

    @extend_schema(
        request=RegisterSerializer,
        responses=RegisterSerializer,
        description="Register a new user",
        tags=["Authentication"],
    )
    def post(self, request):
        # Get the user's token from the request headers
        token_key = request.headers.get('Authorization', None)
        if not token_key or not token_key.startswith('Token '):
            return Response({'detail': 'Authorization token missing or invalid.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token_key = token_key.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
        except Token.DoesNotExist:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = token.user
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        username = validated_data.get('username')
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        email = validated_data.get("email")
        phone = validated_data.get("phone_number")

        validated_phone = validate_phone(phone)
        if phone and not validated_phone:
            return Response({'detail': 'Invalid phone number format.'}, status=status.HTTP_400_BAD_REQUEST)

        # check if phone belongs to another user
        if validated_phone and User.objects.filter(mobile=validated_phone).exclude(id=user.id).exists():
            return Response({'detail': 'Phone number already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's details
        user.username = username
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.mobile = f"+{validated_phone}" if phone else None
        user.save()

        user_data = serializer.data

        return Response(user_data, status=status.HTTP_201_CREATED)


register_api_view = RegisterView.as_view()


class SocialAuthView(generics.GenericAPIView):
    serializer_class = SocialAuthSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        print("DATA FROM SOCIAL LOGIN", data)
        
        provider = data.get('provider')
        email = data.get('email')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')

        user, created = User.objects.get_or_create(email=email, defaults={
            'first_name': first_name,
            'last_name': last_name,
            'username': email.split('@')[0],
            'provider': provider,
        })

        if not created:
            # Update user details if necessary
            user.first_name = user.first_name or first_name
            user.last_name = user.last_name or last_name
            user.provider = provider
            user.save()

        token = AuthToken.objects.create(user)[1]
        return Response({
            'user': UserRegisterSerializer(user).data,
            'token': token
        }, status=status.HTTP_200_OK)
        
        
social_auth_login_api_view = SocialAuthView.as_view()
