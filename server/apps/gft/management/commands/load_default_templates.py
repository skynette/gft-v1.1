from pathlib import Path
import os
from django.core.management.base import BaseCommand
from apps.gft.models import Template

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
TEMPLATE_FILES = [
    {
        'name': 'notify_user_OTP',
        'file_name': 'default_email_notify_otp.html',
        'sms_file_name': 'default_sms_notify_otp.txt',
        'notification_type': 'notify_user_OTP',
        'subject': 'Your Login Token',
        'active': True
    },
    {
        'name': 'notify_sender_open_gift',
        'file_name': 'default_email_notify_sender_open_gift.html',
        'sms_file_name': 'default_sms_notify_sender_open_gift.txt',
        'notification_type': 'notify_sender_open_gift',
        'subject': 'Gift Opened',
        'active': True
    },
    {
        'name': 'notify_receiver_to_open_gift',
        'file_name': 'default_email_notify_receiver_to_open_gift.html',
        'sms_file_name': 'default_sms_notify_receiver_to_open_gift.txt',
        'notification_type': 'notify_receiver_to_open_gift',
        'subject': 'You have a surprise gift',
        'active': True
    },
    {
        'name': 'notify_user_account_activity',
        'file_name': 'default_email_notify_user_account_activity.html',
        'sms_file_name': 'default_sms_notify_user_account_activity.txt',
        'notification_type': 'notify_user_account_activity',
        'subject': 'Login Activity',
        'active': True
    },
    {
        'name': 'message',
        'file_name': 'message.html',
        'sms_file_name': 'message.txt',
        'notification_type': 'message',
        'subject': 'Message',
        'active': True
    },
    {
        'name': 'server_error',
        'file_name': 'server_error.html',
        'sms_file_name': 'server_error.txt',
        'notification_type': 'server_error',
        'subject': 'Server Error',
        'active': True
    },
    {
        'name': 'unauthorized',
        'file_name': 'unauthorized.html',
        'sms_file_name': 'unauthorized.txt',
        'notification_type': 'unauthorized',
        'subject': 'Access Denied',
        'active': True
    },
    # Add other templates similarly with SMS file names
]

class Command(BaseCommand):
    help = 'Load default templates from file'

    def handle(self, *args, **options):
        for template_file in TEMPLATE_FILES:
            email_file_path = os.path.join(BASE_DIR, 'default_templates', template_file['file_name'])
            sms_file_path = os.path.join(BASE_DIR, 'sms_templates', template_file['sms_file_name'])  # SMS folder path

            with open(email_file_path, 'r') as email_file, open(sms_file_path, 'r') as sms_file:
                email_data = email_file.read()
                sms_data = sms_file.read()

            defaults = {
                'name': template_file['name'],
                'notification_type': template_file['notification_type'],
                'subject': template_file['subject'],
                'email_body': email_data,
                'sms_body': sms_data,
                'active': template_file['active'],
            }

            obj, created = Template.objects.update_or_create(name=template_file['name'], defaults=defaults)

            if created:
                self.stdout.write(self.style.SUCCESS(f"Default {template_file['name']} template created successfully."))
            else:
                self.stdout.write(self.style.SUCCESS(f"Default {template_file['name']} template already exists. Skipping creation."))
