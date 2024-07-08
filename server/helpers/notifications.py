import markdown
from apps.gft.models import Box, Config, Gift, Notification
from helpers.utils import TemplateHandler, get_receiver_contact_info, send_email, send_sms
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client
from django.conf import settings
from drfpasswordless.settings import api_settings
from django.contrib.auth import get_user_model
from typing import Optional, Union


template_handler = TemplateHandler()
User = get_user_model()


def send_email_with_callback_token(user, email_token, **kwargs):
    """
    Sends an email to user.email using the SendGrid API.

    Passes silently without sending in a test environment.
    """
    try:
        if api_settings.PASSWORDLESS_EMAIL_NOREPLY_ADDRESS:
            # Make sure we have a sending address before sending.

            # Fetch configuration
            config = Config.objects.first()
            apikey = config.sendgrid_api_key

            # Update template_label and action according to your requirements
            template_label = 'notify_user_OTP'
            action = 'notify_user_OTP'

            # Fetch the template content
            template_content = template_handler.process_and_send_notification(
                template_label, action, notification_type='email', user_id=user.id, callback_token=email_token
            )

            if not template_content:
                print(
                    f"Failed to retrieve template content for {template_label}")
                return False

            email_subject = template_handler.get_subject(template_label)
            rendered_template = markdown.markdown(template_content)

            receiver_contact = None
            method = None

            # Check the contact preference and send the email or SMS accordingly
            if kwargs.get('receiver_contact'):
                receiver_contact = kwargs.get('receiver_contact')
            else:
                receiver_contact, method = get_receiver_contact_info(user)

            if method == 'mobile':
                res = send_sms_with_callback_token(
                    user, email_token, receiver_contact=receiver_contact)
                return res == True

            try:
                message = Mail(
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to_emails=receiver_contact,
                    subject=email_subject,
                    html_content=rendered_template
                )

                if config.environment == "DEVELOPMENT":
                    message = message.get()
                    message = message['content'][0]['value']
                    print(f'\n[+] {message}')

                else:
                    sg = SendGridAPIClient(apikey)
                    response = sg.send(message)
                    message = message.get()
                    message = message['content'][0]['value']
                    print(f'\n[+] {message}')
                    print("Email sent successfully:", response)
                return True
            except Exception as e:
                print("An error occurred", e)
                return False

        else:
            print(
                "Failed to send token email. Missing PASSWORDLESS_EMAIL_NOREPLY_ADDRESS.")
            return False

    except Exception as e:
        print(
            f"Failed to send token email to user: {user.id}. Possibly no email on user object. Email entered was {getattr(user, api_settings.PASSWORDLESS_USER_EMAIL_FIELD_NAME)}"
        )
        print(e)
        return False


def send_sms_with_callback_token(user, mobile_token, **kwargs):
    """
    Sends an SMS to user.mobile via Twilio.

    Passes silently without sending in the test environment.
    """
    try:
        # Fetch configuration
        config = Config.objects.first()
        account_sid = config.twilio_account_sid
        auth_token = config.twilio_auth_token

        receiver_contact = None
        method = None

        if kwargs.get('receiver_contact'):
            receiver_contact = kwargs.get('receiver_contact')
        else:
            receiver_contact, method = get_receiver_contact_info(user)

        if method == 'email':
            send_email_with_callback_token(
                user, mobile_token, receiver_contact=receiver_contact)
            return True

        # Check if the environment is set to development and if the user's contact preference is mobile
        if config.environment == "DEVELOPMENT":
            print(
                f"SMS SENT: mobile_token: {mobile_token} to {receiver_contact}")
            return True

        if config.twilio_number:
            template_label = 'notify_user_OTP'
            action = 'notify_user_OTP'

            # Fetch the template content
            template_content = template_handler.process_and_send_notification(
                template_label, action, notification_type='sms', user_id=user.id, callback_token=mobile_token
            )

            if not template_content:
                print(
                    f"Failed to retrieve template content for {template_label}")
                return False

            twilio_client = Client(account_sid, auth_token)

            # to_number = getattr(user, api_settings.PASSWORDLESS_USER_MOBILE_FIELD_NAME)
            # if to_number.__class__.__name__ == 'PhoneNumber':
            #     to_number = to_number.__str__()

            to_number = receiver_contact

            twilio_client.messages.create(
                body=template_content,
                to=to_number,
                from_=config.twilio_number
            )
            return True
        else:
            print("Failed to send token SMS. Missing Twilio number.")
            return False

    except ImportError:
        print("Couldn't import Twilio client. Is Twilio installed?")
        return False
    except KeyError:
        print("Couldn't send SMS. Make sure you set your Twilio account tokens and specify a Twilio number.")
        return False
    except Exception as e:
        print(
            f"Failed to send token SMS to user: {user.id}. Possibly no mobile number on the user object or the Twilio package isn't set up yet. The number entered was {getattr(user, api_settings.PASSWORDLESS_USER_MOBILE_FIELD_NAME)}")
        print(e)
        return False


def send_notify_sender_open_gift(gift_pkid: str, notification_type: str, user: User, box: Box, *args, **kwargs) -> Union[bool, None]: # type: ignore
    """Sends a notification to the sender that their gift has been opened.

    Args:
    - gift_pkid (str): The primary key ID of the gift.
    - notification_type (str): Type of notification (e.g., "sms" or "email").
    - user (User): The sender of the gift.
    - box (Box): The box associated with the gift.
    - *args: Variable length argument list.
    - **kwargs: Arbitrary keyword arguments.

    Returns:
    - Union[bool, None]: True if notification sent successfully, False if failed, None if exception occurs.
    """

    try:
        # Fetch the gift associated with the provided ID
        gift = Gift.objects.get(pkid=gift_pkid)

        # Create a notification object for the sender
        Notification.objects.create(
            user=user, box=box, gift=gift, message="Your gift has been opened!")

        # Fetch the template content
        template_label = 'notify_sender_open_gift'
        action = 'notify_sender_open_gift'
        template_content = template_handler.process_and_send_notification(
            template_label, action, notification_type=notification_type, gift_id=gift_pkid)

        if not template_content:
            print(f"Failed to retrieve template content for {template_label}")
            return False

        if notification_type == "sms":
            send_sms(
                receiver_phone=kwargs["receiver_phone"], content=template_content)
            return True

        elif notification_type == "email":
            subject = template_handler.get_subject(template_label)
            send_email(receiver_email=kwargs["receiver_email"],
                       html_content=template_content, subject=subject)
            return True

    except Gift.DoesNotExist:
        print("Gift does not exist.")
        return False
    except Exception as e:
        print(f"Failed to send notification: {str(e)}")
        return None


def send_notify_receiver_to_open_gift(gift_pkid: str, notification_type: str, receiver_email: str, receiver_phone: str, message: str) -> Union[bool, None]:
    """Send notification to remind the receiver to open their gift.

    Args:
    - gift_pkid (str): The primary key ID of the gift.
    - notification_type (str): Type of notification (e.g., "sms" or "email").
    - receiver_email (str): Receiver's email address.
    - receiver_phone (str): Receiver's phone number.
    - message (str): Notification message subject.

    Returns:
    - Union[bool, None]: True if notification sent successfully, False if failed, None if exception occurs.
    """

    try:
        # Fetch the gift associated with the provided ID
        gift = Gift.objects.get(pkid=gift_pkid)

        # Find the receiver based on email or phone
        receiver: Optional[User] = User.objects.filter(email=receiver_email).first( # type: ignore
        ) or User.objects.filter(phone=receiver_phone).first()

        if receiver:
            # Create a notification object for the receiver
            Notification.objects.create(
                user=receiver, box=gift.box, gift=gift, message="Reminder: Open your gift!")

            # Fetch the template content
            template_label = 'notify_receiver_to_open_gift'
            action = 'notify_receiver_to_open_gift'
            template_content = template_handler.process_and_send_notification(
                template_label,
                action,
                notification_type=notification_type,
                gift_id=gift_pkid
            )

            if not template_content:
                print(
                    f"Failed to retrieve template content for {template_label}")
                return False

            if notification_type == "sms":
                send_sms(receiver_phone=receiver_phone, content=message)
                return True

            elif notification_type == "email":
                subject = "Reminder: Open Your Gift!"
                send_email(receiver_email=receiver_email,
                           html_content=template_content, subject=subject)
                return True

        else:
            print("Receiver not found.")
            return False

    except Gift.DoesNotExist:
        print("Gift does not exist.")
        return False
    except Exception as e:
        print(f"Failed to send notification: {str(e)}")
        return None
