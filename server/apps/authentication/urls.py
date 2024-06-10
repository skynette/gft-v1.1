from django.urls import path
from . import views

urlpatterns = [
	path('register/', views.register_api_view, name='register_api'),
	path('login/google/', views.login_with_google_api_view, name='login_with_google'),
]
