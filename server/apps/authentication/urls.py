from django.urls import path
from . import views

urlpatterns = [
	path('register/', views.register_api_view, name='register_api'),
	path('login/social/', views.social_auth_login_api_view, name='social_login'),
]
