from rest_framework import serializers
from django.contrib.auth import get_user_model

from apps.gft.models import Box, BoxCategory, Campaign, Company, CompanyApiKey, CompanyBoxes, Config, Gift, GiftVisit, PermissionGroup, PermissionsModel, Template


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["password"]
        

class AdminBoxCategorySerializer(serializers.ModelSerializer):
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


class AdminCompanySerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    owner_username = serializers.SerializerMethodField()

    def get_owner_username(self, obj) -> str:
        return obj.owner.username
    
    class Meta:
        model = Company
        fields = '__all__'
        extra_kwargs = {'owner': {'write_only': True}}
        

class CompanyApiKeyReadSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    groups = serializers.StringRelatedField(many=True)

    def get_company_name(self, obj) -> str:
        return obj.company.name

    class Meta:
        model = CompanyApiKey
        fields = '__all__'


class CompanyApiKeyWriteSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all())
    groups = serializers.PrimaryKeyRelatedField(queryset=PermissionGroup.objects.all(), many=True)

    class Meta:
        model = CompanyApiKey
        fields = '__all__'
        extra_kwargs = {'company': {'write_only': True}}
        

class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = '__all__'


class AdminCompanyBoxesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBoxes
        fields = '__all__'


class AdminBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Box
        fields = '__all__'


class AdminGiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gift
        fields = '__all__'
        

class AdminGiftVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftVisit
        fields = '__all__'
        
        
class AdminCreateCampaignSerializer(serializers.ModelSerializer):
    company_boxes = serializers.PrimaryKeyRelatedField(queryset=CompanyBoxes.objects.all())

    class Meta:
        model = Campaign
        fields = ['company_boxes', 'name', 'duration', 'num_boxes', 'header_image', 'open_after_a_day']
        
class AdminEditCampaignSerializer(serializers.ModelSerializer):
    company_boxes = serializers.PrimaryKeyRelatedField(queryset=CompanyBoxes.objects.all(), required=False)

    class Meta:
        model = Campaign
        fields = ['company_boxes', 'name', 'duration', 'num_boxes', 'header_image', 'open_after_a_day', 'is_deleted']
        read_only_fields = ['is_deleted']

class AdminCampaignSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    box_type = serializers.CharField(source='company_boxes.box_type.name', read_only=True)

    class Meta:
        model = Campaign
        fields = ['id', 'company_name', 'name', 'box_type', 'duration', 'num_boxes', 'header_image', 'open_after_a_day']


class AdminCampaignDetailSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    box_type = serializers.CharField(source='company_boxes.box_type.name', read_only=True)
    company_owner = serializers.CharField(source='company.owner.username', read_only=True)

    class Meta:
        model = Campaign
        fields = [
            'id', 'company_name', 'company_owner', 'name', 'box_type', 'duration', 'num_boxes', 'header_image', 
            'open_after_a_day', 'is_deleted', 'created_at', 'updated_at'
        ]


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'


class TemplateSelectionSerializer(serializers.Serializer):
    template_id = serializers.IntegerField()
    category = serializers.CharField(max_length=255)


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionsModel
        fields = '__all__'

class PermissionGroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = PermissionGroup
        fields = '__all__'

class AssignUserGroupSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    group_id = serializers.IntegerField()
