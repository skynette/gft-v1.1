from django_filters import rest_framework as filters
from django.contrib.auth import get_user_model

from apps.gft.models import Box, Campaign, Company, Gift, GiftVisit, Notification

User = get_user_model()


class UserFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr="icontains")
    email = filters.CharFilter(lookup_expr="icontains")
    mobile = filters.CharFilter(lookup_expr="icontains")
    user_type = filters.CharFilter(lookup_expr="exact")
    provider = filters.CharFilter(lookup_expr="exact")

    class Meta:
        model = User
        fields = ["username", "email", "mobile", "user_type", "provider"]


class BoxFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="icontains")
    days_of_gifting = filters.NumberFilter()
    created_at = filters.DateFromToRangeFilter()

    class Meta:
        model = Box
        fields = ["title", "days_of_gifting", "created_at"]


class GiftFilter(filters.FilterSet):
    gift_title = filters.CharFilter(lookup_expr="icontains")
    open_date = filters.DateFromToRangeFilter()

    class Meta:
        model = Gift
        fields = ["gift_title", "open_date"]


class GiftVisitFilter(filters.FilterSet):
    time_of_visit = filters.DateFromToRangeFilter()
    visitor = filters.CharFilter(
        field_name="visitor__username", lookup_expr="icontains"
    )

    class Meta:
        model = GiftVisit
        fields = ["time_of_visit", "visitor"]


class CampaignFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")
    duration = filters.NumberFilter()
    created_at = filters.DateFromToRangeFilter()

    class Meta:
        model = Campaign
        fields = ["name", "duration", "created_at"]


class CompanyFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr="icontains")
    owner = filters.CharFilter(field_name="owner__username", lookup_expr="icontains")
    created_at = filters.DateFromToRangeFilter()

    class Meta:
        model = Company
        fields = ["name", "owner", "created_at"]

class NotificationFilter(filters.FilterSet):
    class Meta:
        model = Notification
        fields = {
            'user': ['exact'],
            'box': ['exact'],
            'gift': ['exact'],
            'read': ['exact'],
            'timestamp': ['gte', 'lte'],
        }