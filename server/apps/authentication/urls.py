from django.urls import path
from . import views

urlpatterns = [
	path('register/', views.register_api_view, name='register_api'),
	path('login/social/', views.social_auth_login_api_view, name='social_login'),
	path('user/update/', views.user_profile_update_api_view, name='user_update'),
 
	# admin login urls
	path('login/admin/', views.admin_login_api_view, name='admin_login'),
	path('logout/admin/', views.admin_logout_api_view, name='admin_logout'),
]
