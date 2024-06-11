from django.contrib import admin
from .models import Box, BoxCategory, Config, Gift, Notification, Campaign, GiftVisit, Company, CompanyBoxes, Template, CompanyApiKey, ApiLog, PermissionGroup, PermissionsModel
from django.utils.html import format_html
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from .forms import AdminCompanyForm

User = get_user_model()


class BoxAdmin(admin.ModelAdmin):
    list_display = ['user', 'receiver_name', 'title',
                    'open_date', 'days_of_gifting', 'pkid', 'is_setup']
    search_fields = ['user__username', 'receiver_name', 'title']

    def save_model(self, request, obj, form, change):
        if not change:
            super().save_model(request, obj, form, change)
            post_save.send(sender=obj.__class__, instance=obj, created=True)
        else:
            super().save_model(request, obj, form, change)


class GiftAdmin(admin.ModelAdmin):
    list_display = ['open_date', 'user', 'gift_title', 'box_model', 'pkid']
    search_fields = ['box_model__title', 'gift_title']

    def save_model(self, request, obj, form, change):
        if not change:
            super().save_model(request, obj, form, change)
            post_save.send(sender=obj.__class__, instance=obj, created=True)
        else:
            super().save_model(request, obj, form, change)


class CampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'duration', 'num_boxes']
    search_fields = ['name']

    # TODO: fix creating boxes twice
    def save_model(self, request, obj, form, change):
        if not change:
            super().save_model(request, obj, form, change)
            post_save.send(sender=obj.__class__, instance=obj, created=True)
        else:
            super().save_model(request, obj, form, change)


class BoxCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'label', 'category', 'qty')
    list_filter = ('category',)
    search_fields = ('id', 'name', 'label', 'category', 'qty')


class CompanyBoxesAdmin(admin.ModelAdmin):
    list_display = ('id', 'company', 'box_type', 'qty')
    list_filter = ('company', 'box_type')
    search_fields = ('company__name', 'box_type__category')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'box', 'gift', 'message', 'timestamp')
    list_filter = ('user', 'box', 'gift', 'timestamp')
    search_fields = ('user__username', 'box__title', 'gift__name', 'message')
    # readonly_fields = ('user', 'box', 'gift', 'message', 'timestamp')


class GiftVisitAdmin(admin.ModelAdmin):
    list_display = ['id', 'visitor', 'gift', 'time_of_visit']
    search_fields = ['id', 'visitor__username', 'gift__gift_title']
    list_filter = ['gift']


class YoutubeVideoLogsAdmin(admin.ModelAdmin):
    list_display = ('last_accessed',)


class SenderVideoHitsAdmin(admin.ModelAdmin):
    list_display = ('sender', 'hits')


class ReceiverVideoHitsAdmin(admin.ModelAdmin):
    list_display = ('receiver', 'hits')


class CompanyBoxesInline(admin.TabularInline):
    model = CompanyBoxes
    extra = 1


class CompanyAdminForm(admin.ModelAdmin):
    inlines = (CompanyBoxesInline,)
    form = AdminCompanyForm

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return super().get_inline_instances(request, obj)
        return []


class PermissionGroupInline(admin.TabularInline):
    model = PermissionGroup.api_keys.through
    extra = 1
    verbose_name = 'Permission Group'
    verbose_name_plural = 'Permission Groups'


@admin.register(CompanyApiKey)
class CompanyApiKeyAdmin(admin.ModelAdmin):
    list_display = (
        'company_name',
        'key',
        'num_of_requests_made',
        'max_requests',
        'created_at',
        'last_used',
    )
    search_fields = ('company__name', 'key')
    list_filter = ('company__name', 'groups')
    fieldsets = (
        (None, {
            'fields': ('company', 'key', 'max_requests')
        }),
    )

    def company_name(self, obj):
        return obj.company.name

    company_name.short_description = 'Company Name'

    def display_groups(self, obj):
        return ', '.join([group.name for group in obj.groups.all()])

    display_groups.short_description = 'Permission Groups'

    inlines = [PermissionGroupInline]


@admin.register(ApiLog)
class ApiLogAdmin(admin.ModelAdmin):
    list_display = (
        'api_key_company_name',
        'api_url',
        'method',
        'status_code',
        'formatted_added_on',
    )
    list_filter = ('api_key__company', 'method', 'status_code')
    search_fields = ('api_key__company__name', 'api_url')
    readonly_fields = ('added_on',)
    fieldsets = (
        (None, {
            'fields': ('api_key', 'api_url')
        }),
        ('Request Details', {
            'fields': ('headers', 'body', 'method', 'client_ip_address'),
            'classes': ('collapse',),
        }),
        ('Response Details', {
            'fields': ('formatted_response', 'status_code', 'execution_time'),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': ('formatted_added_on',),
            'classes': ('collapse',),
        }),
        ('Additional Information', {
            'fields': ('event',),
            'classes': ('collapse',),
        })
    )
    ordering = ('-added_on',)

    def api_key_company_name(self, obj):
        return obj.api_key.company.name

    api_key_company_name.short_description = 'Company Name'
    api_key_company_name.admin_order_field = 'api_key__company__name'

    def formatted_response(self, obj):
        return format_html('<pre>{}</pre>', obj.response)

    formatted_response.short_description = 'Response'

    def formatted_added_on(self, obj):
        return obj.added_on.strftime('%Y-%m-%d %H:%M:%S')

    formatted_added_on.short_description = 'Added On'


@admin.register(PermissionGroup)
class PermissionGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'label', 'description')
    search_fields = ('name', 'label')
    list_filter = ('name',)
    fieldsets = (
        (None, {
            'fields': ('name', 'label', 'description')
        }),
    )
    ordering = ('name',)
    verbose_name_plural = 'Permission Groups'


@admin.register(PermissionsModel)
class PermissionsModelAdmin(admin.ModelAdmin):
    list_display = ('label', 'description', 'display_groups')
    search_fields = ('label',)
    list_filter = ('groups',)
    fieldsets = (
        (None, {
            'fields': ('label', 'description', 'groups')
        }),
    )
    ordering = ('label',)
    verbose_name_plural = 'Permissions'

    def display_groups(self, obj):
        return ', '.join([group.name for group in obj.groups.all()])
    display_groups.short_description = 'Permission Groups'


@admin.register(Config)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ('company_api_key', 'super_admin_username', 'api_url')
    list_filter = ('company_api_key', 'api_url')
    search_fields = ('company_api_key', 'super_admin_username', 'api_url')


class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'active', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('name',)



admin.site.register(Company, CompanyAdminForm)
admin.site.register(Box, BoxAdmin)
admin.site.register(Gift, GiftAdmin)
admin.site.register(Campaign, CampaignAdmin)
admin.site.register(GiftVisit, GiftVisitAdmin)
admin.site.register(BoxCategory, BoxCategoryAdmin)
admin.site.register(CompanyBoxes, CompanyBoxesAdmin)
admin.site.register(Template, TemplateAdmin)
