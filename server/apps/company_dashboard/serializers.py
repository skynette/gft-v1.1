import datetime
from PIL import Image
from rest_framework import serializers
from apps.authentication.serializers import UserProfileSerializer
from apps.gft.models import Box, BoxCategory, Campaign, Company, CompanyApiKey, CompanyBoxes, CompanyUser, Gift, Notification
from django.contrib.auth import get_user_model
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field

User = get_user_model()


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = [
            "id",
            "company",
            "name",
            "company_boxes",
            "duration",
            "num_boxes",
            "header_image",
            "open_after_a_day",
        ]


class CreateCampaignSerializer(serializers.ModelSerializer):
    company_boxes = serializers.PrimaryKeyRelatedField(
        queryset=CompanyBoxes.objects.all()
    )

    class Meta:
        model = Campaign
        fields = [
            "company",
            "name",
            "company_boxes",
            "duration",
            "num_boxes",
            "header_image",
            "open_after_a_day",
        ]

    def validate(self, data):
        return data


class CampaignDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = [
            "id",
            "company",
            "name",
            "company_boxes",
            "duration",
            "num_boxes",
            "header_image",
            "open_after_a_day",
        ]


class EditCampaignSerializer(serializers.ModelSerializer):
    company_boxes = serializers.PrimaryKeyRelatedField(
        queryset=CompanyBoxes.objects.all(), required=False
    )

    class Meta:
        model = Campaign
        fields = [
            "name",
            "company_boxes",
            "duration",
            "num_boxes",
            "header_image",
            "open_after_a_day",
        ]

    def validate(self, data):
        return data


class BoxSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    owner = serializers.SerializerMethodField(read_only=True)
    days_of_gifting = serializers.CharField(read_only=True, required=False)
    box_campaign = serializers.PrimaryKeyRelatedField(queryset=Campaign.objects.all(), required=False, allow_null=True)
    box_campaign_deleted_status = serializers.SerializerMethodField(read_only=True)
    box_category = serializers.PrimaryKeyRelatedField(queryset=BoxCategory.objects.all(), write_only=True)

    class Meta:
        model = Box
        exclude = ["qr_code_v", 'pkid']

    @extend_schema_field(OpenApiTypes.STR)
    def get_owner(self, obj):
        if obj.user:
            return obj.user.username
        return "Owner"

    @extend_schema_field(OpenApiTypes.BOOL)
    def get_box_campaign_deleted_status(self, obj):
        if obj.box_campaign:
            return obj.box_campaign.is_deleted
        return False

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        
        # Ensure that open_date is a date object
        if 'open_date' in validated_data and isinstance(validated_data['open_date'], datetime):
            validated_data['open_date'] = validated_data['open_date'].date()
            
        box_category = validated_data.pop('box_category')
        company_boxes = CompanyBoxes.objects.get(company=self.context['request'].user.company, box_type=box_category)

        if company_boxes.qty <= 0:
            raise serializers.ValidationError("No boxes available for the selected category.")

        # Reduce the quantity
        company_boxes.qty -= 1
        company_boxes.save()

        # Set the days_of_gifting based on the box category
        validated_data['days_of_gifting'] = int(box_category.category)
        
        return super().create(validated_data)

class BoxSetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Box
        exclude = ["qr_code_v", 'pkid', "user", "box_campaign", "days_of_gifting", "last_opened", "is_company_setup", ]


class BoxEditSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Box
        exclude = ["pkid", "qr_code_v", "user", "open_after_a_day"]
        read_only_fields = [
            "days_of_gifting",
            "id",
            "created",
            "modified",
            "absolute_url",
            "owner",
            "setup_link",
        ]

    @extend_schema_field(OpenApiTypes.STR)
    def get_owner(self, obj):
        return obj.user.username


class DeleteBoxResponseSerializer(serializers.Serializer):
    message = serializers.CharField()


class GiftSerializer(serializers.ModelSerializer):
    box_model = BoxEditSerializer(read_only=True)
    total_visits = serializers.SerializerMethodField(read_only=True)
    gifter = serializers.SerializerMethodField(read_only=True)
    gift_campaign_deleted_status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Gift
        exclude = ["qr_code_v", "created_at", "updated_at"]

    @extend_schema_field(OpenApiTypes.STR)
    def get_gifter(self, obj):
        return obj.box_model.user.username

    @extend_schema_field(OpenApiTypes.STR)
    def get_total_visits(self, obj):
        return obj.get_total_visits
    
    @extend_schema_field(OpenApiTypes.BOOL)
    def get_gift_campaign_deleted_status(self, obj):
        if obj.gift_campaign:
            return obj.gift_campaign.is_deleted
        return False

class GiftSetupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gift
        exclude = ["qr_code_v", "created_at", "updated_at", "pkid"]


class AddBoxesToCampaignSerializer(serializers.Serializer):
    box_ids = serializers.ListField(child=serializers.CharField())
    

class ShowNotificationSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    box = BoxEditSerializer()
    gift = GiftSerializer()

    class Meta:
        model = Notification
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class BoxCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BoxCategory
        fields = '__all__'


class CompanyAPIKeySerializer(serializers.ModelSerializer):
    company = serializers.SerializerMethodField()

    class Meta:
        model = CompanyApiKey
        fields = '__all__'

    def get_company(self, obj) -> str:
        return obj.company.name
    

class CompanyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyUser
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ['id', 'name', 'logo', 'header_image', 'company_url',
                  'box_limit', 'socials', 'color_schema']


class CompanyBoxesSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()
    box_type = BoxCategorySerializer(read_only=True)

    class Meta:
        model = CompanyBoxes
        exclude = ['company']

    @extend_schema_field(OpenApiTypes.STR)
    def get_company_name(self, obj):
        return obj.company.name


class CreateCompanyBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBoxes
        exclude = ['company']


class SocialsSerializer(serializers.Serializer):
    twitter_url = serializers.URLField(required=False, allow_blank=True)
    facebook_url = serializers.URLField(required=False, allow_blank=True)
    instagram_url = serializers.URLField(required=False, allow_blank=True)
    snapchat_url = serializers.URLField(required=False, allow_blank=True)
    youtube_url = serializers.URLField(required=False, allow_blank=True)

class ColorSchemaDetailsSerializer(serializers.Serializer):
    primary_color = serializers.CharField(required=False, allow_blank=True)
    secondary_color = serializers.CharField(required=False, allow_blank=True)
    background_color = serializers.CharField(required=False, allow_blank=True)
    qr_code_text_color = serializers.CharField(required=False, allow_blank=True)
    background_border_color = serializers.CharField(required=False, allow_blank=True)
    background_hover_color = serializers.CharField(required=False, allow_blank=True)
    foreground_color = serializers.CharField(required=False, allow_blank=True)
    header_color = serializers.CharField(required=False, allow_blank=True)
    footer_color = serializers.CharField(required=False, allow_blank=True)

class ColorSchemaSerializer(serializers.Serializer):
    light = ColorSchemaDetailsSerializer(required=False)
    dark = ColorSchemaDetailsSerializer(required=False)

class UpdateCompanySerializer(serializers.ModelSerializer):
    socials = SocialsSerializer(required=False)
    color_schema = ColorSchemaSerializer(required=False)

    class Meta:
        model = Company
        fields = ['name', 'logo', 'header_image', 'company_url', 'box_limit', 'socials', 'color_schema']



class BoxAnalyticsSerializer(serializers.Serializer):
    total_boxes = serializers.IntegerField()
    boxes_last_month = serializers.IntegerField()
    boxes_this_month = serializers.IntegerField()
    boxes_percentage_increase = serializers.FloatField()
    

class GiftAnalyticsSerializer(serializers.Serializer):
    total_gifts = serializers.IntegerField()
    gifts_last_month = serializers.IntegerField()
    gifts_this_month = serializers.IntegerField()
    gifts_percentage_increase = serializers.FloatField()
    

class GiftVisitAnalyticsSerializer(serializers.Serializer):
    total_gift_visits = serializers.IntegerField()
    gift_visits_last_month = serializers.IntegerField()
    gift_visits_this_month = serializers.IntegerField()
    gift_visits_percentage_increase = serializers.FloatField()
    

class CampaignAnalyticsSerializer(serializers.Serializer):
    total_campaigns = serializers.IntegerField()
    campaigns_last_month = serializers.IntegerField()
    campaigns_this_month = serializers.IntegerField()
    campaigns_percentage_increase = serializers.FloatField()
    

class CombinedAnalyticsSerializer(serializers.Serializer):
    gifts = GiftAnalyticsSerializer()
    gift_visits = GiftVisitAnalyticsSerializer()
    campaigns = CampaignAnalyticsSerializer()


class DashboardSerializer(serializers.Serializer):
    total_boxes_owned = serializers.IntegerField()
    boxes_received = serializers.IntegerField()
    gift_boxes_opened = serializers.IntegerField()
    weekdays = serializers.ListField(child=serializers.IntegerField())
    gifts_given = serializers.ListField(child=serializers.IntegerField())
    gifts_received = serializers.ListField(child=serializers.IntegerField())
