from rest_framework import generics, status, filters as drf_filters
from rest_framework.response import Response
from django_filters import rest_framework as django_filters
from drf_spectacular.utils import extend_schema, extend_schema_view
from .serializers import UserSerializer
from .filters import UserFilter

from django.contrib.auth import get_user_model

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
