from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from apps.gft.models import Company, CompanyApiKey
import os

User = get_user_model()
class Command(BaseCommand):
    help = 'Creates a default company for superuser'

    def handle(self, *args, **options):
        api_key = os.environ.get('COMPANY_API_KEY', None)
        admin_user = User.objects.get(username='x21') or None
        if not api_key:
            raise ValueError('COMPANY_API_KEY is not set in environment variables.')
        
        with transaction.atomic():
            company, _  = Company.objects.get_or_create(name='Admin Company', owner=admin_user)
            key, _      = CompanyApiKey.objects.get_or_create(company=company, key=api_key)

        self.stdout.write(self.style.SUCCESS('Default company created successfully.'))
        self.stdout.write(self.style.SUCCESS('Loaded company api key successfully.'))
