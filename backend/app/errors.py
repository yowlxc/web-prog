from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class DuplicateIsuError(Exception):
    def __init__(self, isu: str):
        self.isu = isu
        super().__init__(f"Студент с ИСУ {isu} уже существует")

def error_response(status_code: int, code: str, message: str, details = None ):
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "details": details
            }
        }
    )

def validation_details(errors):
    return [
        {
            "field": list(error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        }
        for error in errors
    ]

def reg_error_handlers(app: FastAPI):

    @app.exception_handler(StarletteHTTPException)
    async def http_error(request: Request, exc: StarletteHTTPException):
        codes = {
            400: "BAD_REQUEST",
            404: "NOT_FOUND",
            422: "VALIDATION_ERROR",
        }

        return error_response(
            exc.status_code,
            codes.get(exc.status_code, f"HTTP_{exc.status_code}"),
            str(exc.detail)
        )
    
    @app.exception_handler(RequestValidationError)
    async def request_validation_error(request: Request, exc: RequestValidationError):
        return error_response(
            422,
            "VALIDATION_ERROR",
            "Некорректные данные запроса",
            validation_details(exc.errors()),
        )
    
    @app.exception_handler(DuplicateIsuError)
    async def duplicate_isu_error(request: Request, exc: DuplicateIsuError):
        return error_response(
            409,
            "DUPLICATE_ISU",
            str(exc)
        )
    
    @app.exception_handler(Exception)
    async def unexpected_error(request: Request, exc: Exception):
        return error_response(
            500, 
            "INTERNAL_ERROR",
            "Внутренняя ошибка программы"
        )
    

    