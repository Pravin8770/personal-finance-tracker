from pydantic import BaseModel
from typing import Optional
import datetime

class TransactionBase(BaseModel):
    amount: float
    description: Optional[str] = None
    date: Optional[datetime.date] = None
    type: str  # income or expense
    category_id: Optional[int] = None
    currency: Optional[str] = "INR"

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
