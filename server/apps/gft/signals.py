import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Box, Company, CompanyApiKey, CompanyBoxes, Gift, Campaign
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def create_company(sender, instance, created, **kwargs):
    """create company for company type users"""
    if created and instance.user_type == 'company':
        Company.objects.create(owner=instance, name=f'{instance.username} company')


@receiver(post_save, sender=Company)
def create_company_api_key(sender, instance, created, **kwargs):
    """create company api key for newly created company"""
    if created:
        CompanyApiKey.objects.create(company=instance)


class CreateGiftBoxThread(threading.Thread):
    def __init__(self, instance):
        self.instance = instance
        threading.Thread.__init__(self)

    def run(self):
        """Logic to create gift boxes"""
        if isinstance(self.instance, Campaign):
            create_gift_boxes_for_campaign(self.instance)


def create_gift_boxes_for_campaign(campaign):
    company = Company.objects.filter(owner=campaign.company.owner).first()
    company_boxes = CompanyBoxes.objects.filter(company=company).first()
    if company_boxes:
        boxes_to_create = [
            Box(
                user=campaign.company.owner,
                title=f'{campaign.name} Box {i + 1}',
                receiver_name="",
                receiver_email="",
                receiver_phone="",
                days_of_gifting=campaign.duration,
                open_date=timezone.now(),
                is_setup=False,
                box_campaign=campaign,
                open_after_a_day=campaign.open_after_a_day,
            ) for i in range(campaign.num_boxes)
        ]
        Box.objects.bulk_create(boxes_to_create)

        boxes = Box.objects.filter(box_campaign=campaign)
        mini_boxes_to_create = []
        for box in boxes:
            for i in range(campaign.duration):
                mini_boxes_to_create.append(
                    Gift(
                        user=None,
                        box_model=box,
                        gift_title=f'{box.title} Gift {i + 1}',
                        gift_description=f'{box.title} Gift {i + 1} description',
                        open_date=box.open_date + timedelta(days=i),
                        gift_campaign=box.box_campaign,
                    )
                )
        Gift.objects.bulk_create(mini_boxes_to_create)


@receiver(post_save, sender=Campaign)
def create_gift_boxes(sender, instance, created, *args, **kwargs):
    if created:
        CreateGiftBoxThread(instance).start()