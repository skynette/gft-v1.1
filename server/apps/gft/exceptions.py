class TokenNotFoundException(Exception):
    """Exception raised for missing authentication token."""
    pass

class UnauthenticatedUserException(Exception):
    """Exception raised for unauthenticated users."""

    def __init__(self, message="Unauthenticated access"):
        self.message = message
        super().__init__(self.message)


class UnauthorizedUserException(Exception):
    """Exception raised for unauthorized users."""

    def __init__(self, message="Unauthorized access"):
        self.message = message
        super().__init__(self.message)
