from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.user_list_and_create_api_view, name='user-list'),
    path('users/<int:pk>/', views.user_details_update_and_delete_view, name='user-detail'),
    
    # box urls
    path('boxes/', views.box_list_view, name='box_list'),
    path('boxes/create/', views.box_create_view, name='box_create'),
    path('boxes/<str:box_id>/', views.box_detail_view, name='box_detail'),
    path('boxes/<str:box_id>/update/', views.box_update_view, name='box_update'),
    path('boxes/<str:box_id>/delete/', views.box_delete_view, name='box_delete'),
    
    # gift urls
    path('gifts/', views.gift_list_view, name='gift_list'),
    path('gifts/create/', views.gift_create_view, name='gift_create'),
    path('gifts/<str:gift_id>/', views.gift_detail_view, name='gift_detail'),
    path('gifts/<str:gift_id>/update/', views.gift_update_view, name='gift_update'),
    path('gifts/<str:gift_id>/delete/', views.gift_delete_view, name='gift_delete'),
    
    # box category urls
    path('box-category/create/', views.create_box_category_view, name='box_category_create'),
    path('box-category/list/', views.box_category_list_view, name='box_category_list'),
    path('box-category/detail/<int:id>/', views.box_category_detail_view, name='box_category_detail'),
    path('box-category/update/<int:id>/', views.update_box_category_view, name='box_category_update'),
    path('box-category/delete/<int:id>/', views.delete_box_category_view, name='delete_box_category'),
    
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
    
    path("config-management/", views.config_management_view, name="config_management"),
]