import json
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from django.contrib.auth import get_user_model, login
from apps.admin_dashboard.serializers import UserSerializer
from apps.authentication.serializers import (
    CredentialSerializer,
    RegisterSerializer,
    SendOTPSerializer,
    SocialAuthSerializer,
    UserUpdateSerializer,
    VerifyOTPSerializer,
)
from .models import OTP
from apps.gft.permissions import APIPermissionValidator
from knox.models import AuthToken
from knox.views import LogoutView as KnoxLogoutView

from drf_spectacular.utils import extend_schema, OpenApiExample, extend_schema_view
from drf_spectacular.utils import OpenApiResponse

from helpers.utils import send_otp_to_mobile, validate_phone
from apps.gft.models import CompanyApiKey


User = get_user_model()

class SendOTPView(generics.GenericAPIView):
    serializer_class = SendOTPSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=SendOTPSerializer,
        responses={200: "OTP sent successfully"},
        description="Send OTP to user's mobile phone",
        tags=["Authentication"],
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mobile = serializer.validated_data['mobile']
        if not validate_phone(mobile):
            return Response(
                {"detail": "Invalid mobile number format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate and send OTP
        try:
            otp = send_otp_to_mobile(mobile)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Save OTP to the database
        OTP.objects.create(mobile=mobile, otp=otp)

        return Response({"token": otp}, status=status.HTTP_200_OK)


send_otp_view = SendOTPView.as_view()


class VerifyOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=VerifyOTPSerializer,
        responses={200: {"token": "string"}},
        description="Verify OTP and return authentication token",
        tags=["Authentication"],
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mobile = serializer.validated_data['mobile']
        token = serializer.validated_data['token']

        # Validate OTP
        try:
            otp_record = OTP.objects.get(mobile=mobile, otp=token)
        except OTP.DoesNotExist:
            return Response(
                {"detail": "Invalid OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # OTP is valid, create or retrieve user token
        user, created = User.objects.get_or_create(mobile=mobile)
        auth_token, _ = Token.objects.get_or_create(user=user)

        # Delete OTP record after successful verification
        otp_record.delete()

        return Response({"token": auth_token.key}, status=status.HTTP_200_OK)


verify_otp_view = VerifyOTPView.as_view()


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    required_permissions = ["add_user"]

    @extend_schema(
        request=RegisterSerializer,
        responses=UserUpdateSerializer,
        description="Register a new user",
        tags=["Authentication"],
    )
    def post(self, request):
        # Get the user's token from the request headers
        token_key = request.headers.get("Authorization", None)
        if not token_key or not token_key.startswith("Token "):
            return Response(
                {"detail": "Authorization token missing or invalid."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token_key = token_key.split(" ")[1]
        try:
            token = Token.objects.get(key=token_key)
        except Token.DoesNotExist:
            return Response(
                {"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED
            )

        user = token.user
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        username = validated_data.get("username")
        first_name = validated_data.get("first_name")
        last_name = validated_data.get("last_name")
        email = validated_data.get("email")
        phone = validated_data.get("phone_number")

        validated_phone = validate_phone(phone)
        if phone and not validated_phone:
            return Response(
                {"detail": "Invalid phone number format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # check if phone belongs to another user
        if (
            validated_phone
            and User.objects.filter(mobile=validated_phone).exclude(id=user.id).exists()
        ):
            return Response(
                {"detail": "Phone number already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

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

class CredentialLogin(generics.GenericAPIView):
    serializer_class = CredentialSerializer

    @extend_schema(
        request=None,
        responses={
            200: OpenApiResponse(
                response={"application/json": {}},
                description="Successful registration or login",
                examples=[
                    OpenApiExample(
                        name="Success",
                        value={
                            "user": {
                                "id": "VoZkCadJP9",
                                "username": "user_hdrZnk7n",
                                "first_name": "string",
                                "last_name": "string",
                                "email": "user@example.com",
                                "mobile": "+234980000000",
                                "provider": "credentials",
                            },
                            "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                        },
                    )
                ],
            ),
            400: OpenApiResponse(description="Bad Request"),
            500: OpenApiResponse(description="Server Error"),
        },
        description="Register or login a user using social account",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        token = data.get("token")
        token = Token.objects.filter(key=token).first()
        
        if not token:
            return Response({"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)             
        
        user = token.user
        
        if user.user_type == "company":
            companyAPIKey = CompanyApiKey.objects.filter(company__owner=user).first()
            data = {"user": UserUpdateSerializer(user).data, "token": token.key, "companyAPIKey": companyAPIKey.key}
            print("data", data)
        else:
            data = {"user": UserUpdateSerializer(user).data, "token": token.key, "companyAPIKey": ''}
            print("data", data)

        return Response(data, status=status.HTTP_200_OK)


credential_login_api_view = CredentialLogin.as_view()


class SocialAuthView(generics.GenericAPIView):
    serializer_class = SocialAuthSerializer

    @extend_schema(
        request=SocialAuthSerializer,
        responses={
            200: OpenApiResponse(
                response={"application/json": {}},
                description="Successful registration or login",
                examples=[
                    OpenApiExample(
                        name="Success",
                        value={
                            "user": {
                                "id": "VoZkCadJP9",
                                "username": "user_hdrZnk7n",
                                "first_name": "string",
                                "last_name": "string",
                                "email": "user@example.com",
                                "mobile": "+234980000000",
                                "provider": "credentials",
                            },
                            "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                        },
                    )
                ],
            ),
            400: OpenApiResponse(description="Bad Request"),
            500: OpenApiResponse(description="Server Error"),
        },
        description="Register or login a user using social account",
        tags=["Authentication"],
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        provider = data.get("provider")
        email = data.get("email")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "username": email.split("@")[0],
                "provider": provider,
            },
        )

        if not created:
            # Update user details if necessary
            user.first_name = user.first_name or first_name
            user.last_name = user.last_name or last_name
            user.provider = provider
            user.save()
            
        token, _ = Token.objects.get_or_create(user=user)
        
        if user.user_type == "company":
            companyAPIKey = CompanyApiKey.objects.filter(company__owner=user).first()
            data = {"user": UserUpdateSerializer(user).data, "token": token.key, "companyAPIKey": companyAPIKey.key}
            print("data", data)
        else:
            data = {"user": UserUpdateSerializer(user).data, "token": token.key, "companyAPIKey": ''}
            print("data", data)

        return Response(data, status=status.HTTP_200_OK)


social_auth_login_api_view = SocialAuthView.as_view()


class UserUpdateView(generics.GenericAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=UserUpdateSerializer,
        responses={
            200: OpenApiResponse(
                response={"application/json": {}},
                description="User details successfully updated",
                examples=[
                    OpenApiExample(
                        name="Success",
                        value={
                            "first_name": "John",
                            "last_name": "Doe",
                            "username": "john_doe",
                            "mobile": "+23491234567",
                            "contact_preference": "phone",
                            "image": "http://example.com/media/image.jpg",
                        },
                    )
                ],
            ),
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="User not found"),
            500: OpenApiResponse(description="Server Error"),
        },
        description="Update user details for users registered with passwordless authentication",
        tags=["User"],
    )
    def patch(self, request, *args, **kwargs):
        user = request.user

        if not user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


user_profile_update_api_view = UserUpdateView.as_view()


@extend_schema_view(
    post=extend_schema(
        description="Admin login to obtain authentication token.",
        request=AuthTokenSerializer,
        responses={
            200: "Authentication successful, returns user data and token.",
            400: "Invalid credentials, authentication failed.",
        },
        tags=["Admin Authentication"],
    )
)
class LoginAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        _, token = AuthToken.objects.create(user)
        data = {}
        if user.user_type == "company":
            companyAPIKey = CompanyApiKey.objects.filter(company__owner=user).first()
            data = {"user": UserUpdateSerializer(user).data, "token": token.key, "companyAPIKey": companyAPIKey.key}
        else:
            data = {"user": UserUpdateSerializer(user).data, "token": token.key, "companyAPIKey": ''}

        return Response(data, status=status.HTTP_200_OK)


admin_login_api_view = LoginAPI.as_view()


@extend_schema_view(
    post=extend_schema(
        description="Admin logout to invalidate authentication token.",
        responses={
            204: "Logout successful.",
            401: "Authentication required, invalid token.",
        },
        tags=["Admin Authentication"],
    )
)
class LogoutAPI(KnoxLogoutView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


admin_logout_api_view = LogoutAPI.as_view()


class UserDetailView(generics.GenericAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=UserUpdateSerializer,
                description="User details successfully retrieved",
                examples=[
                    OpenApiExample(
                        name="Success",
                        value={
                            "first_name": "John",
                            "last_name": "Doe",
                            "username": "john_doe",
                            "mobile": "+23491234567",
                            "contact_preference": "phone",
                            "role": "user",
                            "image": "http://example.com/media/image.jpg",
                        },
                    )
                ],
            ),
            401: OpenApiResponse(description="Unauthorized"),
            500: OpenApiResponse(description="Server Error"),
        },
        description="Retrieve the logged-in user's details",
        tags=["User"],
    )
    def get(self, request, *args, **kwargs):
        user = request.user

        if not user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


user_detail_api_view = UserDetailView.as_view()
