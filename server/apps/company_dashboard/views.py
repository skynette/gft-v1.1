from rest_framework import generics, permissions, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from apps.gft.authentication import APIKeyAuthentication
from apps.gft.models import Box, BoxCategory, Campaign, Company, CompanyBoxes
from apps.gft.permissions import APIPermissionValidator
from .serializers import (
    BoxEditSerializer,
    BoxSerializer,
    CampaignDetailSerializer,
    CampaignSerializer,
    CreateCampaignSerializer,
)
from django.shortcuts import get_object_or_404
from .schemas import (
    campaign_list_schema,
    campaign_detail_schema,
    campaign_create_schema,
)
from django.db import transaction
from django.db.models import Sum, Q


class CampaignListView(generics.GenericAPIView):
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_campaign"]

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
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["create_campaign"]

    @campaign_create_schema
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company_boxes = serializer.validated_data["company_boxes"]
        qty = serializer.validated_data["num_boxes"]

        # Verify that the box type exists
        try:
            box_type = BoxCategory.objects.get(id=company_boxes.box_type.id)
        except BoxCategory.DoesNotExist:
            return Response(
                {"detail": "Invalid box type selected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate the total available boxes of the specified type for the user's company
        available_boxes = (
            CompanyBoxes.objects.filter(
                company__owner=request.user, box_type=box_type
            ).aggregate(Sum("qty"))["qty__sum"]
            or 0
        )

        # Check if there are enough boxes available
        if available_boxes < qty:
            return Response(
                {
                    "detail": f"Only {available_boxes} boxes are available for this type."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the company owns any boxes of the specified type
        company = Company.objects.get(owner=request.user)
        company_boxes_available = CompanyBoxes.objects.filter(
            company=company, box_type=box_type
        )
        if not company_boxes_available.exists():
            return Response(
                {"detail": "The selected box type is not owned by your company."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Perform the creation of the campaign within a transaction to ensure atomicity
        with transaction.atomic():
            company_boxes_available = company_boxes_available.first()
            company_boxes_available.qty -= qty
            company_boxes_available.save()
            campaign = serializer.save(company=company, duration=int(box_type.category))

        return Response(
            {
                "detail": "Campaign created successfully.",
                "campaign": CampaignSerializer(campaign).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


campaign_create_api_view = CampaignCreateView.as_view()


class CampaignDetailView(generics.GenericAPIView):
    serializer_class = CampaignDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_campaign"]

    @campaign_detail_schema
    def get(self, request, id, *args, **kwargs):
        company = get_object_or_404(Company, owner=request.user)
        campaign = get_object_or_404(Campaign, id=id, company=company)
        serializer = self.get_serializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)


campaign_detail_api_view = CampaignDetailView.as_view()


class AllBoxesView(generics.GenericAPIView):
    serializer_class = BoxSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_boxes"]

    def get_queryset(self):
        return Box.objects.filter(
            Q(user=self.request.user) | Q(box_campaign__company__owner=self.request.user)
        ).order_by("-created_at")

    @extend_schema(
        description="Retrieve all boxes for the authenticated user's company",
        responses=BoxSerializer(many=True),
        tags=["Company Area"],
    )
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"results": serializer.data}, status=status.HTTP_200_OK)


all_boxes_api_view = AllBoxesView.as_view()



class BoxDetailView(generics.GenericAPIView):
    serializer_class = BoxEditSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ['view_box']

    @extend_schema(
        request=BoxEditSerializer,
        description="View Box details (as the gifter/owner of box)",
        responses=BoxEditSerializer,
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("box_id", OpenApiTypes.STR, OpenApiParameter.PATH, required=True, description="Box ID to view details of."),
        ]
    )
    def get(self, request, box_id):
        box = get_object_or_404(Box, id=box_id, user=request.user)
        serializer = self.get_serializer(box)
        return Response(serializer.data, status=status.HTTP_200_OK)


box_detail_api_view = BoxDetailView.as_view()

