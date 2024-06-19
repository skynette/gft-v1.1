from rest_framework import generics, status, filters as drf_filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters import rest_framework as django_filters
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, extend_schema_view

from apps.gft.models import BoxCategory, Company, CompanyApiKey
from .serializers import AdminBoxCategorySerializer, CompanyApiKeyReadSerializer, AdminCompanySerializer, CompanyApiKeyWriteSerializer, UserSerializer
from .filters import UserFilter

User = get_user_model()


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
