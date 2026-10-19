from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.errors import reg_error_handlers
from app.routes.requests import router as requests_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

reg_error_handlers(app)
app.include_router(requests_router)