from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/metrics/', views.dashboard_api_view, name='api_dashboard'),
    
    path('gift-boxes/<str:box_id>/setup/', views.setup_gift_box_api_view, name='api_setup_gift_box'),
    path('gift-boxes/<str:box_id>/gifts/', views.view_box_gifts_api_view, name='api_view_box_gifts'),
    path('gift-boxes/<str:box_id>/edit/', views.edit_box_api_view, name='api_edit_box'),
    path('gift-boxes/<str:box_id>/gifts/setup/', views.setup_gifts_api_view, name='api_setup_gifts'),
    
    path('gift-boxes/sent/', views.box_sent_api_view, name='api_boxes_sent'),
    path('gift-boxes/received/', views.box_received_api_view, name='api_boxes_received'),
    
    path('notifications/', views.notifications_api_view, name='api_notifications'),
    path('notifications/<int:notification_id>/mark-read/', views.mark_notification_read_api_view, name='api_mark_notification_read'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read_api_view, name='mark_all_notifications_read'),
    
    # record a gift visit
    path('gift-visits/', views.create_gift_visit_api_view, name='create_gift_visit'),
]