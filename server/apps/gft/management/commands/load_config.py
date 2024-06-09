from pathlib import Path
import os
from django.core.management.base import BaseCommand
from apps.gft.models import Config
import json

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent

class Command(BaseCommand):
    help = 'Load configuration from JSON file into the database'

    def handle(self, *args, **options):
        config_file = os.path.join(BASE_DIR, 'config.json')

        # Check if the Config object already exists
        if not Config.objects.exists():
            with open(config_file) as file:
                config_data = json.load(file)
                config, created = Config.objects.get_or_create(pk=1)
                for key, value in config_data.items():
                    setattr(config, key, value)
                config.save()
                self.stdout.write(self.style.SUCCESS('Configuration loaded successfully'))
        else:
            self.stdout.write(self.style.WARNING('Configuration already exists.'))
