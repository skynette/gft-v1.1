from rest_framework import serializers
from apps.gft.models import GiftVisit, Gift


class GiftVisitSerializer(serializers.ModelSerializer):
    gift_id = serializers.PrimaryKeyRelatedField(queryset=Gift.objects.all(), write_only=True)
    
    class Meta:
        model = GiftVisit
        fields = ['id', 'gift_id', 'time_of_visit', 'metadata', 'created_at', 'updated_at']
        read_only_fields = ['id', 'time_of_visit', 'created_at', 'updated_at']

    def create(self, validated_data):
        gift = validated_data.pop('gift_id')
        visitor = self.context['request'].user
        return GiftVisit.objects.create(gift=gift, visitor=visitor, **validated_data)
