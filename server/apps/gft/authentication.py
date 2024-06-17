from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from apps.gft.models import CompanyApiKey
from rest_framework.authtoken.models import Token


class APIKeyAuthentication(BaseAuthentication):
    """Custom Authentication for Company API Key

    Authenticate API requests using the 'GFT-API-KEY' header.

    Usage:
    - Include 'GFT-API-KEY' in request headers for authentication.
    - Raises AuthenticationFailed if the API key is missing or invalid.

    Example:
    GET /api/some-endpoint/
    Headers:
        GFT-API-KEY: your_valid_api_key_here
    """

    keyword = 'GFT-API-KEY'

    def authenticate(self, request):
        """Authenticate the API request based on the presence of a valid API key in the headers.

        Args:
            request (HttpRequest): The incoming HTTP request.

        Returns:
            Tuple (user, api_key_obj): A tuple containing the user associated with the API key and the API key object.
            If authentication fails, it raises AuthenticationFailed exception.

        Raises:
            AuthenticationFailed: If the API key is missing or invalid.
        """
        if request.headers.get("Internal-Request", False):
            # get user from auth token instead
            user = Token.objects.get(key=request.headers.get("Authorization").split(" ")[1]).user
            request.user = user
            return (user, None)
        
        api_key = request.headers.get(self.keyword)
        if not api_key:
            raise AuthenticationFailed('API key is missing in the headers.')

        try:
            api_key_obj = CompanyApiKey.objects.get(key=api_key)
            
            if api_key_obj.num_of_requests_made >= api_key_obj.max_requests and api_key_obj.company.owner.is_superuser == False:
                raise AuthenticationFailed('API key has exceeded the number of requests allowed.')
            
            api_key_obj.num_of_requests_made += 1
            api_key_obj.save()
            
            if api_key_obj.company.owner.is_superuser == True:
                return (api_key_obj.company.owner, api_key_obj)

        except CompanyApiKey.DoesNotExist:
            raise AuthenticationFailed('Invalid API key.')

        return (api_key_obj.company.owner, api_key_obj)

    def authenticate_header(self, request):
        """Return the keyword to be used in the 'WWW-Authenticate' header.

        Args:
            request (HttpRequest): The incoming HTTP request.

        Returns:
            str: The keyword used to specify the API key in the 'WWW-Authenticate' header.
        """
        return self.keyword
