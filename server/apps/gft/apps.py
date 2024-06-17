from django.apps import AppConfig


class GftConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.gft'

    def ready(self):
        import apps.gft.schema
        import apps.gft.signals
