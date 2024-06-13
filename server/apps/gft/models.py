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
from phonenumber_field.modelfields import PhoneNumberField

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
    owner = models.ForeignKey(User, on_delete=models.CASCADE, help_text="The owner of the company")
    name = models.CharField(max_length=255, help_text="Name of the company")
    logo = models.ImageField(upload_to='company/logos/', help_text="Logo of the company")
    header_image = models.ImageField(upload_to='company/headers/', help_text="Header image for the company")
    company_url = models.CharField(max_length=255, help_text="URL of the company's website")
    box_limit = models.IntegerField(help_text="Maximum number of gift boxes the company can manage")
    socials = models.JSONField(help_text="Social media information for the company")
    color_schema = models.JSONField(help_text="Color scheme used by the company")


    def get_company_users(self):
        """
        Retrieves users associated with this company.

        Returns:
            QuerySet: Users associated with the company.
        """
        return self.companyuser_set.all()
    
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
    company = models.ForeignKey(Company, on_delete=models.CASCADE, help_text="The company the user is associated with")
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="The user associated with the company")

    def __str__(self) -> str:
        return f"{self.company} {self.user.get_username()}"

    class Meta:
        verbose_name = _("Company User")
        verbose_name_plural = _("Company Users")


class BoxCategory(models.Model):
    """
    Represents types of gift boxes available in the application.

    Attributes:
        name (CharField): Name of the box category.
        label (Auto-generated): Auto-generated slug based on the name.
        category (CharField): Type of box duration (e.g., THREE_DAYS, SEVEN_DAYS).
        qty (IntegerField): Available quantity of boxes for this category.
    """
    
    class CATEGORY_CHOICES(models.TextChoices):
        THREE_DAYS = '3', _('3 days')
        SEVEN_DAYS = '7', _('7 days')
        FOURTEEN_DAYS = '14', _('14 days')
        THIRTY_DAYS = '30', _('30 days')

    name = models.CharField(max_length=255, help_text="Name of the box category")
    label = models.SlugField(unique=True, help_text="Auto-generated slug based on the name")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES.choices, help_text="Type of box duration")
    qty = models.IntegerField(help_text="Available quantity of boxes for this category")

    def __str__(self):
        return f"{self.category} days box - ({self.qty} boxes available)"
    
    def clean(self):
        """
        Validates the quantity to ensure it is not negative or zero.
        """
        if self.qty < 0:
            raise ValidationError("Quantity cannot be negative.")
        elif self.qty == 0:
            raise ValidationError("Quantity cannot be zero.")
    
    def save(self, *args, **kwargs):
        if not self.label:
            self.label = slugify(f"{self.name}").replace('-', '_')
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = _('Box Category')
        verbose_name_plural = _('Box Categories')


class CompanyBoxes(models.Model):
    """
    Represents the types and quantities of gift boxes owned by a company.

    Attributes:
        company (ForeignKey to Company): The company owning the gift boxes.
        box_type (ForeignKey to BoxCategory): Type of gift box.
        qty (IntegerField): Quantity of boxes available.
    """

    company = models.ForeignKey(Company, on_delete=models.CASCADE, help_text="The company owning the gift boxes")
    box_type = models.ForeignKey(BoxCategory, on_delete=models.CASCADE, help_text="Type of gift box")
    qty = models.IntegerField(help_text="Quantity of boxes available")

    def __str__(self):
        return f"{self.company.name} - {self.box_type.name} - ({self.qty})"

    
    class Meta:
        verbose_name = _("Company Box")
        verbose_name_plural = _("Company Boxes")


class Box(TimeStampedUUIDModel):
    """Represents a Gift-Box Package"""
    
    user = models.ForeignKey(User, related_name='box_user', on_delete=models.CASCADE, null=True, blank=True, help_text="User who owns the gift box")
    title = models.CharField(max_length=150, help_text="Title for the gift box package")
    receiver_name = models.CharField(max_length=150, blank=True, null=True, help_text="Name of the receiver")
    receiver_email = models.CharField(max_length=150, blank=True, null=True, help_text="Email of the receiver")
    receiver_phone = PhoneNumberField(blank=True, null=True, help_text="Phone number of the receiver")
    days_of_gifting = models.IntegerField(help_text="Number of days the gift box spans")
    open_date = models.DateField(default=timezone.now, help_text="Date when the gift box can be opened")
    last_opened = models.DateField(blank=True, null=True, help_text="Date when the gift box was last opened")
    is_setup = models.BooleanField(default=False, help_text="Indicates if the gift box setup is complete")
    is_company_setup = models.BooleanField(default=False, help_text="Indicates if the gift box is set up by the company")
    box_campaign = models.ForeignKey("Campaign", on_delete=models.CASCADE, blank=True, null=True, help_text="Campaign associated with this gift box")
    qr_code_v = models.ImageField(upload_to='gift_qr_codes/', blank=True, null=True, help_text="QR code image for the gift box")
    open_after_a_day = models.BooleanField(default=False, help_text="Allow opening mini boxes only once a day")

    def get_absolute_url(self):
        return reverse('index:view_box', args=[str(self.pkid)])

    @property
    def get_qr_code(self, request):
        domain = domain = request.META['HTTP_HOST']
        url = domain + self.get_absolute_url()
        return url

    def can_be_opened_after_a_day(self):
        """
        Checks if the mini gift box can be opened more than once in a 24-hour period.

        Returns:
            bool: True if it can be opened more than once in 24 hours, False otherwise.
        """
        if self.last_opened:
            last_opened_datetime = datetime.combine(self.last_opened, datetime.min.time())
            return last_opened_datetime + timedelta(hours=24) <= timezone.now()
        return True

    @property
    def company(self):
        """
        Retrieves the company associated with the gift box.

        Returns:
            Company: Company object associated with the gift box.
        """
        return Company.objects.filter(user=self.box_campaign.company).first()


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
    user = models.ForeignKey(User, related_name='gift_user', on_delete=models.CASCADE, null=True, blank=True, help_text="User who owns the mini box")
    box_model = models.ForeignKey(Box, related_name='gift_box', on_delete=models.CASCADE, help_text="Gift box that contains this mini box")
    gift_title = models.CharField(max_length=255, help_text="Title of the mini box gift")
    gift_description = models.TextField(help_text="Description of the mini box gift")
    gift_content_type = models.CharField(max_length=255, default="text", help_text="Type of content in the mini box gift")
    gift_campaign = models.ForeignKey("Campaign", on_delete=models.CASCADE, blank=True, null=True, help_text="Campaign associated with this mini box")
    reaction = models.CharField(max_length=255, blank=True, null=True, help_text="Reaction associated with opening the mini box")
    opened = models.BooleanField(default=False, help_text="Indicates if the mini box has been opened")
    open_date = models.DateField(help_text="Date when the mini box can be opened")
    qr_code_v = models.ImageField(upload_to='gift_qr_codes/', blank=True, null=True, help_text="QR code image for the mini box")

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
    """
    Represents a notification related to a gift box or mini box.

    Attributes:
        user (ForeignKey to User): User who receives the notification.
        box (ForeignKey to Box): Gift box that the notification is about.
        gift (ForeignKey to Gift): Mini box that the notification is about.
        message (CharField): Content of the notification message.
        read (BooleanField): Indicates if the notification has been read.
        timestamp (DateTimeField): Timestamp when the notification was created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, help_text="User who receives the notification")
    box = models.ForeignKey(Box, on_delete=models.CASCADE, help_text="Gift box that the notification is about")
    gift = models.ForeignKey(Gift, on_delete=models.CASCADE, help_text="Mini box that the notification is about")
    message = models.CharField(max_length=255, help_text="Content of the notification message")
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
    """
    Represents a campaign organized by a company.

    Attributes:
        company (ForeignKey to Company): Company organizing the campaign.
        name (CharField): Name of the campaign.
        company_boxes (ForeignKey to CompanyBoxes, optional): Company's gift boxes used in the campaign.
        duration (IntegerField): Duration of the campaign in days.
        num_boxes (IntegerField): Number of gift boxes in the campaign.
        header_image (ImageField, optional): Header image for the campaign.
        open_after_a_day (BooleanField): Whether to allow opening mini boxes only once a day.
        is_deleted (BooleanField): Indicates if the campaign is deleted.
    """

    company = models.ForeignKey(Company, on_delete=models.CASCADE, help_text="Company organizing the campaign")
    name = models.CharField(max_length=255, help_text="Name of the campaign")
    company_boxes = models.ForeignKey(CompanyBoxes, on_delete=models.CASCADE, blank=True, null=True, help_text="Company's gift boxes used in the campaign")
    duration = models.IntegerField(help_text="Duration of the campaign in days")
    num_boxes = models.IntegerField(help_text="Number of gift boxes in the campaign")
    header_image = models.ImageField(upload_to='campaigns/headers', blank=True, null=True, help_text="Header image for the campaign")
    open_after_a_day = models.BooleanField(default=True, help_text="Whether to allow opening mini boxes only once a day")
    is_deleted = models.BooleanField(default=False, help_text="Indicates if the campaign is deleted")

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
    """
    Represents a visit or interaction with a mini box.

    Attributes:
        gift (ForeignKey to Gift): Mini box being visited.
        time_of_visit (DateTimeField): Timestamp of the visit.
        visitor (ForeignKey to User): User who visited the mini box.
        metadata (JSONField, optional): Additional metadata
    """
    gift = models.ForeignKey(Gift, on_delete=models.CASCADE, help_text="Mini box being visited")
    time_of_visit = models.DateTimeField(auto_now_add=True, help_text="Timestamp of the visit")
    visitor = models.ForeignKey(User, on_delete=models.CASCADE, help_text="User who visited the mini box")
    metadata = models.JSONField(blank=True, null=True, help_text="Additional metadata about the visit")


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
    """
    Represents a notification template for various purposes.

    Attributes:
        name (CharField): Name of the template.
        notification_type (CharField): Type of notification template.
        subject (CharField, optional): Subject of the email notification.
        email_body (TextField, optional): Body of the email notification.
        sms_body (TextField, optional): Body of the SMS notification.
        active (BooleanField): Indicates if the template is currently active.
        created_at (DateTimeField): Timestamp when the template was created.
        updated_at (DateTimeField): Timestamp when the template was last updated.
    """

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
    notification_type = models.CharField(
        max_length=255,
        choices=TEMPLATE_CATEGORY_CHOICES,
        default=TEMPLATE_CATEGORY_CHOICES[0],
        verbose_name=_("Notification Type"),
        help_text="Type of notification template"
    )
    subject = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Subject"),
        help_text="Subject of the email notification"
    )
    email_body = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("Email Body"),
        help_text="Body of the email notification"
    )
    sms_body = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("SMS Body"),
        help_text="Body of the SMS notification"
    )
    active = models.BooleanField(default=False, verbose_name=_("Active"), help_text="Is this template active?")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))

    @classmethod
    def get_available_variables(cls):
        """
        Provides a dictionary of available variables based on notification type.

        Returns:
            dict: Dictionary mapping notification types to available variables.
        """
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
        """
        Overrides delete method to prevent deletion of active templates.
        """
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
    """
    Represents a group of permissions.

    Attributes:
        name (CharField): Name of the permission group.
        label (CharField, optional): Label for the permission group.
        description (TextField, optional): Description of the permission group.
    """

    name = models.CharField(max_length=255, verbose_name=_("Name"))
    label = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Label"),
        help_text="Label for the permission group"
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("Description"),
        help_text="Description of the permission group"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Permission Group")
        verbose_name_plural = _("Permission Groups")


class PermissionsModel(models.Model):
    """
    Represents a single permission with its groups.

    Attributes:
        label (CharField): Label for the permission.
        description (TextField, optional): Description of the permission.
        groups (ManyToManyField): Groups associated with the permission.
    """

    label = models.CharField(max_length=255, verbose_name=_("Label"))
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("Description"),
        help_text="Description of the permission"
    )
    groups = models.ManyToManyField(
        PermissionGroup,
        related_name='permissions',
        verbose_name=_("Groups"),
        help_text="Groups associated with the permission"
    )

    def __str__(self):
        return self.label

    class Meta:
        verbose_name = _("Permission")
        verbose_name_plural = _("Permissions")


class CompanyApiKey(models.Model):
    """
    Represents an API key associated with a company.

    Attributes:
        company (ForeignKey): Company associated with the API key.
        key (CharField, optional): API key value.
        groups (ManyToManyField): Groups associated with the API key.
        num_of_requests_made (PositiveBigIntegerField): Number of requests made using the API key.
        max_requests (PositiveIntegerField): Maximum number of requests allowed for the API key.
        created_at (DateTimeField): Timestamp when the API key was created.
        last_used (DateTimeField): Timestamp when the API key was last used.
    """

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        verbose_name=_("Company"),
        help_text="Company associated with the API key"
    )
    key = models.CharField(
        max_length=255,
        unique=True,
        blank=True,
        null=True,
        verbose_name=_("Key"),
        help_text="API key value"
    )
    groups = models.ManyToManyField(
        PermissionGroup,
        related_name='api_keys',
        verbose_name=_("Groups"),
        help_text="Groups associated with the API key"
    )
    num_of_requests_made = models.PositiveBigIntegerField(
        default=0,
        verbose_name=_("Number of Requests Made"),
        help_text="Number of requests made using the API key"
    )
    max_requests = models.PositiveIntegerField(
        default=100,
        verbose_name=_("Maximum Requests"),
        help_text="Maximum number of requests allowed for the API key"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    last_used = models.DateTimeField(auto_now=True, verbose_name=_("Last Used"))

    def __str__(self):
        return f"{self.company.name} - {self.key}"

    @property
    def num_of_requests_left(self):
        return self.max_requests - self.num_of_requests_made

    def save(self, *args, **kwargs):
        """
        Overrides save method to generate a new API key if not provided.
        """
        if not self.pk and not self.key:
            self.key = str(uuid.uuid4()).replace('-', '')
        super().save(*args, **kwargs)

    def regenerate_key(self):
        """
        Regenerates the API key and updates timestamps.
        """
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