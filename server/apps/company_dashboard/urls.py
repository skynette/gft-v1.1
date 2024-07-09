from django.urls import path
from . import views

urlpatterns = [
    # Gift-Boxes urls
    path('boxes/', views.all_boxes_api_view, name='api_all_boxes'),
    path('boxes/<str:box_id>/detail/', views.box_detail_api_view, name='api_view_box'),
    path('boxes/create/', views.create_box_api_view, name='api_create_box'),
    path('boxes/<str:id>/edit/', views.box_edit_api_view, name='api_edit_box'),
    path('boxes/<str:id>/delete/', views.delete_box_api_view, name='api_delete_box'),
    path('campaigns/<str:campaign_id>/add-box-to-campaign/', views.add_boxes_to_campaign_api_view, name='api_add_box_to_campaign'),
    path('boxes/<str:box_id>/gifts/', views.box_gifts_api_view, name='api_view_box_gifts'),
    
    # Mini-Gifts urls
    path('boxes/<str:box_id>/gifts/<str:gift_id>/edit/', views.gift_edit_api_view, name='api_edit_gift'),
    path('boxes/<str:box_id>/gifts/<str:gift_id>/delete/', views.gift_delete_api_view, name='api_delete_gift'),
    
    # notification urls
    path('notifications/', views.notifications_api_view, name='api_notifications'),
    path('notifications/<int:notification_id>/mark-read/', views.mark_notification_read_api_view, name='api_mark_notification_read'),
    
    # campaign urls
    path('campaigns/all/', views.campaign_list_api_view, name='api_campaign_list'),
    path('campaigns/create/', views.campaign_create_api_view, name='api_create_campaign'),
    path('campaigns/<str:id>/update/', views.campaign_update_api_view, name='api_update_campaign'),
    path('campaigns/<str:id>/detail/', views.campaign_detail_api_view, name='api_campaign_detail'),
    
    # box category urls
    path('box-category/', views.box_category_list_create_api_view, name='api_list_create_box_category'),
    path('box-category/<int:id>/', views.box_category_retrieve_update_destroy_api_view, name='box_category_get_update_delete'),
    
    path('company-boxes/', views.company_boxes_list_api_view, name='api_company_boxes_list'),
    path('company-boxes/create/', views.add_company_boxes_api_view, name='api_add_company_boxes'),
    path('company-boxes/<int:box_type_id>/update/', views.update_company_boxes_api_view, name='api_update_company_boxes'),
    path('company-boxes/<int:box_type_id>/detail/', views.company_boxes_detail_api_view, name='api_company_boxes_detail'),

    # api key usage url
    path('api-key-usage/<int:id>', views.company_api_key_usage_view, name='api_key_usage'),

    # company url
    path("company/", views.company_api_view, name="api_company"),
    path('company/<int:id>/details/', views.company_details_api_view, name='api_company_details'),
    path('settings/update/', views.update_settings_api_view, name='api_update_settings'),
    
    # company users url
    path('company-users/<int:id>/', views.company_users_api_view, name='api_company_users_list'),
    
    # analytics urls
    path('analytics/boxes/', views.BoxAnalyticsView.as_view(), name='box-analytics'),
    path('analytics/gifts/', views.GiftAnalyticsView.as_view(), name='gift-analytics'),
    path('analytics/gift-visits/', views.GiftVisitAnalyticsView.as_view(), name='gift-visit-analytics'),
    path('analytics/campaigns/', views.CampaignAnalyticsView.as_view(), name='campaign-analytics'),
    path('analytics/combined/', views.CombinedAnalyticsView.as_view(), name='combined-analytics'),
    path('analytics/charts/', views.company_dashboard_chart_data, name='chart-data'),
]
