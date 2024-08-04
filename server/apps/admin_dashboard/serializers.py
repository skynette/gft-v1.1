from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

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
    groups = serializers.StringRelatedField(many=True, required=False)

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
        

class AdminCompanyBoxesCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CompanyBoxes
        fields = '__all__'


class AdminCompanyBoxesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CompanyBoxes
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        company = AdminCompanySerializer(instance.company).data
        box_type = AdminBoxCategorySerializer(instance.box_type).data
        representation['company'] = company
        representation['box_type'] = box_type
        return representation


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "mobile", "id"]


class AdminBoxCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Box
        fields = '__all__'


class AdminBoxSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)

    class Meta:
        model = Box
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user_detail = UserDetailSerializer(instance.user).data
        representation['user'] = user_detail
        return representation
    

class AdminGiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gift
        fields = '__all__'
        

class AdminGiftVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftVisit
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        visitor = UserDetailSerializer(instance.visitor).data
        representation['visitor'] = visitor
        gift = AdminGiftSerializer(instance.gift).data
        representation['gift'] = gift
        return representation
        
        
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
        fields = ['pkid', 'id', 'company_name', 'name', 'box_type', 'duration', 'num_boxes', 'header_image', 'open_after_a_day']


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


class MonthDataSerializer(serializers.Serializer):
    month = serializers.CharField()
    total_users = serializers.IntegerField()
    total_boxes = serializers.IntegerField()
    total_campaigns = serializers.IntegerField()

class AdminDashboardChartSerializer(serializers.Serializer):
    users = MonthDataSerializer(many=True)
    boxes = MonthDataSerializer(many=True)
    campaigns = MonthDataSerializer(many=True)
    

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['pk', 'key', 'user', 'created']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = UserDetailSerializer(instance.user).data
        representation['user'] = user
        return representation
