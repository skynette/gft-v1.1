from rest_framework import serializers

class CampaignMetricsSerializer(serializers.Serializer):
    total_campaigns = serializers.IntegerField()
    total_boxes = serializers.IntegerField()
    total_gifts = serializers.IntegerField()
    percentage_increase_boxes = serializers.FloatField()
    percentage_increase_gifts = serializers.FloatField()

class BoxMetricsSerializer(serializers.Serializer):
    total_boxes = serializers.IntegerField()
    percentage_increase = serializers.FloatField()
    total_set_up_boxes = serializers.IntegerField()

class GiftMetricsSerializer(serializers.Serializer):
    total_gifts = serializers.IntegerField()
    percentage_increase = serializers.FloatField()
    total_opened_gifts = serializers.IntegerField()

class GiftVisitMetricsSerializer(serializers.Serializer):
    total_visits = serializers.IntegerField()
    percentage_increase = serializers.FloatField()

class CompanyMetricsSerializer(serializers.Serializer):
    total_companies = serializers.IntegerField()
    total_users = serializers.IntegerField()
    total_campaigns = serializers.IntegerField()
    total_boxes = serializers.IntegerField()
    percentage_increase_users = serializers.FloatField()
    percentage_increase_campaigns = serializers.FloatField()
    percentage_increase_boxes = serializers.FloatField()

class CompanyUserMetricsSerializer(serializers.Serializer):
    company = serializers.CharField()
    total_users = serializers.IntegerField()
    percentage_increase = serializers.FloatField()