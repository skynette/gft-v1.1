import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from apps.common.models import TimeStampedUUIDModel
# from phonenumber_field.modelfields import PhoneNumberField

User = get_user_model()


class Company(models.Model):
    """Represents what a company is"""
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        verbose_name=_("User"),
        help_text=_("Owner of the company"),
        null=True,
        blank=True
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


class BoxCategory(models.Model):
    """Box types are the different types of boxes that a company can have."""
    
    class CATEGORY_CHOICES(models.TextChoices):
        THREE_DAYS = '3', _('3 days')
        SEVEN_DAYS = '7', _('7 days')
        FOURTEEN_DAYS = '14', _('14 days')
        THIRTY_DAYS = '30', _('30 days')

    name = models.CharField(max_length=255, verbose_name=_("Name"))
    label = models.CharField(max_length=255, editable=False, blank=True, null=True, verbose_name=_("Label"))
    category = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        choices=CATEGORY_CHOICES.choices,
        default=CATEGORY_CHOICES.THREE_DAYS,
        verbose_name=_("Category")
    )
    qty = models.IntegerField(default=0, verbose_name=_("Quantity"))

    def __str__(self):
        return f"{self.category} days box - ({self.qty} boxes available)"
    
    def clean(self):
        if self.qty <= 0:
            raise ValidationError(_("Quantity cannot be negative or zero."))
    
    def save(self, *args, **kwargs):
        if not self.label:
            self.label = slugify(f"{self.name}").replace('-', '_')
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = _('Box Category')
        verbose_name_plural = _('Box Categories')


class CompanyBoxes(models.Model):
    """Represents the types of boxes owned by a company"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, verbose_name=_("Company"))
    box_type = models.ForeignKey(BoxCategory, on_delete=models.CASCADE, verbose_name=_("Box Type"))
    qty = models.IntegerField(default=0, verbose_name=_("Quantity"))

    def __str__(self):
        return f"{self.company.name} - {self.box_type.name} - ({self.qty})"
    
    class Meta:
        verbose_name = _("Company Box")
        verbose_name_plural = _("Company Boxes")


class Box(TimeStampedUUIDModel):
    """Represents a Gift-Box Package"""
    user = models.ForeignKey(
        User,
        related_name='box_user',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_('User')
    )
    title = models.CharField(max_length=150, verbose_name=_('Title'), help_text=_("Title for the gift box package"))
    receiver_name = models.CharField(max_length=150, blank=True, null=True, verbose_name=_('Receiver Name'), help_text=_("Name of the receiver"))
    receiver_email = models.CharField(max_length=150, blank=True, null=True, verbose_name=_('Receiver Email'), help_text=_("Email of the receiver"))
    # receiver_phone = PhoneNumberField(max_length=20, blank=True, null=True, verbose_name=_('Receiver Phone'), help_text=_("Phone number of the receiver"))
    days_of_gifting = models.IntegerField(default=0, verbose_name=_('Days of Gifting'))
    open_date = models.DateField(default=timezone.now, verbose_name=_('Open Date'))
    last_opened = models.DateField(blank=True, null=True, verbose_name=_('Last Opened'))
    is_setup = models.BooleanField(default=False, verbose_name=_('Is Setup'))
    is_company_setup = models.BooleanField(default=False, verbose_name=_('Is Company Setup'))
    box_campaign = models.ForeignKey(
        "Campaign",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_('Box Campaign'),
        help_text=_("Campaign that this gift box belongs to")
    )
    qr_code_v = models.ImageField(upload_to='gift_qr_codes/', blank=True, null=True, verbose_name=_('QR Code'))
    open_after_a_day = models.BooleanField(default=False, verbose_name=_('Open After a Day'), help_text=_("Decide if to allow users only open the mini boxes once a day"))

    def get_absolute_url(self):
        return reverse('index:view_box', args=[str(self.pkid)])

    @property
    def get_qr_code(self, request):
        domain = domain = request.META['HTTP_HOST']
        url = domain + self.get_absolute_url()
        return url

    def can_be_opened_after_a_day(self):
        """Checks if the mini gift box can be opened more than once in a 24hr period
        returns: True if yes
        """
        if self.last_opened:
            last_opened_datetime = datetime.combine(self.last_opened, datetime.min.time())
            return last_opened_datetime + timedelta(hours=24) <= timezone.now()
        return True

    @property
    def company(self):
        company = Company.objects.filter(user=self.box_campaign.company).first()
        return company

    def save(self, *args, **kwargs):
        if not self.pk:
            if not self.days_of_gifting:
                self.days_of_gifting = self.box_campaign.duration if self.box_campaign else 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('Box')
        verbose_name_plural = _('Boxes')

    class Meta:
        verbose_name = 'Box'
        verbose_name_plural = 'Boxes'


class Gift(TimeStampedUUIDModel):
    """Represents a mini box within a Gift-Box package"""
    user = models.ForeignKey(
        User,
        related_name='gift_user',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_('User')
    )
    box_model = models.ForeignKey(
        Box,
        verbose_name=_('Gift Box'),
        related_name='gift_box',
        on_delete=models.CASCADE
    )
    gift_title = models.CharField(max_length=255, verbose_name=_('Gift Title'))
    gift_description = models.TextField(verbose_name=_('Gift Description'))
    gift_content_type = models.CharField(max_length=255, default="text", verbose_name=_('Gift Content Type'))
    gift_campaign = models.ForeignKey(
        "Campaign",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_('Gift Campaign')
    )
    reaction = models.CharField(max_length=255, null=True, blank=True, verbose_name=_('Reaction'))
    opened = models.BooleanField(default=False, verbose_name=_('Opened'))
    open_date = models.DateField(verbose_name=_('Open Date'))
    qr_code_v = models.ImageField(upload_to='gift_qr_codes/', blank=True, null=True, verbose_name=_('QR Code'))

    def get_absolute_url(self):
        return reverse('index:open_gift', args=[str(self.pkid)])

    @property
    def get_total_visits(self):
        return GiftVisit.objects.filter(gift=self).count()

    def __str__(self):
        return self.gift_title

    class Meta:
        verbose_name = _('Gift')
        verbose_name_plural = _('Gifts')


class Notification(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name=_("User Who Receives the Notification")
    )
    box = models.ForeignKey(
        Box,
        on_delete=models.CASCADE,
        verbose_name=_("Box That the Notification Is About")
    )
    gift = models.ForeignKey(
        Gift,
        on_delete=models.CASCADE,
        verbose_name=_("Gift That the Notification Is About")
    )
    message = models.CharField(
        max_length=255,
        verbose_name=_("Message of the Notification")
    )
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.box.title}'

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = _('Notifications')


class CampaignSoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
    
class Campaign(TimeStampedUUIDModel):
    """Represents a campaign"""
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        verbose_name=_("Company"),
        help_text=_("Company that owns this campaign")
    )
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    company_boxes = models.ForeignKey(
        CompanyBoxes,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="campaign_company_boxes",
        verbose_name=_("Company Boxes")
    )
    duration = models.IntegerField(verbose_name=_("Duration"))
    num_boxes = models.IntegerField(verbose_name=_("Number of Boxes"))
    header_image = models.ImageField(
        upload_to='campaigns/headers',
        blank=True,
        null=True,
        verbose_name=_("Header Image")
    )
    open_after_a_day = models.BooleanField(default=True, verbose_name=_("Open After a Day"))
    is_deleted = models.BooleanField(default=False, verbose_name=_("Is Deleted"))

    current_objects = CampaignSoftDeleteManager()

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.pk:
            if not self.header_image:
                company = Company.objects.filter(user=self.company).first()
                if company and company.header_image:
                    self.header_image = company.header_image
                else:
                    self.header_image.name = 'image/header.png'
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('Campaign')
        verbose_name_plural = _('Campaigns')


class GiftVisit(models.Model):
    gift = models.ForeignKey(
        Gift,
        on_delete=models.CASCADE,
        verbose_name=_("Gift")
    )
    time_of_visit = models.DateTimeField(
        default=timezone.now,
        verbose_name=_("Time of Visit")
    )
    visitor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name=_("Visitor")
    )
    metadata = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return f"{self.visitor.username} opened {self.gift.gift_title} at {self.time_of_visit}"

    class Meta:
        verbose_name = _('Gift Visit')
        verbose_name_plural = _('Gift Visits')




class Config(models.Model):
    ENVIRONMENT_CHOICES = (
        ('PRODUCTION', _('PRODUCTION')),
        ('DEVELOPMENT', _('DEVELOPMENT')),
        ('STAGING', _('STAGING')),
    )
    email_host = models.CharField(max_length=255, default='smtp.gmail.com', verbose_name=_("Email Host"))
    email_port = models.IntegerField(default=587, verbose_name=_("Email Port"))
    email_host_user = models.CharField(max_length=255, default='apikey', verbose_name=_("Email Host User"))
    email_host_password = models.CharField(max_length=255, default='password', verbose_name=_("Email Host Password"))
    company_api_key = models.CharField(max_length=255, verbose_name=_("Company API Key"))
    super_admin_username = models.CharField(max_length=255, verbose_name=_("Super Admin Username"))
    api_url = models.CharField(max_length=255, verbose_name=_("API URL"))
    sendgrid_api_key = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("SendGrid API Key"))
    twilio_account_sid = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Twilio Account SID"))
    twilio_auth_token = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Twilio Auth Token"))
    twilio_sid = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Twilio SID"))
    twilio_number = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Twilio Number"))
    postgres_db_name = models.CharField(max_length=255, default='postgres', verbose_name=_("Postgres DB Name"))
    postgres_db_user = models.CharField(max_length=255, default='postgres', verbose_name=_("Postgres DB User"))
    postgres_db_password = models.CharField(max_length=255, default='postgres', verbose_name=_("Postgres DB Password"))
    postgres_db_host = models.CharField(max_length=255, default='localhost', verbose_name=_("Postgres DB Host"))
    postgres_db_port = models.IntegerField(default=5432, verbose_name=_("Postgres DB Port"))
    environment = models.CharField(choices=ENVIRONMENT_CHOICES, default=ENVIRONMENT_CHOICES[1], max_length=65, verbose_name=_("Environment"))
    jwt_secret_key = models.CharField(max_length=1024, default='secret', verbose_name=_("JWT Secret Key"))
    token_min_length = models.IntegerField(default=6, help_text=_('Minimum length of the token'), verbose_name=_("Token Min Length"))
    token_max_length = models.IntegerField(default=6, help_text=_('Maximum length of the token'), verbose_name=_("Token Max Length"))
    login_with_email = models.BooleanField(default=False, help_text=_('Allow users to login with email'), verbose_name=_("Login with Email"))
    login_with_phone = models.BooleanField(default=True, help_text=_('Allow users to login with phone'), verbose_name=_("Login with Phone"))
    under_maintenance = models.BooleanField(default=False, help_text=_('Enable maintenance mode'), verbose_name=_("Under Maintenance"))
    maintenance_template = models.CharField(max_length=255, default='maintenance.html', help_text=_('Template to be used for maintenance mode'), verbose_name=_("Maintenance Template"))
    time_to_remind_users = models.TimeField(default='23:00:00', help_text=_('Time to remind users to open their gifts'), verbose_name=_("Time to Remind Users"))

    class Meta:
        verbose_name = _("Configuration")
        verbose_name_plural = _("Configurations")
    
    def __str__(self):
        return self.super_admin_username + ' - ' + self.environment


class Template(models.Model):
    TEMPLATE_CATEGORY_CHOICES = (
        ('notify_user_OTP', _('Notify User OTP')),
        ('verify_OTP', _('Verify OTP')),
        ('notify_sender_open_gift', _('Notify Sender Open Gift')),
        ('notify_receiver_to_open_gift', _('Notify Receiver to Open Gift')),
        ('notify_user_account_activity', _('Notify User Account Activity')),
        ('server_error', _('Server Error')),
        ('unauthorized', _('Unauthorized')),
        ('message', _('Message')),
    )
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    notification_type = models.CharField(max_length=255, choices=TEMPLATE_CATEGORY_CHOICES, default=TEMPLATE_CATEGORY_CHOICES[0], verbose_name=_("Notification Type"))
    subject = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Subject"))
    email_body = models.TextField(blank=True, null=True, verbose_name=_("Email Body"))
    sms_body = models.TextField(blank=True, null=True, verbose_name=_("SMS Body"))
    active = models.BooleanField(default=False, verbose_name=_("Active"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))
        
    @classmethod
    def get_available_variables(cls):
        return {
            'notify_user_OTP': ['username', 'callback_token'],
            'verify_OTP': ['username', 'callback_token'],
            'notify_sender_open_gift': ['gift_title', 'date', 'box_url'],
            'notify_receiver_to_open_gift': ['sender_name', 'date', 'box_url'],
            'notify_user_account_activity': ['username', 'time', 'date'],
            'message': ['title', 'message', 'link', 'link_text'],
            'server_error': ['home_url', 'title'],
            'unauthorized': ['login_url', 'title', 'message'],
        }
    
    def delete(self, *args, **kwargs):
        if self.active:
            raise ValueError(_("Active templates cannot be deleted."))
        else:
            super(Template, self).delete(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Template")
        verbose_name_plural = _("Templates")


class PermissionGroup(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    label = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Label"))
    description = models.TextField(blank=True, null=True, verbose_name=_("Description"))

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Permission Group")
        verbose_name_plural = _("Permission Groups")


class PermissionsModel(models.Model):
    label = models.CharField(max_length=255, verbose_name=_("Label"))
    description = models.TextField(blank=True, null=True, verbose_name=_("Description"))
    groups = models.ManyToManyField(PermissionGroup, related_name='permissions', verbose_name=_("Groups"))

    def __str__(self):
        return self.label
    
    class Meta:
        verbose_name = _("Permission")
        verbose_name_plural = _("Permissions")

class CompanyApiKey(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, verbose_name=_("Company"))
    key = models.CharField(max_length=255, unique=True, blank=True, null=True, verbose_name=_("Key"))
    groups = models.ManyToManyField(PermissionGroup, related_name='api_keys', verbose_name=_("Groups"))
    num_of_requests_made = models.PositiveBigIntegerField(default=0, verbose_name=_("Number of Requests Made"))
    max_requests = models.PositiveIntegerField(default=100, verbose_name=_("Maximum Requests"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    last_used = models.DateTimeField(auto_now=True, verbose_name=_("Last Used"))

    def __str__(self):
        return f"{self.company.name} - {self.key}"
    
    @property
    def num_of_requests_left(self):
        return self.max_requests - self.num_of_requests_made
    
    def save(self, *args, **kwargs):
        if not self.pk and not self.key:
            self.key = str(uuid.uuid4()).replace('-', '')
        super().save(*args, **kwargs)

    def regenerate_key(self):
        """Regenerate the API key."""
        self.key = str(uuid.uuid4()).replace('-', '')
        self.created_at = timezone.now()
        self.last_used = timezone.now()
        self.save()

    class Meta:
        verbose_name = _("Company API Key")
        verbose_name_plural = _("Company API Keys")

class ApiLog(models.Model):
    api_key = models.ForeignKey(CompanyApiKey, on_delete=models.CASCADE, verbose_name=_("API Key"))
    api_url = models.CharField(max_length=1024, help_text='API URL', verbose_name=_("API URL"))
    headers = models.JSONField(verbose_name=_("Headers"))
    body = models.JSONField(verbose_name=_("Body"))
    response = models.JSONField(verbose_name=_("Response"))
    method = models.CharField(max_length=10, db_index=True, verbose_name=_("Method"))
    client_ip_address = models.CharField(max_length=50, verbose_name=_("Client IP Address"))
    status_code = models.PositiveSmallIntegerField(help_text='Response status code', db_index=True, verbose_name=_("Status Code"))
    execution_time = models.DecimalField(decimal_places=5, max_digits=8,
                                        help_text='Server execution time (Not complete response time.)', verbose_name=_("Execution Time"))
    added_on = models.DateTimeField(auto_now_add=True, verbose_name=_("Added On"))
    event = models.CharField(max_length=255, verbose_name=_("Event"))

    def __str__(self):
        return f"{self.api_key} - {self.event}"
    
    class Meta:
        verbose_name = _("API Log")
        verbose_name_plural = _("API Logs")