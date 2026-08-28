from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    error: Optional[ErrorDetail] = None

    @classmethod
    def ok(cls, data: Any = None, message: Optional[str] = None) -> "ApiResponse[T]":
        return cls(success=True, data=data, message=message, error=None)

    @classmethod
    def fail(cls, code: str, message: str, details: Optional[Any] = None) -> "ApiResponse[T]":
        return cls(
            success=False,
            data=None,
            message=message,
            error=ErrorDetail(code=code, message=message, details=details),
        )
