from fastapi import Request
from fastapi.responses import JSONResponse
from backend.logging_config import logger

class AppException(Exception):
    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"{request.method} {request.url} - {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.message,
            "status_code": exc.status_code
        }
    )


def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"{request.method} {request.url} - Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "message": "Something went wrong",
            "status_code": 500
        }
    )