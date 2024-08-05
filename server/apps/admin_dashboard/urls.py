from django.urls import path
from . import views, metrics_views

urlpatterns = [
    path('users/', views.user_list_and_create_api_view, name='user_list'),
    path('users/<int:pk>/', views.user_details_update_and_delete_view, name='user_detail'),
    
    # box urls
    path('boxes/', views.box_list_view, name='box_list'),
    path('boxes/create/', views.box_create_view, name='box_create'),
    path('boxes/<str:box_id>/', views.box_detail_view, name='box_detail'),
    path('boxes/<str:box_id>/update/', views.box_update_view, name='box_update'),
    path('boxes/<str:box_id>/delete/', views.box_delete_view, name='box_delete'),
    
    # notification urls
    path('notifications/', views.notification_list_view, name='notification_list'),
    path('notifications/create/', views.notification_create_view, name='notification_create'),
    path('notifications/<int:notification_id>/', views.notification_detail_view, name='notification_detail'),
    path('notifications/<int:notification_id>/update/', views.notification_update_view, name='notification_update'),
    path('notifications/<int:notification_id>/delete/', views.notification_delete_view, name='notification_delete'),
    
    # gift urls
    path('gifts/', views.gift_list_view, name='gift_list'),
    path('gifts/create/', views.gift_create_view, name='gift_create'),
    path('gifts/<str:gift_id>/', views.gift_detail_view, name='gift_detail'),
    path('gifts/<str:gift_id>/update/', views.gift_update_view, name='gift_update'),
    path('gifts/<str:gift_id>/delete/', views.gift_delete_view, name='gift_delete'),
    
    # gift visit urls
    path('giftvisits/', views.gift_visit_list, name='gift_visit_list'),
    path('giftvisits/create/', views.gift_visit_create, name='gift_visit_create'),
    path('giftvisits/<str:id>/', views.gift_visit_detail, name='gift_visit_detail'),
    path('giftvisits/<str:id>/update/', views.gift_visit_update, name='gift_visit_update'),
    path('giftvisits/<str:id>/delete/', views.gift_visit_delete, name='gift_visit_delete'),
    
    # box category urls
    path('box-category/list/', views.box_category_list_view, name='box_category_list'),
    path('box-category/create/', views.create_box_category_view, name='box_category_create'),
    path('box-category/detail/<int:id>/', views.box_category_detail_view, name='box_category_detail'),
    path('box-category/update/<int:id>/', views.update_box_category_view, name='box_category_update'),
    path('box-category/delete/<int:id>/', views.delete_box_category_view, name='delete_box_category'),
    
    # campaign urls
    path('campaigns/', views.campaign_list_api_view, name='admin_campaign_list'),
    path('campaigns/create', views.campaign_create_api_view, name='admin_campaign_create'),
    path('campaigns/<str:id>/', views.campaign_detail_api_view, name='admin_campaign_detail'),
    path('campaigns/<str:id>/update/', views.campaign_update_api_view, name='admin_campaign_update'),
    path('campaigns/<str:id>/delete/', views.campaign_delete_api_view, name='admin_campaign_delete'),
    
    # company urls
    path('companies/', views.company_list_view, name='company_list'),
    path('companies/create/', views.company_create_view, name='company_create'),
    path('companies/<int:id>/', views.company_detail_view, name='company_detail'),
    path('companies/<int:id>/update/', views.company_update_view, name='company_update'),
    path('companies/<int:id>/delete/', views.company_delete_view, name='company_delete'),

    # company api key urls 
    path("company-api-key/", views.company_api_key_list_view, name="company_api_key_list"),
    path("company-api-key/create/", views.company_api_key_create_view, name="company_api_key_create"),
    path("company-api-key/<int:id>/", views.company_api_key_detail_view, name="company_api_key_detail"),
    path("company-api-key/<int:id>/update/", views.company_api_key_update_view, name="company_api_key_update"),
    path("company-api-key/<int:id>/delete/", views.company_api_key_delete_view, name="company_api_key_delete"),
    
    # company box urls
    path("company-boxes/", views.company_boxes_list_view, name="company_box_list"),
    path("company-boxes/create/", views.company_boxes_create_view, name="company_box_create"),
    path("company-boxes/<int:id>/", views.company_box_detail_view, name="company_box_detail"),
    path("company-boxes/<int:id>/update/", views.company_boxes_update_view, name="company_box_update"),
    path("company-boxes/<int:id>/delete/", views.company_boxes_delete_view, name="company_box_delete"),
    
    # template urls
    path('template/', views.template_list_view, name='template_list'),
    path('template/create/', views.template_create_view, name='template_create'),
    path('templates/<str:id>/', views.template_detail, name='template_detail'),
    path('template/update/<int:id>/', views.template_update_view, name='template_update'),
    path('template/delete/<int:id>/', views.template_delete_view, name='template_delete'),
    path('template/setactive/<int:id>/', views.template_selection_view, name='template_select'),
    
    # roles and permission urls
    path('roles/', views.ViewRolesView.as_view(), name='view_roles'),
    path('roles/<str:group_id>/', views.RoleDetailView.as_view(), name='role_detail'),
    path('roles/<str:group_id>/delete/', views.DeletePermissionGroupView.as_view(), name='delete_permission_group'),
    
    path('permission-groups/', views.PermissionGroupListCreateView.as_view(), name='permission_group_list_create'),
    path('permission-groups/<int:pk>/', views.PermissionGroupDetailView.as_view(), name='permission_group_detail'),
    path('permissions/', views.PermissionsModelListCreateView.as_view(), name='permissions_list_create'),
    path('permissions/<int:pk>/', views.PermissionsModelDetailView.as_view(), name='permissions_detail'),
    path('assign-user-group/', views.assign_user_group_view, name='assign_user_group'),
    
    path("config-management/", views.config_management_view, name="config_management"),
    
    path('api-tokens/', views.ListAuthTokens.as_view(), name='api_tokens_list'),
    path('api-token-update/<int:user_id>/', views.UpdateAuthToken.as_view(), name='api_token_update'),
    path('api-tokens/<str:id>/', views.DeleteAuthToken.as_view(), name='api_token_delete'),
    
    # metrics api endpoint
    path('metrics/', views.admin_metrics_api_view, name='admin_metrics'),
    
    # metrics
    path('metrics/campaigns/', metrics_views.campaign_metrics_api_view, name='campaign_metrics'),
    path('metrics/boxes/', metrics_views.box_metrics_api_view, name='box_metrics'),
    path('metrics/gifts/', metrics_views.gifts_metrics_api_view, name='gift_metrics'),
    path('metrics/giftvisits/', metrics_views.gifts_visits_metrics_view, name='gift_visit_metrics'),
    path('metrics/companies/', metrics_views.company_metrics_api_view, name='company_metrics'),
    
    path('metrics/charts/', views.admin_dashboard_chart_data, name='admin_chart_metrics'),
]