from fastapi import FastAPI
from app.errors import reg_error_handlers
from app.routes.requests import router as requests_router


app = FastAPI()
reg_error_handlers(app)
app.include_router(requests_router)