import markdown
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client
from django.conf import settings
from apps.gft.models import Config
from helpers.utils import TemplateHandler


def send_custom_notification(receiver_contact, template_label):
    """Function to send custom notifications
    :param receiver_contact: Email address or phone number of the receiver
    :param template_label: Label of the template to be used
    :return: Dictionary with status and message
    """

    # Fetch configuration
    config = Config.objects.first()

    apikey = config.sendgrid_api_key
    account_sid = config.twilio_account_sid
    auth_token = config.twilio_auth_token
    twilio_number = config.twilio_number

    # Initialize the TemplateHandler
    template_handler = TemplateHandler()

    # Determine whether to send an email or SMS
    if '@' in receiver_contact:
        template_type = 'email'
    else:
        template_type = 'sms'

    try:
        # Fetch the rendered template based on the label and context
        rendered_template = template_handler.process_and_send_notification(template_label, template_type)

        if template_type == 'email':
            message = Mail(
                from_email=settings.DEFAULT_FROM_EMAIL,
                to_emails=receiver_contact,
                subject=template_handler.get_subject(template_label),
                html_content=markdown.markdown(rendered_template)
            )
            sg = SendGridAPIClient(apikey)
            response = sg.send(message)
            print("Email sent successfully:", response)
            return {'status': True, 'message': 'Email sent successfully'}
        else:
            # Initializing the Twilio client
            client = Client(account_sid, auth_token)

            # Sending the SMS
            message = client.messages.create(
                body=rendered_template,
                from_=twilio_number,
                to=receiver_contact
            )

            print("SMS sent successfully:", message.sid)
            return {'status': True, 'message': 'SMS sent successfully'}
    except Exception as e:
        print("Error sending notification:", str(e))
        return {'status': False, 'message': str(e)}
