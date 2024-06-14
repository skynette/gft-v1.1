from rest_framework import serializers

from apps.gft.models import Campaign, CompanyBoxes


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ['id', 'company', 'name', 'company_boxes', 'duration', 'num_boxes', 'header_image', 'open_after_a_day']


class CreateCampaignSerializer(serializers.ModelSerializer):
    company_boxes = serializers.PrimaryKeyRelatedField(queryset=CompanyBoxes.objects.all())

    class Meta:
        model = Campaign
        fields = ['company', 'name', 'company_boxes', 'duration', 'num_boxes', 'header_image', 'open_after_a_day']

    def validate(self, data):
        return data


class CampaignDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ['id', 'company', 'name', 'company_boxes', 'duration', 'num_boxes', 'header_image', 'open_after_a_day']


class EditCampaignSerializer(serializers.ModelSerializer):
    company_boxes = serializers.PrimaryKeyRelatedField(queryset=CompanyBoxes.objects.all(), required=False)

    class Meta:
        model = Campaign
        fields = ['name', 'company_boxes', 'duration', 'num_boxes', 'header_image', 'open_after_a_day']

    def validate(self, data):
        return data
