from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
import json
import os
from apps.gft.models import PermissionGroup, PermissionsModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent

class Command(BaseCommand):
    help = 'Creates initial permission groups and permissions'

    def handle(self, *args, **options):
        permissions_file = os.path.join(BASE_DIR, 'permissions.json')

        with open(permissions_file) as file:
            data = json.load(file)

        role_levels = data.get("role_levels", {})
        permissions = data.get("permissions", [])

        with transaction.atomic():
            # Create Permission Groups
            for role_level in role_levels.get("global", []):
                group_name = role_level.get("name")
                group_description = role_level.get("description")
                permission_group, _ = PermissionGroup.objects.get_or_create(name=group_name)
                permission_group.label = group_name
                permission_group.description = group_description
                permission_group.save()

            # Create Permissions
            for permission in permissions:
                permission_name = permission.get("name")
                permission_description = permission.get("description")
                allowed_role_levels = permission.get("allowed_role_levels", {}).get("global", [])

                for role_level in allowed_role_levels:
                    group = PermissionGroup.objects.get(name=role_level)
                    permission_model, _ = PermissionsModel.objects.get_or_create(label=permission_name)
                    permission_model.description = permission_description
                    permission_model.save()
                    permission_model.groups.add(group)

        self.stdout.write(self.style.SUCCESS('Permissions and Permission Groups created successfully.'))
