from django.db import models
from django.utils.translation import gettext_lazy as _
from shortuuid.django_fields import ShortUUIDField


class TimeStampedUUIDModel(models.Model):
	pkid = models.BigAutoField(_("primary key id"), primary_key=True, editable=False)
	id = ShortUUIDField(length=10, max_length=40, unique=True, editable=False)
	created_at = models.DateTimeField(_("Created"), auto_now_add=True)
	updated_at = models.DateTimeField(_("Updated"), auto_now=True)

	class Meta:
		abstract = True
