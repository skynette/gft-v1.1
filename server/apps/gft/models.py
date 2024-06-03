import json
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class Company(models.Model):
    """Represents what a company is"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        verbose_name=_("User")
    )
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True, verbose_name=_("Logo"))
    header_image = models.ImageField(upload_to='company_headers/', blank=True, null=True, verbose_name=_("Header Image"))
    company_url = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Company URL"))
    box_limit = models.IntegerField(default=0, verbose_name=_("Box Limit"))
    socials = models.JSONField(default=dict, blank=True, null=True, verbose_name=_("Socials"))
    color_schema = models.JSONField(default=dict, blank=True, null=True, verbose_name=_("Color Schema"))

    def get_company_users(self):
        """Retrieve the users belonging to this company.
        
        Returns:
            list: A list of User objects associated with this company.
        """
        company_users = CompanyUser.objects.filter(company=self)
        users = [company_user.user for company_user in company_users]
        return users
    
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            if not self.logo:
                self.logo.name = 'image/logo.png'
            if not self.header_image:
                self.header_image.name = 'image/header.png'
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('Company')
        verbose_name_plural = _('Companies')


class CompanyUser(models.Model):
    """Relationship between a company and its users"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, verbose_name=_("Company"))
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_("User"))

    def __str__(self) -> str:
        return f"{self.company} {self.user.get_username()}"

    class Meta:
        verbose_name = _("Company User")
        verbose_name_plural = _("Company Users")

