from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


urlpatterns = [
    # docs
    path('schema/', SpectacularAPIView.as_view(), name='schema'),

    # Optional UI:
    path('', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # authentication urls
    path('', include('drfpasswordless.urls')),
    path('auth/', include('apps.authentication.urls')),
    path('dashboard/', include('apps.company_dashboard.urls')),
    path('dashboard/admin/', include('apps.admin_dashboard.urls')),
    path('dashboard/gifter/', include('apps.gifter_dashboard.urls')),
    path('supersecret/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
