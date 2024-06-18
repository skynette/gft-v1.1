from django_filters import rest_framework as filters
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    email = filters.CharFilter(lookup_expr='icontains')
    mobile = filters.CharFilter(lookup_expr='icontains')
    user_type = filters.CharFilter(lookup_expr='exact')
    provider = filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = User
        fields = ['username', 'email', 'mobile', 'user_type', 'provider']
