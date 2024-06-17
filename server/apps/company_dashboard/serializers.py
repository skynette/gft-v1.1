from django.urls import reverse
from rest_framework import serializers
from apps.gft.models import Box, Campaign, CompanyBoxes
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
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False
    )
    owner = serializers.SerializerMethodField(read_only=True)
    days_of_gifting = serializers.CharField(read_only=True, required=False)
    box_campaign = serializers.PrimaryKeyRelatedField(
        queryset=Campaign.objects.all(), required=False, allow_null=True
    )
    box_campaign_deleted_status = serializers.SerializerMethodField(read_only=True)

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


class BoxCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False
    )
    owner = serializers.SerializerMethodField(read_only=True)
    absolute_url = serializers.SerializerMethodField(read_only=True)
    days_of_gifting = serializers.CharField(required=False)

    class Meta:
        model = Box
        exclude = ["qr_code_v", 'pkid']

    @extend_schema_field(OpenApiTypes.STR)
    def get_owner(self, obj):
        return obj.user.username


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
