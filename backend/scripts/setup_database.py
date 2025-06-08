"""
Database migration script - Set up the initial database schema

This script sets up the initial database schema for the Personal Finance Tracker.
It creates tables and adds some initial data.
"""
import os
import sys
from pathlib import Path

# Add the parent directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.database import Base
from app.models.user import User
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.budget import Budget
from passlib.context import CryptContext

# Set up database connection
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/finance_tracker.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Set up password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_database():
    """Create all tables in the database"""
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

def seed_initial_data():
    """Seed the database with initial data"""
    db = SessionLocal()
    try:
        # Create demo user
        if not db.query(User).filter(User.email == "demo@example.com").first():
            demo_user = User(
                email="demo@example.com",
                hashed_password=pwd_context.hash("password123"),
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            print("✅ Demo user created")

            # Create default categories
            default_categories = [
                {"name": "Housing", "color": "#4a6cf7", "user_id": demo_user.id},
                {"name": "Transportation", "color": "#f59e0b", "user_id": demo_user.id},
                {"name": "Food", "color": "#10b981", "user_id": demo_user.id},
                {"name": "Utilities", "color": "#6366f1", "user_id": demo_user.id},
                {"name": "Entertainment", "color": "#ec4899", "user_id": demo_user.id},
                {"name": "Health", "color": "#ef4444", "user_id": demo_user.id},
                {"name": "Shopping", "color": "#8b5cf6", "user_id": demo_user.id},
                {"name": "Personal Care", "color": "#14b8a6", "user_id": demo_user.id},
                {"name": "Education", "color": "#f97316", "user_id": demo_user.id},
                {"name": "Salary", "color": "#22c55e", "user_id": demo_user.id},
                {"name": "Investments", "color": "#64748b", "user_id": demo_user.id},
                {"name": "Gifts", "color": "#a855f7", "user_id": demo_user.id},
            ]

            for cat_data in default_categories:
                category = Category(**cat_data)
                db.add(category)
            
            db.commit()
            print("✅ Default categories created")

            # Add sample transactions
            categories = db.query(Category).filter(Category.user_id == demo_user.id).all()
            cat_dict = {cat.name: cat for cat in categories}

            sample_transactions = [
                {
                    "amount": 1200.00,
                    "description": "Monthly rent",
                    "date": "2025-06-01",
                    "type": "expense",
                    "category_id": cat_dict["Housing"].id,
                    "user_id": demo_user.id,
                },
                {
                    "amount": 3500.00,
                    "description": "Salary",
                    "date": "2025-06-05",
                    "type": "income",
                    "category_id": cat_dict["Salary"].id,
                    "user_id": demo_user.id,
                },
                {
                    "amount": 85.75,
                    "description": "Grocery shopping",
                    "date": "2025-06-07",
                    "type": "expense",
                    "category_id": cat_dict["Food"].id,
                    "user_id": demo_user.id,
                },
                {
                    "amount": 45.00,
                    "description": "Gas",
                    "date": "2025-06-06",
                    "type": "expense",
                    "category_id": cat_dict["Transportation"].id,
                    "user_id": demo_user.id,
                },
                {
                    "amount": 120.50,
                    "description": "Electric bill",
                    "date": "2025-06-03",
                    "type": "expense",
                    "category_id": cat_dict["Utilities"].id,
                    "user_id": demo_user.id,
                },
                {
                    "amount": 200.00,
                    "description": "Investment deposit",
                    "date": "2025-06-04",
                    "type": "expense",
                    "category_id": cat_dict["Investments"].id,
                    "user_id": demo_user.id,
                },
                {
                    "amount": 35.99,
                    "description": "Streaming services",
                    "date": "2025-06-02",
                    "type": "expense",
                    "category_id": cat_dict["Entertainment"].id,
                    "user_id": demo_user.id,
                },
            ]

            for tx_data in sample_transactions:
                transaction = Transaction(**tx_data)
                db.add(transaction)
            
            db.commit()
            print("✅ Sample transactions created")

            # Add sample budgets
            sample_budgets = [
                {
                    "category_id": cat_dict["Housing"].id,
                    "amount": 1300.00,
                    "start_date": "2025-06-01",
                    "end_date": "2025-06-30",
                    "user_id": demo_user.id,
                },
                {
                    "category_id": cat_dict["Food"].id,
                    "amount": 400.00,
                    "start_date": "2025-06-01",
                    "end_date": "2025-06-30",
                    "user_id": demo_user.id,
                },
                {
                    "category_id": cat_dict["Transportation"].id,
                    "amount": 200.00,
                    "start_date": "2025-06-01",
                    "end_date": "2025-06-30",
                    "user_id": demo_user.id,
                },
                {
                    "category_id": cat_dict["Entertainment"].id,
                    "amount": 150.00,
                    "start_date": "2025-06-01",
                    "end_date": "2025-06-30",
                    "user_id": demo_user.id,
                },
            ]

            for budget_data in sample_budgets:
                budget = Budget(**budget_data)
                db.add(budget)
            
            db.commit()
            print("✅ Sample budgets created")

        else:
            print("ℹ️ Demo user already exists, skipping seeding")

    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


def main():
    """Run migrations"""
    # Create data directory if it doesn't exist
    os.makedirs("./data", exist_ok=True)
    
    # Run migrations
    create_database()
    seed_initial_data()
    
    print("✅ Migration completed successfully")


if __name__ == "__main__":
    main()
