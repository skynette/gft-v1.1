from django.urls import path
from . import views

urlpatterns = [
    path('campaigns/all/', views.campaign_list_api_view, name='api_campaign_list'),
    path('campaigns/<str:id>/detail/', views.campaign_detail_api_view, name='api_campaign_detail'),
]
