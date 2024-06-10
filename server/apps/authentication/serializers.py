from PIL import Image
import phonenumbers
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    mobile = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name',
                  'last_name', 'email', 'mobile']

    def validate(self, attrs):
        username = attrs.get('username', None)
        email = attrs.get('email', None)
        mobile = attrs.get('mobile', None)

        if not username.isalnum():
            raise serializers.ValidationError(
                {'username': 'The username should only contain alphanumeric characters.'})

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                {'username': 'This username is already taken.'})

        # Validate email format
        if not email:
            raise serializers.ValidationError(
                {'email': 'Email is required.'})
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError(
                {'email': 'Enter a valid email address.'})

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {'email': 'This email is already registered.'})
        
        if mobile:
            try:
                parsed_mobile = phonenumbers.parse(mobile, None)
                if not phonenumbers.is_valid_number(parsed_mobile):
                    raise serializers.ValidationError({'mobile': 'Enter a valid phone number.'})
                
                if not phonenumbers.is_possible_number(parsed_mobile):
                    raise serializers.ValidationError({'mobile': 'Enter a possible phone number.'})

            except phonenumbers.phonenumberutil.NumberParseException:
                raise serializers.ValidationError(
                    {'mobile': 'Invalid phone number format, it should be in the format +country_codexxxxxxxx'})

        return attrs


class BaseUserProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    def validate_image(self, value):
        if value:
            try:
                image = Image.open(value)
            except Exception as e:
                raise serializers.ValidationError('Invalid image format, please upload a valid image')
        return value

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'contact_preference',
                  'mobile', 'is_active', 'user_type', 'date_joined', 'image']
        read_only_fields = ['is_active', 'user_type', 'date_joined']


class UserProfileSerializer(BaseUserProfileSerializer):
    class Meta(BaseUserProfileSerializer.Meta):
        fields = BaseUserProfileSerializer.Meta.fields


class SuperAdminUserProfileSerializer(BaseUserProfileSerializer):
    class Meta(BaseUserProfileSerializer.Meta):
        fields = "__all__"
