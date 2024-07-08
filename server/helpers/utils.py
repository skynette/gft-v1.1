import hashlib
import json
import random
import re
import string
import logging
import phonenumbers
from PIL import Image
from datetime import datetime, timedelta
from collections import defaultdict
from django.conf import settings
from django.utils import timezone
from urllib.parse import urlparse

from sendgrid.helpers.mail import Mail
from sendgrid import SendGridAPIClient
from twilio.rest import Client

from apps.gft.models import Box, Gift, GiftVisit, Template, Config
from django.contrib.auth import get_user_model

from typing import Dict, Union

# from apps.gft.signals import create_mini_boxes_for_box


apikey = settings.SENDGRID_API_KEY
logger = logging.getLogger(__name__)
User = get_user_model()


def sanitize_filename(filename):
    """Remove characters that are not allowed in filenames"""
    sanitized_filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    return sanitized_filename


def is_valid_hex_color(color):
    """Check if a string is a valid hex color code."""
    hex_color_pattern = r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$'
    return re.match(hex_color_pattern, color)


def validate_url(url):
    """Validate if a string is a valid URL."""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False
    
def extract_username_from_url(url):
    """Extract the username from a social media URL."""

    social_media_patterns = {
        'twitter': re.compile(r'x\.com/([^/?]+)'),
        'instagram': re.compile(r'instagram\.com/([^/?]+)'),
        'youtube': re.compile(r'youtube\.com/(user/|channel/)?([^/?]+)'),
        'facebook': re.compile(r'facebook\.com/([^/?]+)'),
        'snapchat': re.compile(r'snapchat\.com/add/([^/?]+)'),
    }

    for platform, pattern in social_media_patterns.items():
        match = pattern.search(url)
        if match:
            return match.group(1)

    return None


def build_social_media_urls(usernames):
    """Build social media URLs from a dictionary of usernames."""
    base_urls = {
        'twitter_url': 'https://x.com/',
        'instagram_url': 'https://www.instagram.com/',
        'youtube_url': 'https://www.youtube.com/user/',
        'facebook_url': 'https://www.facebook.com/',
        'snapchat_url': 'https://www.snapchat.com/add/',
    }

    result = {}
    for platform, username in usernames.items():
        if platform in base_urls and username:
            result[platform] = f"{base_urls[platform]}{username}"

    return result


def prepare_update_settings_post_data(data, files):
    """Prepare the post data for updating the company settings."""
    post_data = {}

    post_data["name"] = data.get("name", "")
    post_data["company_url"] = data.get("company_url", "")

    logo_image = files.get("logo")
    if logo_image:
        if not ImageUploader.is_valid_image(logo_image):
            raise ValueError("Invalid logo image format")
        post_data["logo"] = logo_image

    # Handle header image
    header_image = files.get("header_image")
    if header_image:
        if not ImageUploader.is_valid_image(header_image):
            raise ValueError("Invalid header image format")
        post_data["header_image"] = header_image

    socials_data = {
        "twitter_url": data.get("twitter_url", ""),
        "facebook_url": data.get("facebook_url", ""),
        "instagram_url": data.get("instagram_url", ""),
        "snapchat_url": data.get("snapchat_url", ""),
        "youtube_url": data.get("youtube_url", ""),
    }

    # Extract usernames from URLs and update socials_data
    for key, value in socials_data.items():
        if value and validate_url(value):
            username = extract_username_from_url(value)
            if username:
                socials_data[key] = username
            else:
                socials_data[key] = '' 
                
    post_data["socials"] = socials_data

    color_types = ["light", "dark"]

    for color_type in color_types:
        color_schema = {}

        for prop in ["primary_color", "secondary_color", "background_color", "qr_code_text_color", "background_border_color", "background_hover_color", "foreground_color", "header_color", "footer_color"]:
            color = data.get(f"{color_type}_{prop}", "")

            if color and is_valid_hex_color(color):
                color_schema[prop] = color

        if color_schema:
            post_data.setdefault("color_schema", {})[color_type] = color_schema
    return post_data


def get_browser_and_os_data(user):
    """Get browser and operating system visit data for a user's gift visits.

    Args:
        user: The user for whom the data is retrieved.

    Returns:
        tuple: A tuple containing two lists of dictionaries representing popular browsers and operating systems:
            - The first element of the tuple is a list of dictionaries with browser information.
            - The second element of the tuple is a list of dictionaries with operating system information.
            
            Each dictionary contains the following keys:
            - "name": The name of the browser or operating system.
            - "image_path": The path to an image representing the browser (adjust the path if needed).
            - "value": The count of visits for the browser or operating system.
            - "change_percent": The percentage change in visits compared to the previous day.
    """

    gift_visits = GiftVisit.objects.filter(
        gift__box_model__box_campaign__company=user).order_by('time_of_visit')

    # Initialize dictionaries to store browser and OS counts
    browser_counts = defaultdict(int)
    os_counts = defaultdict(int)

    # counts for the previous day
    previous_browser_counts = defaultdict(int)
    previous_os_counts = defaultdict(int)

    # Iterate through GiftVisit objects
    for gift_visit in gift_visits:
        metadata = gift_visit.metadata

        if not metadata:
            continue

        # Parse metadata string into a dictionary
        metadata_dict = json.loads(metadata)

        # Extract browser and OS information from metadata
        browser = metadata_dict.get("browser", None)
        os = metadata_dict.get("os", None)

        # Increment browser and OS counts
        if browser:
            browser_counts[browser] += 1
        if os:
            os_counts[os] += 1

        # calculate browser visits for previous day
        if gift_visit.time_of_visit.date() == (timezone.now() - timedelta(days=1)).date():
            previous_browser_counts[browser] += 1
            previous_os_counts[os] += 1

    popular_browsers = []
    popular_os = []

    # Convert dictionaries to list of dictionaries
    for browser, count in browser_counts.items():
        previous_count = previous_browser_counts[browser]
        change_percent = ((count - previous_count) / previous_count) * \
            100 if previous_count != 0 else 100.00

        browser_info = {
            "name": browser,
            # Adjust the path if needed
            "image_path": f"sash/images/browsers/{browser.lower()}.svg",
            "value": count,
            "change_percent": round(change_percent, 2),
        }
        popular_browsers.append(browser_info)

    for os, count in os_counts.items():
        previous_count = previous_os_counts[os]
        change_percent = ((count - previous_count) / previous_count) * \
            100 if previous_count != 0 else 100.00

        os_info = {
            "name": os,
            "value": count,
            "change_percent": round(change_percent, 2),
        }
        popular_os.append(os_info)

    return popular_browsers, popular_os


def validate_phone(phone):
    """Validates a phone number based on a regular expression pattern and phonenumbers library.

    Args:
        phone (str): The phone number to be validated.

    Returns:
        str or None: The validated phone number if it matches the pattern and is a valid phone number; None otherwise.
    """
    phone_regex = r'\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}'
    try:
        phone = re.sub(r'\D', '', phone)  # Remove non-digit characters

        # Check using regular expression pattern
        if re.match(phone_regex, phone):
            parsed_phone = phonenumbers.parse("+" + phone, None)

            # Check if the phone number is a possible and valid number
            if phonenumbers.is_possible_number(parsed_phone) and phonenumbers.is_valid_number(parsed_phone):
                return phone
            else:
                return None
        else:
            return None
    except Exception as e:
        print("Error validating phone:", str(e))
        return None

class ImageUploader:
    """ImageUploader provides utility methods for verifying and uploading images"""

    @staticmethod
    def is_valid_image(image):
        """Check if an image is of a valid format."""
        try:
            img = Image.open(image)
            img.verify()
            return True
        except (IOError, SyntaxError):
            return False

    @staticmethod
    def generate_random_text(length=6):
        """Generate random text of a specified length."""
        letters = string.ascii_letters + string.digits
        return ''.join(random.choice(letters) for _ in range(length))

    @staticmethod
    def calculate_image_hash(image):
        """Calculate a hash of the image content."""
        hash_md5 = hashlib.md5()
        for chunk in image.chunks():
            hash_md5.update(chunk)
        return hash_md5.hexdigest()

    @staticmethod
    def handle_image_upload(user, current_image, new_image=None):
        """Handle the upload of a new image for a user and replace the current image if it has different content.

        Args:
            user (CustomUser): The user for whom the image is being uploaded.
            current_image (ImageField): The current user image (if it exists).
            new_image (File): The new image to be uploaded.

        Returns:
            str or bool: A string indicating the result of the upload operation:
                - "invalid" if the new image is of an unsupported format.
                - "duplicate" if the new image has the same content as the current image.
                - True if the image was successfully updated.
                - False if no image was provided.
                - "error" if an exception occurred during the process.
        """
        try:
            if new_image:
                if not ImageUploader.is_valid_image(new_image):
                    return "invalid"

                # Calculate the hash of the new image
                new_image_hash = ImageUploader.calculate_image_hash(new_image)

                # Calculate the hash of the current image (if it exists)
                current_image_hash = ""
                if current_image:
                    current_image_hash = ImageUploader.calculate_image_hash(current_image)

                # Check if the new image has the same content as the current image
                if new_image_hash != current_image_hash:
                    # Update the image with the new one
                    user.image = new_image
                    user.save()
                    return True
                
                else:
                    return "duplicate"
                
            return False
        except Exception as e:
            print("error occured", e)
            return "error"


def get_gifts_received_past_seven_days(request):
    """Get the count of gifts received by the user in the past seven days.

    Args:
        request: The Django request object.

    Returns:
        list: A list of integers representing the count of gifts received for each of the past seven days.
              The list is ordered from oldest to newest.
    """
    today = datetime.now().date()
    date_range = [(today - timedelta(days=i)) for i in range(7)]

    counts = []
    for date in date_range:
        count = Gift.objects.filter(
            box_model__receiver_email=request.user.email, box_model__open_date=date).count()
        counts.append(count)

    return counts[::-1]


def get_gifts_sent_past_seven_days(request):
    """Get the count of gifts sent by the user in the past seven days.

    Args:
        request: The Django request object.

    Returns:
        list: A list of integers representing the count of gifts sent for each of the past seven days.
              The list is ordered from oldest to newest.
    """
    today = datetime.now().date()
    date_range = [(today - timedelta(days=i)) for i in range(7)]

    counts = []
    for date in date_range:
        count = Gift.objects.filter(
            box_model__user=request.user, box_model__open_date=date).count()
        counts.append(count)

    return counts[::-1]


def get_total_boxes_sent_past_seven_days(request):
    """Get the count of total boxes sent by the user in the past seven days.

    Args:
        request: The Django request object.

    Returns:
        list: A list of integers representing the count of total boxes sent for each of the past seven days.
              The list is ordered from oldest to newest.
    """
    today = datetime.now().date()
    date_range = [(today - timedelta(days=i)) for i in range(7)]

    counts = []
    for date in date_range:
        count = Box.objects.filter(user=request.user, open_date=date).count()
        counts.append(count)

    return counts[::-1]


def get_total_boxes_received_past_seven_days(request):
    """Get the count of total boxes received by the user in the past seven days.

    Args:
        request: The Django request object.

    Returns:
        list: A list of integers representing the count of total boxes received for each of the past seven days.
              The list is ordered from oldest to newest.
    """
    today = datetime.now().date()
    date_range = [(today - timedelta(days=i)) for i in range(7)]

    counts = []
    for date in date_range:
        count = Box.objects.filter(
            receiver_email=request.user.email, open_date=date).count()
        counts.append(count)

    return counts[::-1]


def get_labels():
    """Generate date labels for the past seven days in the format "YYYY-MM-DD".

    Returns:
        list: A list of date labels representing the past seven days, ordered from oldest to newest.
    """
    today = datetime.now().date()
    date_labels = [today - timedelta(days=i) for i in range(7)]
    date_labels = [date.strftime("%Y-%m-%d") for date in date_labels]

    # Reverse the list to have the dates in chronological order (from oldest to newest)
    date_labels.reverse()

    return date_labels


class TemplateHandler:
    """
    A class that handles the processing and sending of notifications based on predefined templates and associated variables.

    Attributes:
        None

    Methods:
        get_template(template_label, action):
            Retrieves the template based on the provided template label and action.
        
        get_variables_dictionary(action):
            Retrieves a dictionary of variables based on the provided action from the respective models.
        
        render_template(template_body, variables_dict):
            Renders the template by replacing the placeholder variables with their corresponding values.
        
        process_and_send_notification(template_label, action, notification_type='sms'):
            Processes and sends the notification using the appropriate template, action, and notification type.

    Usage:
        handler = TemplateHandler()
        rendered_template = handler.process_and_send_notification('notify_user_otp', 'notify_otp', notification_type='sms')
    """

    def get_template(self, template_label, action):
        """
        Retrieves the template based on the provided template label and action.

        Args:
            template_label (str): The label of the template to be retrieved.
            action (str): The action associated with the template.

        Returns:
            Template object if found, None otherwise.
        """
        try:
            template = Template.objects.get(name=template_label, notification_type=action, active=True)
            return template
        except Template.DoesNotExist:
            return None

    def get_variables_dictionary(self, action, **kwargs):
        """
        Retrieves a dictionary of variables based on the provided action and additional arguments for fetching relevant data.

        Args:
            action (str): The action associated with the variables.
            kwargs: Additional arguments for retrieving relevant information from models.

        Returns:
            dict: A dictionary of variables for the specified action fetched from the appropriate models.
        """
        config = Config.objects.first()
        if action == 'notify_sender_open_gift':
            # Fetch variables from relevant models for this action using the provided kwargs
            gift_id = kwargs['gift_id']
            gift = Gift.objects.filter(pkid=gift_id).first()
            base_url = config.api_url
            box_url = base_url + gift.box_model.get_absolute_url()
            date = gift.open_date
            return {
                'gift_title': gift.gift_title,
                'date': date,
                'box_url': box_url
            }
        
        elif action == 'notify_user_OTP':
            username = User.objects.get(id=kwargs['user_id']).username
            callback_token = kwargs['callback_token']
            return {'username': username, 'callback_token': callback_token}
        
        elif action == 'verify_OTP':
            # Fetch variables from relevant models for this action using the provided kwargs
            username = User.objects.get(id=kwargs['user_id']).username
            callback_token = kwargs['callback_token']
            return {'username': username, 'callback_token': callback_token}
        
        elif action == 'notify_receiver_to_open_gift':
            # Fetch variables from relevant models for this action using the provided kwargs
            gift_id = kwargs['gift_id']
            gift = Gift.objects.filter(pkid=gift_id).first()
            base_url = config.api_url
            box_url = base_url + gift.box_model.get_absolute_url()
            date = gift.open_date
            return {
                'gift_title': gift.gift_title,
                'date': date,
                'box_url': box_url
            }
        
        elif action == 'notify_user_account_activity':
            # Fetch variables from relevant models for this action using the provided kwargs
            user_id = kwargs['user_id']
            user = User.objects.filter(pk=user_id).first()
            date = datetime.now()
            return {
                'user_name': user.username,
                'date': date,
                'time': date.strftime('%H:%M:%S'),
            }
        
        elif action == 'message':
            return {
                'message': kwargs['message'],
                'title': kwargs['title'] if 'title' in kwargs else '',
                'message': kwargs['message'] if 'message' in kwargs else '',
                'link': kwargs['link'] if 'link' in kwargs else '',
                'link_text': kwargs['link_text'] if 'link_text' in kwargs else '',
            }
        
        elif action == 'server_error':
            return {
                'home_url': kwargs['home_url'],
                'title': kwargs['title'],
            }
        
        elif action == 'unauthorized':
            return {
                'login_url': kwargs['login_url'],
                'title': kwargs['title'],
                'message': kwargs['message'],
            }
        
        else:
            return {}

    def render_template(self, template_body, variables_dict):
        """
        Renders the template by replacing the placeholder variables with their corresponding values.

        Args:
            template_body (str): The body of the template to be rendered.
            variables_dict (dict): A dictionary containing the variables and their corresponding values.

        Returns:
            str: The rendered template body with variables replaced.
        """
        rendered_template = template_body
        for key, value in variables_dict.items():
            rendered_template = rendered_template.replace('{{' + str(key) + '}}', str(value))
        return rendered_template

    def process_and_send_notification(self, template_label, action, notification_type='sms', **kwargs):
        """
        Processes and sends the notification using the appropriate template, action, and notification type.

        Args:
            template_label (str): The label of the template to be used for the notification.
            action (str): The action associated with the notification.
            notification_type (str): The type of notification, either 'email' or 'sms'.

        Returns:
            str: The rendered template ready for sending.
        """
        template = self.get_template(template_label, action)
        if not template:
            return None

        if notification_type == 'email':
            template_body = template.email_body
        elif notification_type == 'sms':
            template_body = template.sms_body
        else:
            return None

        variables_dict = self.get_variables_dictionary(action, **kwargs)
        rendered_template = self.render_template(template_body, variables_dict)

        return rendered_template
    
    def get_subject(self, label):
        """
        Retrieves the subject of the template based on the provided template label.
        """
        try:
            template = Template.objects.get(name=label, active=True)
            return template.subject
        except Template.DoesNotExist:
            return None




def send_email(receiver_email: str, subject: str, html_content: str) -> Dict[str, Union[bool, str]]:
    """
    Sends an email using SendGrid.

    Parameters:
    - receiver_email (str): Email address of the recipient.
    - subject (str): Subject of the email.
    - html_content (str): HTML content of the email body.

    Returns:
    - dict: Dictionary with 'status' indicating success or failure (boolean) and 'message' (str) with the corresponding message.
    """
    try:
        # Fetch SendGrid API key from configuration
        config = Config.objects.first()
        api_key = config.sendgrid_api_key

        # Construct the email message
        message = Mail(
            from_email=settings.DEFAULT_FROM_EMAIL,
            to_emails=receiver_email,
            subject=subject,
            html_content=html_content
        )

        # Send email using SendGrid API
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        print("email message", html_content)
        print("Email sent successfully:", response)
        return {'status': True, 'message': 'Email sent successfully'}
    except Exception as e:
        print("Error sending email:", str(e))
        return {'status': False, 'message': str(e)}


def send_sms(receiver_phone: str, content: str) -> bool:
    """
    Sends an SMS message using Twilio.

    Parameters:
    - receiver_phone (str): The phone number of the message recipient.
    - content (str): The content or body of the SMS.

    Returns:
    - bool: True if the SMS was sent successfully, False otherwise.

    Example:
    send_sms('+1234567890', 'This is the content of the SMS.')
    """
    try:
        # Fetch configuration
        config = Config.objects.first()
        account_sid = config.twilio_account_sid
        auth_token = config.twilio_auth_token
        twilio_number = config.twilio_number
        
        twilio_client = Client(account_sid, auth_token)

        # Send the SMS
        message = twilio_client.messages.create(
            body=content,
            to=receiver_phone,
            from_=twilio_number
        )

        # Check if the SMS was successfully sent
        if message.sid:
            return True
        else:
            return False

    except Exception as e:
        print(f"Failed to send SMS to {receiver_phone}. Error: {str(e)}")
        return False



def get_receiver_contact_info(user):
    """Determines the preferred contact method and corresponding contact information for a user.
    This function prioritizes mobile for SMS before email for communication.

    Args:
    - user (object): User object containing contact details and preferences.

    Returns:
    - Tuple: Contact information (email or mobile) and preferred contact method.
    """
    contact_info = None
    preferred_contact = None

    if user.contact_preference == 'email':
        if user.email:
            contact_info = user.email
            preferred_contact = 'email'
        elif user.mobile:
            contact_info = user.mobile
            preferred_contact = 'mobile'

    elif user.contact_preference != 'email':
        if user.email and not user.mobile:
            contact_info = user.email
            preferred_contact = 'email'
        elif user.mobile:
            contact_info = user.mobile
            preferred_contact = 'mobile'

    return contact_info, preferred_contact


# def create_boxes_in_background(campaign, num_boxes_to_create):
#     for i in range(num_boxes_to_create):
#         box = Box.objects.create(
#             user=campaign.company,
#             title=f'{campaign.name} Box {campaign.num_boxes + i + 1}',
#             receiver_name="",
#             receiver_email="",
#             receiver_phone="",
#             days_of_gifting=campaign.duration,
#             open_date=timezone.now(),
#             is_setup=False,
#             box_campaign=campaign,
#             open_after_a_day=campaign.open_after_a_day,
#         )
#         create_mini_boxes_for_box(box, days_of_gifting=campaign.duration)
