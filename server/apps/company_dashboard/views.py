from datetime import datetime
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from apps.gft.authentication import APIKeyAuthentication
from apps.gft.models import (
    Box,
    BoxCategory,
    Campaign,
    Company,
    CompanyApiKey,
    CompanyBoxes,
    Gift,
    GiftVisit,
    Notification,
)
from apps.gft.permissions import APIPermissionValidator
from .serializers import (
    AddBoxesToCampaignSerializer,
    BoxAnalyticsSerializer,
    BoxCategorySerializer,
    BoxEditSerializer,
    BoxSerializer,
    CampaignAnalyticsSerializer,
    CampaignDetailSerializer,
    CampaignSerializer,
    CombinedAnalyticsSerializer,
    CompanyAPIKeySerializer,
    CompanyApiKeyUsageResponseSerializer,
    CompanyBoxesSerializer,
    CompanyDashboardChartSerializer,
    CompanySerializer,
    CompanyUserSerializer,
    CreateCampaignSerializer,
    CreateCompanyBoxSerializer,
    DeleteBoxResponseSerializer,
    EditCampaignSerializer,
    GiftAnalyticsSerializer,
    GiftSerializer,
    GiftVisitAnalyticsSerializer,
    NotificationSerializer,
    ShowNotificationSerializer,
    UpdateCompanySerializer,
)
from django.shortcuts import get_object_or_404
from .schemas import (
    campaign_list_schema,
    campaign_detail_schema,
    campaign_create_schema,
)
from django.db import transaction
from django.db.models import Sum, Q
from django.utils.timezone import now


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


class CampaignUpdateView(generics.GenericAPIView):
    serializer_class = EditCampaignSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_campaign"]

    @extend_schema(
        request=EditCampaignSerializer,
        responses=CampaignSerializer,
        description="Update a campaign for the authenticated company.",
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
    )
    def put(self, request, id, *args, **kwargs):
        campaign = get_object_or_404(Campaign, id=id, company__owner=request.user)
        serializer = self.get_serializer(
            instance=campaign, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Campaign updated successfully.",
                    "results": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


campaign_update_api_view = CampaignUpdateView.as_view()


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
            Q(user=self.request.user)
            | Q(box_campaign__company__owner=self.request.user)
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
    required_permissions = ["view_box"]

    @extend_schema(
        request=BoxEditSerializer,
        description="View Box details (as the gifter/owner of box)",
        responses=BoxEditSerializer,
        tags=["Company Area"],
        parameters=[
            OpenApiParameter(
                "box_id",
                OpenApiTypes.STR,
                OpenApiParameter.PATH,
                required=True,
                description="Box ID to view details of.",
            ),
        ],
    )
    def get(self, request, box_id):
        box = get_object_or_404(Box, id=box_id, user=request.user)
        serializer = self.get_serializer(box)
        return Response(serializer.data, status=status.HTTP_200_OK)


box_detail_api_view = BoxDetailView.as_view()


class BoxCreateView(generics.GenericAPIView):
    serializer_class = BoxSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["add_box"]

    @extend_schema(
        request=BoxSerializer,
        description="Create a new box for the authenticated user.",
        responses=BoxSerializer,
        tags=["Company Area"],
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            box = serializer.save()
            data = self.get_serializer(box).data
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


create_box_api_view = BoxCreateView.as_view()


class BoxEditView(generics.GenericAPIView):
    serializer_class = BoxEditSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_box"]

    @extend_schema(
        request=BoxEditSerializer,
        description="Edit a box.",
        responses=BoxSerializer,
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
    )
    def put(self, request, id, *args, **kwargs):
        box = get_object_or_404(Box, id=id, user=request.user)

        serializer = self.get_serializer(instance=box, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Box updated successfully.", "results": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=400)


box_edit_api_view = BoxEditView.as_view()


class DeleteBoxView(generics.GenericAPIView):
    serializer_class = DeleteBoxResponseSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_box"]

    @extend_schema(
        description="Delete a box.",
        responses={204: DeleteBoxResponseSerializer},
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
    )
    def delete(self, request, id):
        instance = get_object_or_404(
            Box, box_campaign__company__owner=request.user, id=id
        )
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


delete_box_api_view = DeleteBoxView.as_view()


class BoxGiftsView(generics.GenericAPIView):
    serializer_class = GiftSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_gift"]

    @extend_schema(
        request=None,
        description="Retrieve all gifts for a specific box.",
        responses={200: GiftSerializer(many=True)},
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("box_id", OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
    )
    def get(self, request, box_id, *args, **kwargs):
        box = get_object_or_404(
            Box,
            Q(id=box_id, user=request.user)
            | Q(id=box_id, box_campaign__company__owner=request.user),
        )
        gifts = Gift.objects.filter(box_model=box).order_by("open_date")
        serializer = self.get_serializer(gifts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


box_gifts_api_view = BoxGiftsView.as_view()


class GiftEditView(generics.GenericAPIView):
    serializer_class = GiftSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_gift"]

    @extend_schema(
        request=GiftSerializer,
        responses=GiftSerializer,
        description="Edit a gift",
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("box_id", OpenApiTypes.STR, OpenApiParameter.PATH),
            OpenApiParameter("gift_id", OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
    )
    def put(self, request, box_id, gift_id, *args, **kwargs):
        gift = get_object_or_404(
            Gift, id=gift_id, box_model__id=box_id, box_model__user=request.user
        )
        serializer = self.get_serializer(instance=gift, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Gift updated successfully.", "result": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


gift_edit_api_view = GiftEditView.as_view()


class GiftDeleteView(generics.GenericAPIView):
    serializer_class = GiftSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_gift"]

    @extend_schema(
        request=GiftSerializer,
        responses=GiftSerializer,
        description="Delete a gift.",
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("box_id", OpenApiTypes.STR, OpenApiParameter.PATH),
            OpenApiParameter("gift_id", OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
    )
    def delete(self, request, box_id, gift_id, *args, **kwargs):
        gift = get_object_or_404(
            Gift, id=gift_id, box_model__id=box_id, box_model__user=request.user
        )
        gift.delete()
        return Response(
            {"message": "Gift deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )


gift_delete_api_view = GiftDeleteView.as_view()


class AddBoxesToCampaignView(generics.GenericAPIView):
    serializer_class = BoxSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["create_campaign"]

    @extend_schema(
        request=AddBoxesToCampaignSerializer,
        description="Add boxes to a given campaign.",
        responses={200: BoxSerializer(many=True)},
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("campaign_id", OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
    )
    def post(self, request, campaign_id, *args, **kwargs):
        """
        Add boxes to a given campaign.
        """
        campaign = get_object_or_404(
            Campaign, id=campaign_id, company__owner=request.user
        )

        print("campaign", campaign, campaign.pkid, campaign.id, campaign.num_boxes)

        box_ids = request.data.get("box_ids", [])

        boxes = Box.objects.filter(
            id__in=box_ids, user=request.user, box_campaign__isnull=True
        )
        print(boxes)

        for box in boxes:
            box.box_campaign = campaign
            campaign.num_boxes += 1
            box.save()

        campaign.save()
        serializer = self.get_serializer(boxes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


add_boxes_to_campaign_api_view = AddBoxesToCampaignView.as_view()


class NotificationsView(generics.GenericAPIView):
    serializer_class = ShowNotificationSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_notification"]

    @extend_schema(
        request=ShowNotificationSerializer,
        responses=ShowNotificationSerializer(many=True),
        description="Retrieve all notifications for the authenticated user.",
        tags=["Notifications"],
    )
    def get(self, request, *args, **kwargs):
        notifications = Notification.objects.filter(user=request.user).order_by(
            "-timestamp"
        )
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


notifications_api_view = NotificationsView.as_view()


class MarkNotificationReadView(generics.GenericAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = [APIKeyAuthentication]

    @extend_schema(
        request=NotificationSerializer,
        responses=NotificationSerializer,
        description="Mark a notification as read.",
        tags=["Notifications"],
    )
    def get(self, request, notification_id, *args, **kwargs):
        notification = get_object_or_404(Notification, id=notification_id)
        notification.read = True
        notification.save()
        return Response({"success": True}, status=status.HTTP_200_OK)


mark_notification_read_api_view = MarkNotificationReadView.as_view()


class BoxCategoryListCreateView(generics.GenericAPIView):
    serializer_class = BoxCategorySerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_box_category"]

    @extend_schema(
        request=None,
        responses=BoxCategorySerializer(many=True),
        description="Retrieve list of box categories.",
        tags=["Box Category"],
    )
    def get(self, request, *args, **kwargs):
        box_categories = BoxCategory.objects.all()
        serializer = self.get_serializer(box_categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=BoxCategorySerializer,
        responses=BoxCategorySerializer,
        description="Create a new box category.",
        tags=["Box Category"],
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


box_category_list_create_api_view = BoxCategoryListCreateView.as_view()


class BoxCategoryRetrieveUpdateDestroyView(generics.GenericAPIView):
    serializer_class = BoxCategorySerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_box_category"]

    def get_object(self):
        box_category_id = self.kwargs.get("id")
        box_category = get_object_or_404(BoxCategory, id=box_category_id)
        return box_category

    @extend_schema(
        request=BoxCategorySerializer,
        responses=BoxCategorySerializer,
        description="Retrieve a box category.",
        tags=["Box Category"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH),
        ],
    )
    def get(self, request, *args, **kwargs):
        box_category = self.get_object()
        serializer = self.get_serializer(box_category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=BoxCategorySerializer,
        responses=BoxCategorySerializer,
        description="Update a box category.",
        tags=["Box Category"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH),
        ],
    )
    def put(self, request, *args, **kwargs):
        box_category = self.get_object()
        serializer = self.get_serializer(box_category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=BoxCategorySerializer,
        responses=BoxCategorySerializer,
        description="Delete a box category.",
        tags=["Box Category"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH),
        ],
    )
    def delete(self, request, *args, **kwargs):
        box_category = self.get_object()
        box_category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


box_category_retrieve_update_destroy_api_view = (
    BoxCategoryRetrieveUpdateDestroyView.as_view()
)


class CompanyApiKeyUsageView(generics.GenericAPIView):
    serializer_class = CompanyApiKeyUsageResponseSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_dashboard"]

    @extend_schema(
        request=None,
        description="Retrieve API keys info",
        responses={
            200: CompanyApiKeyUsageResponseSerializer,
        },
        tags=["Company API Key Usage"],
    )
    def get(self, request, *args, **kwargs):
        company = Company.objects.filter(owner=request.user).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        total_requests = CompanyApiKey.objects.filter(company=company).aggregate(
            total_requests=Sum("num_of_requests_made")
        )["total_requests"]

        api_keys = CompanyApiKey.objects.filter(company=company)
        results = CompanyAPIKeySerializer(api_keys, many=True).data

        response_data = {
            "metrics": {
                "total_requests": total_requests
            },
            "results": results
        }

        return Response(response_data, status=status.HTTP_200_OK)


company_api_key_usage_view = CompanyApiKeyUsageView.as_view()


class CompanyApiKeyUsageByIDView(generics.GenericAPIView):
    serializer_class = CompanyAPIKeySerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_dashboard"]

    @extend_schema(
        request=None,
        description="Retrieve total number of requests made by company API keys.",
        responses={"total_requests": OpenApiTypes.INT},
        tags=["Company API Key Usage"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH),
        ],
    )
    def get(self, request, id, *args, **kwargs):
        company = Company.objects.filter(id=id).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        total_requests = CompanyApiKey.objects.filter(company=company).aggregate(
            total_requests=Sum("num_of_requests_made")
        )["total_requests"]

        return Response({"total_requests": total_requests}, status=status.HTTP_200_OK)


company_api_key_usage_by_id_view = CompanyApiKeyUsageByIDView.as_view()


class RegenerateApiKeyView(generics.GenericAPIView):
    serializer_class = None
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_dashboard"]

    @extend_schema(
        description="Regenerate an API key for the logged-in company's API key.",
        responses=CompanyAPIKeySerializer,
        tags=["Company Area"],
    )
    def post(self, request, *args, **kwargs):
        company = Company.objects.filter(owner=request.user).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        api_key_id = request.data.get('api_key')
        if not api_key_id:
            return Response(
                {"message": "API key ID is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            api_key = CompanyApiKey.objects.get(company=company, id=api_key_id)
        except CompanyApiKey.DoesNotExist:
            return Response(
                {"message": "API key not found."}, status=status.HTTP_404_NOT_FOUND
            )

        api_key.regenerate_key()

        serializer = CompanyAPIKeySerializer(api_key)
        return Response(serializer.data, status=status.HTTP_200_OK)


regenerate_api_key_view = RegenerateApiKeyView.as_view()


class CompanyView(generics.GenericAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_dashboard"]

    @extend_schema(
        request=None,
        description="Get company details.",
        responses=CompanySerializer,
        tags=["Company Area"],
    )
    def get(self, request, *args, **kwargs):
        company = Company.objects.filter(owner=request.user).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)


company_api_view = CompanyView.as_view()


class CompanyDetailsView(generics.GenericAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_dashboard"]

    @extend_schema(
        request=CompanySerializer,
        description="Get company details.",
        responses=CompanySerializer,
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH),
        ],
    )
    def get(self, request, id, *args, **kwargs):
        company = Company.objects.filter(id=id, owner=request.user).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UpdateCompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)


company_details_api_view = CompanyDetailsView.as_view()


class UpdateSettingsView(generics.GenericAPIView):
    serializer_class = UpdateCompanySerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["edit_company_settings"]

    @extend_schema(
        request=UpdateCompanySerializer,
        description="Update company settings.",
        responses=UpdateCompanySerializer,
        tags=["Company Area"],
    )
    def put(self, request, *args, **kwargs):
        company = get_object_or_404(Company, owner=request.user)
        serializer = self.get_serializer(
            instance=company, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Settings updated successfully."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


update_settings_api_view = UpdateSettingsView.as_view()


class CompanyUsersByIDView(generics.GenericAPIView):
    serializer_class = CompanyUserSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_dashboard"]

    @extend_schema(
        request=None,
        description="Retrieve list of users for company by id.",
        responses=CompanyUserSerializer(many=True),
        tags=["Company Users"],
        parameters=[
            OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH),
        ],
    )
    def get(self, request, id, *args, **kwargs):
        company = Company.objects.filter(id=id).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        company_users = company.get_company_users()
        serializer = CompanyUserSerializer(
            company_users, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


company_users_by_id_api_view = CompanyUsersByIDView.as_view()


class CompanyUsersView(generics.GenericAPIView):
    serializer_class = CompanyUserSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_dashboard"]

    @extend_schema(
        request=None,
        description="Retrieve list of users for authenticated company.",
        responses=CompanyUserSerializer(many=True),
        tags=["Company Users"],
    )
    def get(self, request, *args, **kwargs):
        company = Company.objects.filter(owner=request.user).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        company_users = company.get_company_users()
        serializer = CompanyUserSerializer(
            company_users, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


company_users_api_view = CompanyUsersView.as_view()


class CompanyBoxesListView(generics.ListAPIView):
    serializer_class = CompanyBoxesSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_boxes"]

    @extend_schema(
        request=None,
        description="Retrieve list of boxes available for the authenticated company.",
        responses=CompanyBoxesSerializer(many=True),
        tags=["Company Area"],
    )
    def get(self, request, *args, **kwargs):
        company = Company.objects.filter(owner=request.user).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        company_boxes = CompanyBoxes.objects.filter(company=company)
        serializer = self.get_serializer(instance=company_boxes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


company_boxes_list_api_view = CompanyBoxesListView.as_view()


class AddCompanyBoxesView(generics.GenericAPIView):
    serializer_class = CreateCompanyBoxSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["add_company_boxes"]

    @extend_schema(
        request=CreateCompanyBoxSerializer,
        description="Add company boxes.",
        responses={"200": CompanyBoxesSerializer},
        tags=["Company Area"],
    )
    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response(
                {"detail": "Cannot perform this action"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company = get_object_or_404(Company, owner=request.user)
        box_type = serializer.validated_data["box_type"]
        qty = serializer.validated_data["qty"]
        box_type = get_object_or_404(BoxCategory, id=box_type.id)
        available_boxes = box_type.qty

        if available_boxes < qty:
            return Response(
                {
                    "message": "Only {} boxes are available for this type.".format(
                        available_boxes
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        box_type.qty -= qty
        box_type.save(update_fields=["qty"])

        # check if company already has boxes of this type
        company_box = CompanyBoxes.objects.filter(
            company=company, box_type=box_type
        ).first()
        if company_box:
            company_box.qty += qty
            company_box.save(update_fields=["qty"])
            return Response(
                {"message": "Company Box updated successfully."},
                status=status.HTTP_200_OK,
            )

        serializer.save(company=company)
        return Response(
            {
                "message": "Company Box allocation created successfully.",
                "results": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


add_company_boxes_api_view = AddCompanyBoxesView.as_view()


class UpdateCompanyBoxesView(generics.GenericAPIView):
    serializer_class = CompanyBoxesSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["edit_company_boxes"]

    @extend_schema(
        request=CompanyBoxesSerializer,
        description="Update company boxes.",
        responses=CompanyBoxesSerializer,
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("box_type_id", OpenApiTypes.INT, OpenApiParameter.PATH),
        ],
    )
    def put(self, request, box_type_id, *args, **kwargs):
        company = Company.objects.filter(owner=request.user).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        company_boxes = get_object_or_404(
            CompanyBoxes, box_type__id=box_type_id, company=company
        )
        serializer = self.get_serializer(
            instance=company_boxes, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Company Box updated successfully."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


update_company_boxes_api_view = UpdateCompanyBoxesView.as_view()


class CompanyBoxesDetailView(generics.GenericAPIView):
    serializer_class = CompanyBoxesSerializer
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]
    required_permissions = ["view_company_boxes"]

    @extend_schema(
        request=CompanyBoxesSerializer,
        description="Retrieve a company box by box type (category) id.",
        responses=CompanyBoxesSerializer,
        tags=["Company Area"],
        parameters=[
            OpenApiParameter("box_type_id", OpenApiTypes.INT, OpenApiParameter.PATH),
        ],
    )
    def get(self, request, box_type_id, *args, **kwargs):
        company = Company.objects.filter(owner=request.user).first()
        if not company:
            return Response(
                {"message": "Company not found."}, status=status.HTTP_404_NOT_FOUND
            )

        company_boxes = get_object_or_404(CompanyBoxes, id=box_type_id, company=company)
        serializer = self.get_serializer(company_boxes)
        return Response(serializer.data, status=status.HTTP_200_OK)


company_boxes_detail_api_view = CompanyBoxesDetailView.as_view()


# analytic views
class BoxAnalyticsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses=BoxAnalyticsSerializer,
        description="Get analytics for boxes related to the logged-in company",
        examples=[
            OpenApiExample(
                "Example response",
                value={
                    "total_boxes": 100,
                    "boxes_last_month": 40,
                    "boxes_this_month": 60,
                    "boxes_percentage_increase": 50.0,
                },
            )
        ],
    )
    def get(self, request):
        company = request.user.company
        total_boxes = Box.objects.filter(box_campaign__company=company).count()
        boxes_last_month = Box.objects.filter(
            box_campaign__company=company, created_at__month=now().month - 1
        ).count()
        boxes_this_month = Box.objects.filter(
            box_campaign__company=company, created_at__month=now().month
        ).count()
        boxes_percentage_increase = (
            ((boxes_this_month - boxes_last_month) / boxes_last_month) * 100
            if boxes_last_month
            else 0
        )

        data = {
            "total_boxes": total_boxes,
            "boxes_last_month": boxes_last_month,
            "boxes_this_month": boxes_this_month,
            "boxes_percentage_increase": boxes_percentage_increase,
        }

        serializer = BoxAnalyticsSerializer(data)
        return Response(serializer.data)


class GiftAnalyticsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]

    @extend_schema(
        responses=GiftAnalyticsSerializer,
        description="Get analytics for gifts related to the logged-in company",
        examples=[
            OpenApiExample(
                "Example response",
                value={
                    "total_gifts": 100,
                    "gifts_last_month": 40,
                    "gifts_this_month": 60,
                    "gifts_percentage_increase": 50.0,
                },
            )
        ],
    )
    def get(self, request):
        company = request.user.company
        total_gifts = Gift.objects.filter(gift_campaign__company=company).count()
        gifts_last_month = Gift.objects.filter(
            gift_campaign__company=company, created_at__month=now().month - 1
        ).count()
        gifts_this_month = Gift.objects.filter(
            gift_campaign__company=company, created_at__month=now().month
        ).count()
        gifts_percentage_increase = (
            ((gifts_this_month - gifts_last_month) / gifts_last_month) * 100
            if gifts_last_month
            else 0
        )

        data = {
            "total_gifts": total_gifts,
            "gifts_last_month": gifts_last_month,
            "gifts_this_month": gifts_this_month,
            "gifts_percentage_increase": gifts_percentage_increase,
        }

        serializer = GiftAnalyticsSerializer(data)
        return Response(serializer.data)


class GiftVisitAnalyticsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]

    @extend_schema(
        responses=GiftVisitAnalyticsSerializer,
        description="Get analytics for gift visits related to the logged-in company",
        examples=[
            OpenApiExample(
                "Example response",
                value={
                    "total_gift_visits": 150,
                    "gift_visits_last_month": 50,
                    "gift_visits_this_month": 100,
                    "gift_visits_percentage_increase": 100.0,
                },
            )
        ],
    )
    def get(self, request):
        company = request.user.company
        total_gift_visits = GiftVisit.objects.filter(gift__gift_campaign__company=company).count()
        gift_visits_last_month = GiftVisit.objects.filter(
            gift__gift_campaign__company=company, created_at__month=now().month - 1
        ).count()
        gift_visits_this_month = GiftVisit.objects.filter(
            gift__gift_campaign__company=company, created_at__month=now().month
        ).count()
        gift_visits_percentage_increase = (
            ((gift_visits_this_month - gift_visits_last_month) / gift_visits_last_month)
            * 100
            if gift_visits_last_month
            else 0
        )

        data = {
            "total_gift_visits": total_gift_visits,
            "gift_visits_last_month": gift_visits_last_month,
            "gift_visits_this_month": gift_visits_this_month,
            "gift_visits_percentage_increase": gift_visits_percentage_increase,
        }

        serializer = GiftVisitAnalyticsSerializer(data)
        return Response(serializer.data)


class CampaignAnalyticsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]

    @extend_schema(
        responses=CampaignAnalyticsSerializer,
        description="Get analytics for campaigns related to the logged-in company",
        examples=[
            OpenApiExample(
                "Example response",
                value={
                    "total_campaigns": 20,
                    "campaigns_last_month": 5,
                    "campaigns_this_month": 15,
                    "campaigns_percentage_increase": 200.0,
                },
            )
        ],
    )
    def get(self, request):
        company = request.user.company
        total_campaigns = Campaign.objects.filter(company=company).count()
        campaigns_last_month = Campaign.objects.filter(
            company=company, created_at__month=now().month - 1
        ).count()
        campaigns_this_month = Campaign.objects.filter(
            company=company, created_at__month=now().month
        ).count()
        campaigns_percentage_increase = (
            ((campaigns_this_month - campaigns_last_month) / campaigns_last_month) * 100
            if campaigns_last_month
            else 0
        )

        data = {
            "total_campaigns": total_campaigns,
            "campaigns_last_month": campaigns_last_month,
            "campaigns_this_month": campaigns_this_month,
            "campaigns_percentage_increase": campaigns_percentage_increase,
        }

        serializer = CampaignAnalyticsSerializer(data)
        return Response(serializer.data)


class CombinedAnalyticsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]

    @extend_schema(
        responses=CombinedAnalyticsSerializer,
        description="Get combined analytics for gifts, gift visits, campaigns, and boxes related to the logged-in company",
        examples=[
            OpenApiExample(
                "Example response",
                value={
                    "gifts": {
                        "total_gifts": 100,
                        "gifts_last_month": 40,
                        "gifts_this_month": 60,
                        "gifts_percentage_increase": 50.0,
                    },
                    "gift_visits": {
                        "total_gift_visits": 150,
                        "gift_visits_last_month": 50,
                        "gift_visits_this_month": 100,
                        "gift_visits_percentage_increase": 100.0,
                    },
                    "campaigns": {
                        "total_campaigns": 20,
                        "campaigns_last_month": 5,
                        "campaigns_this_month": 15,
                        "campaigns_percentage_increase": 200.0,
                    },
                    "boxes": {
                        "total_boxes": 100,
                        "boxes_last_month": 40,
                        "boxes_this_month": 60,
                        "boxes_percentage_increase": 50.0,
                    },
                },
            )
        ],
    )
    def get(self, request):
        company = request.user.company

        total_gifts = Gift.objects.filter(gift_campaign__company=company).count()
        gifts_last_month = Gift.objects.filter(
            gift_campaign__company=company, created_at__month=now().month - 1
        ).count()
        gifts_this_month = Gift.objects.filter(
            gift_campaign__company=company, created_at__month=now().month
        ).count()
        gifts_percentage_increase = (
            ((gifts_this_month - gifts_last_month) / gifts_last_month) * 100
            if gifts_last_month
            else 0
        )

        total_gift_visits = GiftVisit.objects.filter(gift__gift_campaign__company=company).count()
        gift_visits_last_month = GiftVisit.objects.filter(
            gift__gift_campaign__company=company, created_at__month=now().month - 1
        ).count()
        gift_visits_this_month = GiftVisit.objects.filter(
            gift__gift_campaign__company=company, created_at__month=now().month
        ).count()
        gift_visits_percentage_increase = (
            ((gift_visits_this_month - gift_visits_last_month) / gift_visits_last_month)
            * 100
            if gift_visits_last_month
            else 0
        )

        total_campaigns = Campaign.objects.filter(company=company).count()
        campaigns_last_month = Campaign.objects.filter(
            company=company, created_at__month=now().month - 1
        ).count()
        campaigns_this_month = Campaign.objects.filter(
            company=company, created_at__month=now().month
        ).count()
        campaigns_percentage_increase = (
            ((campaigns_this_month - campaigns_last_month) / campaigns_last_month) * 100
            if campaigns_last_month
            else 0
        )

        total_boxes = Box.objects.filter(box_campaign__company=company).count()
        boxes_last_month = Box.objects.filter(
            box_campaign__company=company, created_at__month=now().month - 1
        ).count()
        boxes_this_month = Box.objects.filter(
            box_campaign__company=company, created_at__month=now().month
        ).count()
        boxes_percentage_increase = (
            ((boxes_this_month - boxes_last_month) / boxes_last_month) * 100
            if boxes_last_month
            else 0
        )

        data = {
            "gifts": {
                "total_gifts": total_gifts,
                "gifts_last_month": gifts_last_month,
                "gifts_this_month": gifts_this_month,
                "gifts_percentage_increase": gifts_percentage_increase,
            },
            "gift_visits": {
                "total_gift_visits": total_gift_visits,
                "gift_visits_last_month": gift_visits_last_month,
                "gift_visits_this_month": gift_visits_this_month,
                "gift_visits_percentage_increase": gift_visits_percentage_increase,
            },
            "campaigns": {
                "total_campaigns": total_campaigns,
                "campaigns_last_month": campaigns_last_month,
                "campaigns_this_month": campaigns_this_month,
                "campaigns_percentage_increase": campaigns_percentage_increase,
            },
            "boxes": {
                "total_boxes": total_boxes,
                "boxes_last_month": boxes_last_month,
                "boxes_this_month": boxes_this_month,
                "boxes_percentage_increase": boxes_percentage_increase,
            },
        }

        serializer = CombinedAnalyticsSerializer(data)
        return Response(serializer.data)


class CompanyDashboardChartData(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APIPermissionValidator]
    authentication_classes = [APIKeyAuthentication]

    @extend_schema(
        responses=CompanyDashboardChartSerializer,
        description="Get combined analytics for boxes and campaigns related to the logged-in company for each month from January to December",
        examples=[
            OpenApiExample(
                "Example response",
                value={
                    "boxes": [
                        {"month": "January", "total_boxes": 100},
                        {"month": "February", "total_boxes": 120},
                    ],
                    "campaigns": [
                        {"month": "January", "total_campaigns": 20},
                        {"month": "February", "total_campaigns": 25},
                    ]
                },
            )
        ],
    )
    def get(self, request):
        company = request.user.company
        current_year = now().year
        months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]
        
        boxes_data = []
        campaigns_data = []

        for month_index in range(1, 13):
            month_name = datetime(current_year, month_index, 1).strftime("%B")
            total_boxes = Box.objects.filter(
                box_campaign__company=company, created_at__year=current_year, created_at__month=month_index
            ).count()

            total_campaigns = Campaign.objects.filter(
                company=company, created_at__year=current_year, created_at__month=month_index
            ).count()

            boxes_data.append({
                "month": month_name,
                "total_boxes": total_boxes,
            })

            campaigns_data.append({
                "month": month_name,
                "total_campaigns": total_campaigns,
            })

        data = {
            "boxes": boxes_data,
            "campaigns": campaigns_data,
        }

        return Response(data)


company_dashboard_chart_data = CompanyDashboardChartData.as_view()