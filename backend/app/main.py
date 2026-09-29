from fastapi import FastAPI
from app.routes.requests import router as requests_router


app = FastAPI()
app.include_router(requests_router)