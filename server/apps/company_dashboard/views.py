from rest_framework import generics, permissions, status
from rest_framework.response import Response
from apps.gft.models import BoxCategory, Campaign, Company, CompanyBoxes
from .serializers import CampaignDetailSerializer, CampaignSerializer, CreateCampaignSerializer
from django.shortcuts import get_object_or_404
from .schemas import campaign_list_schema, campaign_detail_schema, campaign_create_schema
from django.db import transaction
from django.db.models import Sum

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


class CampaignCreateView(generics.GenericAPIView):
    serializer_class = CreateCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    required_permissions = ['create_campaign']

    @campaign_create_schema
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company_boxes = serializer.validated_data['company_boxes']
        qty = serializer.validated_data['num_boxes']

        # Verify that the box type exists
        try:
            box_type = BoxCategory.objects.get(id=company_boxes.box_type.id)
        except BoxCategory.DoesNotExist:
            return Response({'detail': 'Invalid box type selected.'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate the total available boxes of the specified type for the user's company
        available_boxes = CompanyBoxes.objects.filter(
            company__owner=request.user, box_type=box_type
        ).aggregate(Sum('qty'))['qty__sum'] or 0

        # Check if there are enough boxes available
        if available_boxes < qty:
            return Response(
                {'detail': f'Only {available_boxes} boxes are available for this type.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the company owns any boxes of the specified type
        company = Company.objects.get(owner=request.user)
        company_boxes_available = CompanyBoxes.objects.filter(
            company=company, box_type=box_type)
        if not company_boxes_available.exists():
            return Response(
                {'detail': 'The selected box type is not owned by your company.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Perform the creation of the campaign within a transaction to ensure atomicity
        with transaction.atomic():
            company_boxes_available = company_boxes_available.first()
            company_boxes_available.qty -= qty
            company_boxes_available.save()
            campaign = serializer.save(company=company, duration=int(box_type.category))

        return Response({'detail': 'Campaign created successfully.', 'campaign': CampaignSerializer(campaign).data}, status=status.HTTP_201_CREATED)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

campaign_create_api_view = CampaignCreateView.as_view()



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
