# Personal Finance Tracker

A full-stack web application for tracking personal finances, built with FastAPI (Python) and React (TypeScript).

## Features

- **User Authentication**: Secure login and registration system
- **Transaction Management**: Track income and expenses with categorization
- **Budget Management**: Set and monitor budgets by category
- **Dashboard**: Visualize your financial data with charts and summaries
- **Categories**: Organize transactions with customizable categories
- **INR Currency Support**: Fully supports Indian Rupee (₹) for all transactions and budgets

## Tech Stack

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database (for simplicity)
- JWT Authentication

### Frontend
- React
- TypeScript
- React Router
- Chart.js for data visualization
- CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.9+)
- Docker & Docker Compose (optional, for deployment)

### Running the Application Locally

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd personal-finance-tracker/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```powershell
     .\venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create the database and seed with initial data:
   ```bash
   python scripts/setup_database.py
   ```

6. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd personal-finance-tracker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

### Running with Docker

1. Build and run the Docker containers:
   ```bash
   docker-compose up -d
   ```

2. Open http://localhost:3000 in your browser

3. To stop the containers:
   ```bash
   docker-compose down
   ```

## Demo Account

The application is seeded with a demo account:
- Email: demo@example.com
- Password: password123

## API Documentation

When the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
personal-finance-tracker/
├── backend/                 # FastAPI backend
│   ├── app/                 # Application package
│   │   ├── api/             # API endpoints
│   │   ├── db/              # Database configuration
│   │   ├── models/          # SQLAlchemy models
│   │   └── schemas/         # Pydantic schemas
│   ├── scripts/             # Utility scripts
│   ├── main.py              # Entry point
│   └── requirements.txt     # Python dependencies
├── frontend/                # React frontend
│   ├── public/              # Static assets
│   ├── src/                 # Source files
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── package.json         # Node.js dependencies
│   └── tsconfig.json        # TypeScript configuration
└── docker-compose.yml       # Docker Compose configuration
```

## License

MIT
