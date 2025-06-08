from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = "#6c5ce7"

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
