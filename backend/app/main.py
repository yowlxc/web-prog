from fastapi import FastAPI
from app.errors import register_error_handlers
from app.routes.requests import router as requests_router


app = FastAPI()
register_error_handlers(app)
app.include_router(requests_router)