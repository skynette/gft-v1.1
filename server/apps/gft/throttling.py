from rest_framework.throttling import UserRateThrottle
from django.contrib.auth import get_user_model

from helpers.utils import validate_phone

User = get_user_model()

class EmailCheckThrottle(UserRateThrottle):
    scope='email_check'

class UsernameCheckThrottle(UserRateThrottle):
    scope='username_check'

class OTPCheckThrottle(UserRateThrottle):
    scope='otp_check'

class PhoneCheckThrottle(UserRateThrottle):
    scope = 'phone_check'

    def allow_request(self, request, view):
        if request.method == 'GET':
            serializer = view.serializer_class(data=request.GET)
            if serializer.is_valid():
                mobile = serializer.validated_data.get('phone').replace(' ', '')
                mobile = f'+{mobile}'
                exists = User.objects.filter(mobile=mobile).exists()
                if exists:
                    return True
        return super().allow_request(request, view)

class VerifyPhoneCheckThrottle(UserRateThrottle):
    scope = 'verify_phone_check'

    def allow_request(self, request, view):
        if request.method == 'GET':
            serializer = view.serializer_class(data=request.GET)
            if serializer.is_valid():
                phone = serializer.validated_data.get('phone')
                validated_phone = validate_phone(phone)
                if validated_phone:
                    return True
        return super().allow_request(request, view)
