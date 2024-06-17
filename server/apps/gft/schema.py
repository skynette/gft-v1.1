from drf_spectacular.extensions import OpenApiAuthenticationExtension

class APIKeyAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = 'apps.gft.authentication.APIKeyAuthentication'
    name = 'APIKeyAuthentication'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'apiKey',
            'in': 'header',
            'name': 'gft-api-key',
            'description': 'Token-based authentication with required prefix "%s"' % "gft-api-key"
        }