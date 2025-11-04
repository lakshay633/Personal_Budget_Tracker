import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

# Configure a logger for error tracking
logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Global custom exception handler for Django REST Framework.
    Ensures all errors return consistent JSON responses and logs unexpected ones.
    """

    # Let DRF handle the known exceptions first (ValidationError, AuthenticationFailed, etc.)
    response = exception_handler(exc, context)

    if response is not None:
        # Optionally standardize known errors into a consistent format
        return Response(
            {
                "status_code": response.status_code,
                "error": response.data,
                "path": context["request"].path,
            },
            status=response.status_code,
        )

    # Log unhandled exceptions for debugging (without exposing sensitive details)
    view = context.get("view", None)
    view_name = view.__class__.__name__ if view else "UnknownView"
    logger.exception(f"Unhandled exception in {view_name}: {exc}")

    # Handle unknown or server-side errors
    return Response(
        {
            "status_code": 500,
            "error": "Internal server error",
            "path": context["request"].path,
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
