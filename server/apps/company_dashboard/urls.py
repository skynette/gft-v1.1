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
    
    # box category urls
    path('box-category/', views.box_category_list_create_api_view, name='api_list_create_box_category'),
    path('box-category/<int:id>/', views.box_category_retrieve_update_destroy_api_view, name='box_category_get_update_delete'),

    # api key usage url
    path('api-key-usage/<int:id>', views.company_api_key_usage_view, name='api_key_usage'),

    # company url
    path("company/", views.company_api_view, name="api_company"),
    # company users url
    path('company-users/<int:id>/', views.company_users_api_view, name='api_company_users_list')
]
