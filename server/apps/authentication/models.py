import os
import random
import string
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.utils.translation import gettext_lazy as _
import shortuuid
from apps.common.models import TimeStampedUUIDModel
from phonenumber_field.modelfields import PhoneNumberField

def custom_upload_to(instance, filename):
    # Generate a custom filename with user ID and random text
    user_id = instance.id
    random_text = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
    file_extension = os.path.splitext(filename)[1]
    return f"users/{user_id}_{random_text}{file_extension}"


class User(TimeStampedUUIDModel, AbstractUser):
    CONTACT_PREFERENCE_CHOICES = (
        ("email", "email"),
        ("phone", "phone"),
    )
    PROVIDER_CHOICES = (
        ("credentials", "credentials"),
        ("google", "google"),
        ("apple", "apple"),
    )
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    username = models.TextField(max_length=100, unique=True)
    email = models.EmailField(null=True, blank=True, unique=True)
    mobile = PhoneNumberField(verbose_name=_("Phone number"), max_length=20, default="+234980000000")
    contact_preference = models.CharField(max_length=100,choices=CONTACT_PREFERENCE_CHOICES,default="phone")
    image = models.ImageField(upload_to=custom_upload_to, null=True, blank=True)
    provider = models.CharField(max_length=100, choices=PROVIDER_CHOICES, default="credentials")
    user_type = models.CharField(
        max_length=100,
        choices=(
            ("super_admin", "super_admin"),
            ("user", "user"),
            ("company", "company"),
       ),
        default="user",
    )
    objects = UserManager()

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_image(self):
        if self.image:
            return self.image.url

    def __str__(self):
        return f"{self.username}" or f"{self.email}" or f"{self.mobile}"
    
    def save(self, *args, **kwargs):
        if not self.pk:
            if self.is_superuser:
                self.user_type = "admin"

            if not self.image:
                self.image.name = 'image/avatar.png'

        if not self.username:
            if not self.password:
                self.password = "1234"
            self.username = f"user_{shortuuid.uuid()[:8]}"
        super().save(*args, **kwargs)
