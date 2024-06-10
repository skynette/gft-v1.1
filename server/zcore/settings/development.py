from .base import *

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend" 
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_USE_TLS = True
EMAIL_PORT = os.environ.get('EMAIL_PORT')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = ""
DOMAIN = os.environ.get("DOMAIN")
SITE_NAME = "GFT"


DATABASES = {
'default': {
	'ENGINE': 'django.db.backends.sqlite3',
	'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
	}
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
		'knox.auth.TokenAuthentication',
    ),
	
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',    
	'NON_FIELD_ERRORS_KEY': 'error',
	
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'username_check': '20/min',
        'email_check': '3/hour',
        'otp_check': '3/min',
        'phone_check': '3/hour',
	    'verify_phone_check': '3/hour',
        'company_api_key': '1/min',
    },
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10,
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'GFT API v1.1',
    'DESCRIPTION': 'Unwrap Happiness',
    'VERSION': '1.1.0',
    'SERVE_INCLUDE_SCHEMA': False,
	'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
}

CORS_ALLOWED_ORIGINS = ['http://127.0.0.1:8001', 'http://localhost:8001']

# DJANGO DEBUG TOOLBAR
if DEBUG:
    import socket
    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS = [ip[: ip.rfind(".")] + ".1" for ip in ips] + ["127.0.0.1", "10.0.2.2"]
