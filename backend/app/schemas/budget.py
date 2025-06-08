from pydantic import BaseModel
from typing import Optional
from datetime import date

class BudgetBase(BaseModel):
    amount: float
    name: str
    period: str  # monthly, weekly, yearly
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    category_id: int

class BudgetCreate(BudgetBase):
    pass

class Budget(BudgetBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
