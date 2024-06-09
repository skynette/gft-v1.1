from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .models import PermissionsModel


class CustomPermissionDenied(PermissionDenied):
    def __init__(self, permission_name):
        self.permission_name = permission_name
        super().__init__(
            {"error": f"Permission {permission_name} is required to perform this action"})


class APIPermissionValidator(BasePermission):
    """Allow only users with required permissions"""

    def load_permissions(self):
        return PermissionsModel.objects.all()

    def has_permission(self, request, view):
        required_permissions = getattr(view, 'required_permissions', None)

        # No specific permissions required, so allow access
        if required_permissions is None:
            return True

        user = request.user

        # Superusers have all permissions
        if user.is_superuser:
            return True

        user_type = user.user_type
        permissions = self.load_permissions()

        for permission_name in required_permissions:
            permission = permissions.filter(label=permission_name).first()
            if not permission:
                raise CustomPermissionDenied(permission_name)

            allowed_groups = permission.groups.filter(name=user_type)
            if not allowed_groups.exists():
                raise CustomPermissionDenied(permission_name)
        return True


class UserCannotViewOtherUserInfo(BasePermission):
    """Allow only user to view their own info"""

    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        else:
            if request.user.id == view.kwargs['id']:
                return True
            else:
                return False
