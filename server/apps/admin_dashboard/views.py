from rest_framework import generics, status, filters as drf_filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters import rest_framework as django_filters
from django.db import transaction
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from apps.company_dashboard.views import CampaignCreateView
from apps.gft.models import Box, BoxCategory, Campaign, Company, CompanyApiKey, CompanyBoxes, Config, Gift
from helpers.utils import ImageUploader
from .serializers import AdminBoxCategorySerializer, AdminBoxSerializer, AdminCampaignDetailSerializer, AdminCampaignSerializer, AdminCreateCampaignSerializer, AdminGiftSerializer, CompanyApiKeyReadSerializer, AdminCompanySerializer, CompanyApiKeyWriteSerializer, ConfigSerializer, UserSerializer
from .filters import UserFilter

User = get_user_model()

class BoxListView(generics.GenericAPIView):
    queryset = Box.objects.all()
    serializer_class = AdminBoxSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="List all boxes.",
        responses={200: AdminBoxSerializer(many=True)},
        tags=["Admin Area"]
    )
    def get(self, request, *args, **kwargs):
        """
        List all boxes.
        """
        boxes = self.get_queryset()
        serializer = self.get_serializer(boxes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
box_list_view = BoxListView.as_view()


class BoxCreateView(generics.GenericAPIView):
    queryset = Box.objects.all()
    serializer_class = AdminBoxSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Create a new box.",
        request=AdminBoxSerializer,
        responses={201: AdminBoxSerializer},
        tags=["Admin Area"]
    )
    def post(self, request, *args, **kwargs):
        """
        Create a new box.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


box_create_view = BoxCreateView.as_view()


class BoxDetailView(generics.GenericAPIView):
    queryset = Box.objects.all()
    serializer_class = AdminBoxSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Retrieve a box by ID.",
        responses={200: AdminBoxSerializer},
        tags=["Admin Area"]
    )
    def get(self, request, box_id, *args, **kwargs):
        """
        Retrieve a box by ID.
        """
        box = self.get_object()
        serializer = self.get_serializer(box)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def get_object(self):
        return generics.get_object_or_404(Box, id=self.kwargs['box_id'])


box_detail_view = BoxDetailView.as_view()


class BoxUpdateView(generics.GenericAPIView):
    queryset = Box.objects.all()
    serializer_class = AdminBoxSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Update a box by ID.",
        request=AdminBoxSerializer,
        responses={200: AdminBoxSerializer},
        tags=["Admin Area"]
    )
    def put(self, request, box_id, *args, **kwargs):
        """
        Update a box by ID.
        """
        box = self.get_object()
        serializer = self.get_serializer(box, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def get_object(self):
        return generics.get_object_or_404(Box, id=self.kwargs['box_id'])


box_update_view = BoxUpdateView.as_view()


class BoxDeleteView(generics.GenericAPIView):
    queryset = Box.objects.all()
    serializer_class = AdminBoxSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Delete a box by ID.",
        responses={204: None},
        tags=["Admin Area"]
    )
    def delete(self, request, box_id, *args, **kwargs):
        """
        Delete a box by ID.
        """
        box = self.get_object()
        box.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def get_object(self):
        return generics.get_object_or_404(Box, id=self.kwargs['box_id'])


box_delete_view = BoxDeleteView.as_view()


class GiftListView(generics.GenericAPIView):
    queryset = Gift.objects.all()
    serializer_class = AdminGiftSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="List all gifts.",
        responses={200: AdminGiftSerializer(many=True)},
        tags=["Admin Area"]
    )
    def get(self, request, *args, **kwargs):
        """
        List all gifts.
        """
        gifts = self.get_queryset()
        serializer = self.get_serializer(gifts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


gift_list_view = GiftListView.as_view()


class GiftCreateView(generics.GenericAPIView):
    queryset = Gift.objects.all()
    serializer_class = AdminGiftSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Create a new gift.",
        request=AdminGiftSerializer,
        responses={201: AdminGiftSerializer},
        tags=["Admin Area"]
    )
    def post(self, request, *args, **kwargs):
        """
        Create a new gift.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

gift_create_view = GiftCreateView.as_view()


class GiftDetailView(generics.GenericAPIView):
    queryset = Gift.objects.all()
    serializer_class = AdminGiftSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Retrieve a gift by ID.",
        responses={200: AdminGiftSerializer},
        tags=["Admin Area"]
    )
    def get(self, request, gift_id, *args, **kwargs):
        """
        Retrieve a gift by ID.
        """
        gift = self.get_object()
        serializer = self.get_serializer(gift)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_object(self):
        return generics.get_object_or_404(Gift, id=self.kwargs['gift_id'])


gift_detail_view = GiftDetailView.as_view()


class GiftUpdateView(generics.GenericAPIView):
    queryset = Gift.objects.all()
    serializer_class = AdminGiftSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Update a gift by ID.",
        request=AdminGiftSerializer,
        responses={200: AdminGiftSerializer},
        tags=["Admin Area"]
    )
    def put(self, request, gift_id, *args, **kwargs):
        """
        Update a gift by ID.
        """
        gift = self.get_object()
        serializer = self.get_serializer(gift, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        return generics.get_object_or_404(Gift, id=self.kwargs['gift_id'])


gift_update_view = GiftUpdateView.as_view()


class GiftDeleteView(generics.GenericAPIView):
    queryset = Gift.objects.all()
    serializer_class = AdminGiftSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Delete a gift by ID.",
        responses={204: None},
        tags=["Admin Area"]
    )
    def delete(self, request, gift_id, *args, **kwargs):
        """
        Delete a gift by ID.
        """
        gift = self.get_object()
        gift.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_object(self):
        return generics.get_object_or_404(Gift, id=self.kwargs['gift_id'])


gift_delete_view = GiftDeleteView.as_view()


@extend_schema_view(
    get=extend_schema(
        description="Retrieve a list of users with search, filtering, and sorting options.",
        responses={200: UserSerializer(many=True)},
        tags=["Admin Users"]
    ),
    post=extend_schema(
        description="Create a new user.",
        request=UserSerializer,
        responses={201: UserSerializer},
        tags=["Admin Users"]
    ),
)
class UserListView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [django_filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter]
    filterset_class = UserFilter
    search_fields = ['username', 'email', 'mobile']
    ordering_fields = ['username', 'email', 'mobile', 'user_type', 'provider']

    def get(self, request, *args, **kwargs):
        users = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


user_list_and_create_api_view = UserListView.as_view()


@extend_schema_view(
    get=extend_schema(
        description="Retrieve a user by ID.",
        responses={200: UserSerializer},
        tags=["Admin Users"]
    ),
    put=extend_schema(
        description="Update a user by ID.",
        request=UserSerializer,
        responses={200: UserSerializer},
        tags=["Admin Users"]
    ),
    delete=extend_schema(
        description="Delete a user by ID.",
        responses={204: None},
        tags=["Admin Users"]
    ),
)
class UserDetailView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


user_details_update_and_delete_view = UserDetailView.as_view()


class CreateBoxCategoryView(generics.GenericAPIView):
    serializer_class = AdminBoxCategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        request=AdminBoxCategorySerializer,
        responses={201: AdminBoxCategorySerializer},
        description="Create a new box category.",
        tags=["Admin Area"]
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


create_box_category_view = CreateBoxCategoryView.as_view()


class BoxCategoryListView(generics.GenericAPIView):
    serializer_class = AdminBoxCategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        responses={200: AdminBoxCategorySerializer(many=True)},
        description="Retrieve a list of box categories.",
        tags=["Admin Area"]
    )
    def get(self, request, *args, **kwargs):
        box_categories = BoxCategory.objects.all()
        serializer = self.get_serializer(box_categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


box_category_list_view = BoxCategoryListView.as_view()


class BoxCategoryDetailView(generics.GenericAPIView):
    serializer_class = AdminBoxCategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        responses={200: AdminBoxCategorySerializer},
        description="Retrieve details of a box category.",
        tags=["Admin Area"]
    )
    def get(self, request, id, *args, **kwargs):
        box_category = get_object_or_404(BoxCategory, id=id)
        serializer = self.get_serializer(box_category)
        return Response(serializer.data, status=status.HTTP_200_OK)


box_category_detail_view = BoxCategoryDetailView.as_view()


class UpdateBoxCategoryView(generics.GenericAPIView):
    serializer_class = AdminBoxCategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        request=AdminBoxCategorySerializer,
        responses={200: AdminBoxCategorySerializer},
        description="Update a box category.",
        tags=["Admin Area"]
    )
    def put(self, request, id, *args, **kwargs):
        box_category = get_object_or_404(BoxCategory, id=id)
        serializer = self.get_serializer(box_category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


update_box_category_view = UpdateBoxCategoryView.as_view()


class DeleteBoxCategoryView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        responses={204: None},
        description="Delete a box category.",
        tags=["Admin Area"]
    )
    def delete(self, request, id, *args, **kwargs):
        box_category = get_object_or_404(BoxCategory, id=id)
        box_category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


delete_box_category_view = DeleteBoxCategoryView.as_view()


class CreateCampaignView(generics.GenericAPIView):
    serializer_class = AdminCreateCampaignSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Create a new campaign from the admin.",
        request=AdminCreateCampaignSerializer,
        responses={201: AdminCampaignSerializer},
        tags=["Admin Area"]
    )
    def post(self, request, *args, **kwargs):
        """
        Create a new campaign.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            company_id = serializer.validated_data['company_id']
            campaign_name = serializer.validated_data['name']
            company_box_id = serializer.validated_data['company_boxes'].id
            num_boxes = serializer.validated_data['num_boxes']
            header_image = serializer.validated_data['header_image']

            # duration should come from the name of the company box boxtype
            company_box = CompanyBoxes.objects.filter(id=company_box_id).first()
            duration = company_box.box_type.category

            if num_boxes > company_box.qty:
                return Response(
                    {"detail": f'Not enough boxes available for {company_box.box_type.name}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # reduce number of company boxes by the number of boxes created
            company_box.qty -= num_boxes
            company_box.save()

            # validate image
            image_validator = ImageUploader()
            valid_image = image_validator.is_valid_image(header_image) if header_image else True
            if not valid_image:
                return Response({"detail": "Invalid image uploaded"}, status=status.HTTP_400_BAD_REQUEST)

            campaign = Campaign.objects.create(
                company_id=company_id,
                name=campaign_name,
                company_boxes=company_box,
                duration=int(duration),
                num_boxes=num_boxes,
                header_image=header_image
            )

            serializer = AdminCampaignSerializer(campaign)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


campaign_create_api_view = CampaignCreateView.as_view()


class CampaignListView(generics.GenericAPIView):
    queryset = Campaign.objects.all()
    serializer_class = AdminCampaignSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="List all campaigns.",
        responses={200: AdminCampaignSerializer(many=True)},
        tags=["Admin Area"]
    )
    def get(self, request, *args, **kwargs):
        """
        List all campaigns.
        """
        campaigns = self.get_queryset()
        serializer = self.get_serializer(campaigns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


campaign_list_api_view = CampaignListView.as_view()


class CampaignDetailView(generics.GenericAPIView):
    queryset = Campaign.objects.all()
    serializer_class = AdminCampaignDetailSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Retrieve a campaign by ID.",
        responses={200: AdminCampaignDetailSerializer},
        tags=["Admin Area"]
    )
    def get(self, request, id, *args, **kwargs):
        """
        Retrieve a campaign by ID.
        """
        campaign = self.get_object()
        serializer = self.get_serializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_object(self):
        return get_object_or_404(Campaign, id=self.kwargs['id'])


campaign_detail_api_view = CampaignDetailView.as_view()


class UpdateCampaignView(generics.GenericAPIView):
    queryset = Campaign.objects.all()
    serializer_class = AdminCampaignSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Update a campaign by ID.",
        request=AdminCampaignSerializer,
        responses={200: AdminCampaignSerializer},
        tags=["Admin Area"]
    )
    def put(self, request, id, *args, **kwargs):
        """
        Update a campaign by ID.
        """
        campaign = self.get_object()
        serializer = self.get_serializer(campaign, data=request.data, partial=True)
        if serializer.is_valid():
            header_image = serializer.validated_data.get('header_image')

            image_validator = ImageUploader()
            valid_image = image_validator.is_valid_image(header_image) if header_image else True
            if not valid_image:
                return Response({"detail": "Invalid image uploaded"}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        return get_object_or_404(Campaign, id=self.kwargs['id'])


campaign_update_api_view = UpdateCampaignView.as_view()


class DeleteCampaignView(generics.GenericAPIView):
    queryset = Campaign.objects.all()
    serializer_class = AdminCampaignSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Delete a campaign by ID.",
        responses={204: None},
        tags=["Admin Area"]
    )
    def delete(self, request, id, *args, **kwargs):
        """
        Delete a campaign by ID.
        """
        campaign = self.get_object()
        campaign.is_deleted = True
        campaign.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_object(self):
        return get_object_or_404(Campaign, id=self.kwargs['id'])


campaign_delete_api_view = DeleteCampaignView.as_view()


class CompanyListView(generics.GenericAPIView):
    serializer_class = AdminCompanySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        responses={200: AdminCompanySerializer(many=True)},
        description="Retrieve a list of all companies.",
        tags=["Admin Area"]
    )
    def get(self, request, *args, **kwargs):
        companies = Company.objects.all()
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

company_list_view = CompanyListView.as_view()


class CompanyCreateView(generics.GenericAPIView):
    serializer_class = AdminCompanySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        request=AdminCompanySerializer,
        responses={201: AdminCompanySerializer},
        description="Create a new company.",
        tags=["Admin Area"]
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

company_create_view = CompanyCreateView.as_view()


class CompanyDetailView(generics.GenericAPIView):
    serializer_class = AdminCompanySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        responses={200: AdminCompanySerializer},
        description="Retrieve details of a specific company.",
        tags=["Admin Area"]
    )
    def get(self, request, id, *args, **kwargs):
        company = get_object_or_404(Company, pk=id)
        serializer = self.get_serializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)

company_detail_view = CompanyDetailView.as_view()


class CompanyUpdateView(generics.GenericAPIView):
    serializer_class = AdminCompanySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        request=AdminCompanySerializer,
        responses={200: AdminCompanySerializer},
        description="Update a specific company.",
        tags=["Admin Area"]
    )
    def put(self, request, id, *args, **kwargs):
        company = get_object_or_404(Company, pk=id)
        serializer = self.get_serializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

company_update_view = CompanyUpdateView.as_view()


class CompanyDeleteView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        responses={204: None},
        description="Delete a specific company.",
        tags=["Admin Area"]
    )
    def delete(self, request, id, *args, **kwargs):
        company = get_object_or_404(Company, pk=id)
        company.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

company_delete_view = CompanyDeleteView.as_view()


class CompanyApiKeyListView(generics.GenericAPIView):
    serializer_class = CompanyApiKeyReadSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: CompanyApiKeyReadSerializer(many=True)},
        description="Retrieve a list of all company API keys.",
        tags=["Admin Area"]
    )
    def get(self, request, *args, **kwargs):
        api_keys = CompanyApiKey.objects.all()
        serializer = self.get_serializer(api_keys, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

company_api_key_list_view = CompanyApiKeyListView.as_view()


class CompanyApiKeyCreateView(generics.GenericAPIView):
    serializer_class = CompanyApiKeyWriteSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=CompanyApiKeyWriteSerializer,
        responses={201: CompanyApiKeyReadSerializer},
        description="Create a new company API key.",
        tags=["Admin Area"]
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(CompanyApiKeyReadSerializer(serializer.instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

company_api_key_create_view = CompanyApiKeyCreateView.as_view()


class CompanyApiKeyDetailView(generics.GenericAPIView):
    serializer_class = CompanyApiKeyReadSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: CompanyApiKeyReadSerializer},
        description="Retrieve details of a specific company API key.",
        tags=["Admin Area"]
    )
    def get(self, request, id, *args, **kwargs):
        api_key = get_object_or_404(CompanyApiKey, pk=id)
        serializer = self.get_serializer(api_key)
        return Response(serializer.data, status=status.HTTP_200_OK)

company_api_key_detail_view = CompanyApiKeyDetailView.as_view()


class CompanyApiKeyUpdateView(generics.GenericAPIView):
    serializer_class = CompanyApiKeyWriteSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=CompanyApiKeyWriteSerializer,
        responses={200: CompanyApiKeyReadSerializer},
        description="Update a specific company API key.",
        tags=["Admin Area"]
    )
    def put(self, request, id, *args, **kwargs):
        api_key = get_object_or_404(CompanyApiKey, pk=id)
        serializer = self.get_serializer(api_key, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(CompanyApiKeyReadSerializer(serializer.instance).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

company_api_key_update_view = CompanyApiKeyUpdateView.as_view()


class CompanyApiKeyDeleteView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={204: None},
        description="Delete a specific company API key.",
        tags=["Admin Area"]
    )
    def delete(self, request, id, *args, **kwargs):
        api_key = get_object_or_404(CompanyApiKey, pk=id)
        api_key.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

company_api_key_delete_view = CompanyApiKeyDeleteView.as_view()


class ConfigDetailView(generics.GenericAPIView):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
    permission_classes = [IsAdminUser]

    @extend_schema(
        description="Retrieve the configuration settings.",
        responses={200: ConfigSerializer},
        tags=["Admin Area"]
    )
    def get(self, request, *args, **kwargs):
        """
        Get the configuration settings.
        """
        config = self.get_queryset().first()
        if config:
            serializer = self.get_serializer(config)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "Configuration not found."}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(
        description="Update the configuration settings.",
        request=ConfigSerializer,
        responses={200: ConfigSerializer},
        tags=["Admin Area"]
    )
    def put(self, request, *args, **kwargs):
        """
        Update the configuration settings.
        """
        config = self.get_queryset().first()
        if not config:
            return Response({"detail": "Configuration not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


config_management_view = ConfigDetailView.as_view()
