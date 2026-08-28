from typing import Any, Optional
from fastapi import status


class AppException(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Any] = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class NotFoundException(AppException):
    def __init__(self, resource: str, identifier: Any = None):
        msg = f"{resource} not found" if not identifier else f"{resource} with ID '{identifier}' not found"
        super().__init__(
            code="RESOURCE_NOT_FOUND",
            message=msg,
            status_code=status.HTTP_404_NOT_FOUND,
        )


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Invalid authentication credentials"):
        super().__init__(
            code="UNAUTHORIZED",
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class ForbiddenException(AppException):
    def __init__(self, message: str = "You do not have permission to access this resource"):
        super().__init__(
            code="FORBIDDEN",
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
        )


class BadRequestException(AppException):
    def __init__(self, message: str, code: str = "BAD_REQUEST", details: Optional[Any] = None):
        super().__init__(
            code=code,
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details,
        )


class ConflictException(AppException):
    def __init__(self, message: str, code: str = "CONFLICT"):
        super().__init__(
            code=code,
            message=message,
            status_code=status.HTTP_409_CONFLICT,
        )


class InsufficientStockException(AppException):
    def __init__(self, product_name: str, available: int, requested: int):
        super().__init__(
            code="INSUFFICIENT_STOCK",
            message=f"Insufficient stock for '{product_name}'. Requested {requested}, only {available} available.",
            status_code=status.HTTP_400_BAD_REQUEST,
            details={"product_name": product_name, "available": available, "requested": requested},
        )


class InvalidStateTransitionException(AppException):
    def __init__(self, from_state: str, to_state: str):
        super().__init__(
            code="INVALID_STATE_TRANSITION",
            message=f"Cannot transition status from '{from_state}' to '{to_state}'.",
            status_code=status.HTTP_400_BAD_REQUEST,
        )
