from django.urls import path
from . import views

urlpatterns = [
    # Gift-Boxes urls
    path('boxes/', views.all_boxes_api_view, name='api_all_boxes'),
    path('boxes/<str:box_id>/detail/', views.box_detail_api_view, name='api_view_box'),
    path('boxes/create/', views.create_box_api_view, name='api_create_box'),
    
    # campaign urls
    path('campaigns/all/', views.campaign_list_api_view, name='api_campaign_list'),
    path('campaigns/create/', views.campaign_create_api_view, name='api_create_campaign'),
    path('campaigns/<str:id>/detail/', views.campaign_detail_api_view, name='api_campaign_detail'),
]
