from rest_framework import generics, permissions, status
from rest_framework.response import Response
from apps.gft.models import Campaign, Company
from .serializers import CampaignDetailSerializer, CampaignSerializer
from django.shortcuts import get_object_or_404
from .schemas import campaign_list_schema, campaign_detail_schema

class CampaignListView(generics.GenericAPIView):
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    required_permissions = ['view_campaign']

    @campaign_list_schema
    def get(self, request, *args, **kwargs):
        company = get_object_or_404(Company, owner=request.user)
        campaigns = Campaign.current_objects.filter(company=company, is_deleted=False)
        serializer = self.get_serializer(campaigns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

campaign_list_api_view = CampaignListView.as_view()



class CampaignDetailView(generics.GenericAPIView):
    serializer_class = CampaignDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    required_permissions = ['view_campaign']

    @campaign_detail_schema
    def get(self, request, id, *args, **kwargs):
        company = get_object_or_404(Company, owner=request.user)
        campaign = get_object_or_404(Campaign, id=id, company=company)
        serializer = self.get_serializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)

campaign_detail_api_view = CampaignDetailView.as_view()
