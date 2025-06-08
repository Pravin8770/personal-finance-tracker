from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.budget import Budget
from app.schemas.budget import Budget as BudgetSchema, BudgetCreate
from app.api.auth import get_current_user
from datetime import date

router = APIRouter()

@router.post("/", response_model=BudgetSchema)
def create_budget(budget: BudgetCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_budget = Budget(
        amount=budget.amount,
        name=budget.name,
        period=budget.period,
        start_date=budget.start_date or date.today(),
        end_date=budget.end_date,
        category_id=budget.category_id,
        user_id=current_user.id
    )
    
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    
    return db_budget

@router.get("/", response_model=List[BudgetSchema])
def get_budgets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).offset(skip).limit(limit).all()
    return budgets

@router.get("/{budget_id}", response_model=BudgetSchema)
def get_budget(budget_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    return budget

@router.put("/{budget_id}", response_model=BudgetSchema)
def update_budget(
    budget_id: int, 
    budget_data: BudgetCreate,
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    # Update budget attributes
    for key, value in budget_data.dict().items():
        setattr(budget, key, value)
    
    db.commit()
    db.refresh(budget)
    
    return budget

@router.delete("/{budget_id}")
def delete_budget(budget_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    db.delete(budget)
    db.commit()
    
    return {"message": "Budget deleted successfully"}
