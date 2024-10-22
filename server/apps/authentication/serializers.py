from PIL import Image
import phonenumbers
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

User = get_user_model()

class SendOTPSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)

class VerifyOTPSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)
    token = serializers.CharField(max_length=6)

class RegisterSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    username = serializers.CharField(max_length=150)
    first_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    email = serializers.EmailField()
    mobile = serializers.CharField(max_length=15, required=False, allow_blank=True)
    provider = serializers.CharField(max_length=30, required=False, allow_blank=True)

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user
        username = attrs.get("username", user.username)
        email = attrs.get("email", user.email)
        mobile = attrs.get("mobile", user.mobile)
        # Username validation
        if not username.isalnum():
            raise serializers.ValidationError(
                {
                    "username": "The username should only contain alphanumeric characters."
                }
            )

        if User.objects.filter(username=username).exclude(pk=user.pk).exists():
            raise serializers.ValidationError(
                {"username": "This username is already taken."}
            )

        # Email validation
        if not email:
            raise serializers.ValidationError({"email": "Email is required."})
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError({"email": "Enter a valid email address."})

        if User.objects.filter(email=email).exclude(pk=user.pk).exists():
            raise serializers.ValidationError(
                {"email": "This email is already registered."}
            )

        # Mobile validation
        if mobile:
            try:
                parsed_mobile = phonenumbers.parse(mobile, None)
                if not phonenumbers.is_valid_number(parsed_mobile):
                    raise serializers.ValidationError(
                        {"mobile": "Enter a valid phone number."}
                    )

                if not phonenumbers.is_possible_number(parsed_mobile):
                    raise serializers.ValidationError(
                        {"mobile": "Enter a possible phone number."}
                    )

                if User.objects.filter(mobile=mobile).exclude(pk=user.pk).exists():
                    raise serializers.ValidationError(
                        {"mobile": "This phone number is already registered."}
                    )

            except phonenumbers.phonenumberutil.NumberParseException:
                raise serializers.ValidationError(
                    {
                        "mobile": "Invalid phone number format, it should be in the format +country_codexxxxxxxx"
                    }
                )

        attrs["mobile"] = mobile
        return attrs



class BaseUserProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    def validate_image(self, value):
        if value:
            try:
                image = Image.open(value)
            except Exception as e:
                raise serializers.ValidationError(
                    "Invalid image format, please upload a valid image"
                )
        return value

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "contact_preference",
            "mobile",
            "is_active",
            "user_type",
            "date_joined",
            "image",
        ]
        read_only_fields = ["is_active", "user_type", "date_joined"]


class UserProfileSerializer(BaseUserProfileSerializer):
    class Meta(BaseUserProfileSerializer.Meta):
        fields = BaseUserProfileSerializer.Meta.fields


class SuperAdminUserProfileSerializer(BaseUserProfileSerializer):
    class Meta(BaseUserProfileSerializer.Meta):
        fields = "__all__"


class CredentialSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=100, required=True, allow_blank=False)
    

class SocialAuthSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=User.PROVIDER_CHOICES)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    image = serializers.CharField(max_length=500, required=False, allow_blank=True)
    
    
class UserUpdateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'provider', 'first_name', 'last_name', 'username', 'mobile', 'contact_preference', 'image', 'role']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['role'] = instance.user_type
        return representation
