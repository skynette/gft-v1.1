from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.user_list_and_create_api_view, name='user-list'),
    path('users/<int:pk>/', views.user_details_update_and_delete_view, name='user-detail'),
]