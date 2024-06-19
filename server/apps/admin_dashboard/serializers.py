from rest_framework import serializers
from django.contrib.auth import get_user_model

from apps.gft.models import BoxCategory, Company


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["password"]
        

class BoxCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BoxCategory
        fields = '__all__'

    def validate_qty(self, value):
        """
        Check that the quantity is not negative or zero.
        """
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        elif value == 0:
            raise serializers.ValidationError("Quantity cannot be zero.")
        return value

    def validate_category(self, value):
        """
        Check that the category is a valid choice.
        """
        valid_categories = [choice[0] for choice in BoxCategory.CATEGORY_CHOICES.choices]
        if value not in valid_categories:
            raise serializers.ValidationError("Invalid category choice.")
        return value


class CompanySerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    owner_username = serializers.SerializerMethodField()

    def get_owner_username(self, obj):
        return obj.owner.username
    
    class Meta:
        model = Company
        fields = '__all__'
        extra_kwargs = {'owner': {'write_only': True}}