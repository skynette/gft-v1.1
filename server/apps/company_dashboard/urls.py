from django.urls import path
from . import views

urlpatterns = [
    path('campaigns/all/', views.campaign_list_api_view, name='api_campaign_list'),
    path('campaigns/create/', views.campaign_create_api_view, name='api_create_campaign'),
    path('campaigns/<str:id>/detail/', views.campaign_detail_api_view, name='api_campaign_detail'),
]
