from .base import *

EMAIL_BACKEND = 'djcelery_email.backends.EmailBackend'
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
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
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