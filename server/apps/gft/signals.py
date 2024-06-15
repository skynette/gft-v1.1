import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Box, Company, CompanyBoxes, Gift, Campaign
from django.conf import settings
import datetime
from django.utils import timezone
from django.contrib.auth import get_user_model
