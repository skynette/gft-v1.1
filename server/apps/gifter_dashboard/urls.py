from django.urls import path
from . import views

urlpatterns = [
    path('gift-boxes/sent/', views.box_sent_api_view, name='api_boxes_sent'),
    path('gift-boxes/received/', views.box_received_api_view, name='api_boxes_received'),
    
    path('notifications/', views.notifications_api_view, name='api_notifications'),
    path('notifications/<int:notification_id>/mark-read/', views.mark_notification_read_api_view, name='api_mark_notification_read'),
]