from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from django_filters.rest_framework import DjangoFilterBackend
from apps.admin_dashboard.metrics_serializers import (
    BoxMetricsSerializer,
    CampaignMetricsSerializer,
    CompanyMetricsSerializer,
    GiftMetricsSerializer,
    GiftVisitMetricsSerializer,
)
from apps.gft.models import Campaign, Box, Gift, GiftVisit, Company, CompanyUser
from django.utils import timezone
from datetime import timedelta


class MetricsView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def calculate_percentage_increase(self, previous, current):
        if previous == 0:
            return 100 if current > 0 else 0
        return ((current - previous) / previous) * 100

    def get_time_range(self, request):
        period = int(request.query_params.get("period", 7))
        end_date = timezone.now()
        start_date = end_date - timedelta(days=period)
        previous_start_date = start_date - timedelta(days=period)
        previous_end_date = end_date - timedelta(days=period)
        return start_date, end_date, previous_start_date, previous_end_date


class CampaignMetricsView(MetricsView):

    @extend_schema(
        description="Retrieve metrics for all campaigns.",
        responses={
            200: OpenApiResponse(
                response=CampaignMetricsSerializer,
                examples=[
                    OpenApiExample(
                        name="Campaign Metrics Example",
                        value={
                            "total_campaigns": 10,
                            "total_boxes": 200,
                            "total_gifts": 500,
                            "percentage_increase_boxes": 20.5,
                            "percentage_increase_gifts": 15.0,
                        },
                    )
                ],
            )
        },
        tags=["Admin Metrics"],
    )
    def get(self, request, *args, **kwargs):
        start_date, end_date, prev_start_date, prev_end_date = self.get_time_range(
            request
        )

        total_campaigns = Campaign.objects.count()
        total_boxes = Box.objects.filter(
            box_campaign__in=Campaign.objects.all()
        ).count()
        total_gifts = Gift.objects.filter(
            gift_campaign__in=Campaign.objects.all()
        ).count()

        previous_boxes = Box.objects.filter(
            box_campaign__in=Campaign.objects.all(),
            created_at__range=(prev_start_date, prev_end_date),
        ).count()
        current_boxes = Box.objects.filter(
            box_campaign__in=Campaign.objects.all(),
            created_at__range=(start_date, end_date),
        ).count()

        previous_gifts = Gift.objects.filter(
            gift_campaign__in=Campaign.objects.all(),
            created_at__range=(prev_start_date, prev_end_date),
        ).count()
        current_gifts = Gift.objects.filter(
            gift_campaign__in=Campaign.objects.all(),
            created_at__range=(start_date, end_date),
        ).count()

        percentage_increase_boxes = self.calculate_percentage_increase(
            previous_boxes, current_boxes
        )
        percentage_increase_gifts = self.calculate_percentage_increase(
            previous_gifts, current_gifts
        )

        data = {
            "total_campaigns": total_campaigns,
            "total_boxes": total_boxes,
            "total_gifts": total_gifts,
            "percentage_increase_boxes": percentage_increase_boxes,
            "percentage_increase_gifts": percentage_increase_gifts,
        }
        serializer = CampaignMetricsSerializer(data)
        return Response(serializer.data)


campaign_metrics_api_view = CampaignMetricsView.as_view()


class BoxMetricsView(MetricsView):

    @extend_schema(
        description="Retrieve metrics for all boxes.",
        responses={
            200: OpenApiResponse(
                response=BoxMetricsSerializer,
                examples=[
                    OpenApiExample(
                        name="Box Metrics Example",
                        value={
                            "total_boxes": 300,
                            "percentage_increase": 10.5,
                            "total_set_up_boxes": 250,
                        },
                    )
                ],
            )
        },
        tags=["Admin Metrics"],
    )
    def get(self, request, *args, **kwargs):
        start_date, end_date, prev_start_date, prev_end_date = self.get_time_range(
            request
        )

        total_boxes = Box.objects.count()
        previous_boxes = Box.objects.filter(
            created_at__range=(prev_start_date, prev_end_date)
        ).count()
        current_boxes = Box.objects.filter(
            created_at__range=(start_date, end_date)
        ).count()
        percentage_increase = self.calculate_percentage_increase(
            previous_boxes, current_boxes
        )

        total_set_up_boxes = Box.objects.filter(is_setup=True).count()

        data = {
            "total_boxes": total_boxes,
            "percentage_increase": percentage_increase,
            "total_set_up_boxes": total_set_up_boxes,
        }
        serializer = BoxMetricsSerializer(data)
        return Response(serializer.data)


box_metrics_api_view = BoxMetricsView.as_view()


class GiftMetricsView(MetricsView):

    @extend_schema(
        description="Retrieve metrics for all gifts.",
        responses={
            200: OpenApiResponse(
                response=GiftMetricsSerializer,
                examples=[
                    OpenApiExample(
                        name="Gift Metrics Example",
                        value={
                            "total_gifts": 150,
                            "percentage_increase": 8.0,
                            "total_opened_gifts": 120,
                        },
                    )
                ],
            )
        },
        tags=["Admin Metrics"],
    )
    def get(self, request, *args, **kwargs):
        start_date, end_date, prev_start_date, prev_end_date = self.get_time_range(
            request
        )

        total_gifts = Gift.objects.count()
        previous_gifts = Gift.objects.filter(
            created_at__range=(prev_start_date, prev_end_date)
        ).count()
        current_gifts = Gift.objects.filter(
            created_at__range=(start_date, end_date)
        ).count()
        percentage_increase = self.calculate_percentage_increase(
            previous_gifts, current_gifts
        )

        total_opened_gifts = Gift.objects.filter(opened=True).count()

        data = {
            "total_gifts": total_gifts,
            "percentage_increase": percentage_increase,
            "total_opened_gifts": total_opened_gifts,
        }
        serializer = GiftMetricsSerializer(data)
        return Response(serializer.data)


gifts_metrics_api_view = GiftMetricsView.as_view()


class GiftVisitMetricsView(MetricsView):

    @extend_schema(
        description="Retrieve metrics for all gift visits.",
        responses={
            200: OpenApiResponse(
                response=GiftVisitMetricsSerializer,
                examples=[
                    OpenApiExample(
                        name="Gift Visit Metrics Example",
                        value={"total_visits": 600, "percentage_increase": 12.5},
                    )
                ],
            )
        },
        tags=["Admin Metrics"],
    )
    def get(self, request, *args, **kwargs):
        start_date, end_date, prev_start_date, prev_end_date = self.get_time_range(
            request
        )

        total_visits = GiftVisit.objects.count()
        previous_visits = GiftVisit.objects.filter(
            time_of_visit__range=(prev_start_date, prev_end_date)
        ).count()
        current_visits = GiftVisit.objects.filter(
            time_of_visit__range=(start_date, end_date)
        ).count()
        percentage_increase = self.calculate_percentage_increase(
            previous_visits, current_visits
        )

        data = {
            "total_visits": total_visits,
            "percentage_increase": percentage_increase,
        }
        serializer = GiftVisitMetricsSerializer(data)
        return Response(serializer.data)


gifts_visits_metrics_view = GiftVisitMetricsView.as_view()


class CompanyMetricsView(MetricsView):

    @extend_schema(
        description="Retrieve metrics for all companies.",
        responses={
            200: OpenApiResponse(
                response=CompanyMetricsSerializer,
                examples=[
                    OpenApiExample(
                        name="Company Metrics",
                        value={
                            "total_companies": 5,
                            "total_users": 50,
                            "total_campaigns": 20,
                            "total_boxes": 200,
                            "percentage_increase_users": 10.0,
                            "percentage_increase_campaigns": 15.0,
                            "percentage_increase_boxes": 20.0,
                        },
                    )
                ],
            )
        },
        tags=["Admin Metrics"],
    )
    def get(self, request, *args, **kwargs):
        start_date, end_date, prev_start_date, prev_end_date = self.get_time_range(
            request
        )

        total_companies = Company.objects.count()
        total_users = CompanyUser.objects.count()
        total_campaigns = Campaign.objects.count()
        total_boxes = Box.objects.count()

        previous_users = CompanyUser.objects.filter(
            created_at__range=(prev_start_date, prev_end_date)
        ).count()
        current_users = CompanyUser.objects.filter(
            created_at__range=(start_date, end_date)
        ).count()

        previous_campaigns = Campaign.objects.filter(
            created_at__range=(prev_start_date, prev_end_date)
        ).count()
        current_campaigns = Campaign.objects.filter(
            created_at__range=(start_date, end_date)
        ).count()

        previous_boxes = Box.objects.filter(
            created_at__range=(prev_start_date, prev_end_date)
        ).count()
        current_boxes = Box.objects.filter(
            created_at__range=(start_date, end_date)
        ).count()

        percentage_increase_users = self.calculate_percentage_increase(
            previous_users, current_users
        )
        percentage_increase_campaigns = self.calculate_percentage_increase(
            previous_campaigns, current_campaigns
        )
        percentage_increase_boxes = self.calculate_percentage_increase(
            previous_boxes, current_boxes
        )

        data = {
            "total_companies": total_companies,
            "total_users": total_users,
            "total_campaigns": total_campaigns,
            "total_boxes": total_boxes,
            "percentage_increase_users": percentage_increase_users,
            "percentage_increase_campaigns": percentage_increase_campaigns,
            "percentage_increase_boxes": percentage_increase_boxes,
        }
        serializer = CompanyMetricsSerializer(data)
        return Response(serializer.data)


company_metrics_api_view = CompanyMetricsView.as_view()

