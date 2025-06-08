from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import create_db_and_tables

# Import routers
from app.api.auth import router as auth_router
from app.api.transactions import router as transactions_router
from app.api.categories import router as categories_router
from app.api.budgets import router as budgets_router
from app.api.health import router as health_router

app = FastAPI(title="Personal Finance Tracker")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(transactions_router, prefix="/api/transactions", tags=["transactions"])
app.include_router(categories_router, prefix="/api/categories", tags=["categories"])
app.include_router(budgets_router, prefix="/api/budgets", tags=["budgets"])
app.include_router(health_router, prefix="/api", tags=["health"])

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Personal Finance Tracker API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
