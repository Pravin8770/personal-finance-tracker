# Personal Finance Tracker

A full-stack web application for tracking personal finances, built with FastAPI (Python) and React (TypeScript). The application provides a comprehensive solution for managing personal finances with user authentication, transaction tracking, budget management, and data visualization.

## 🎯 What This Project Does

This Personal Finance Tracker helps users:
- **Track Expenses & Income**: Log all financial transactions with detailed categorization
- **Budget Management**: Set monthly/yearly budgets and monitor spending against them
- **Financial Analytics**: View spending patterns with charts and visual summaries
- **Category Organization**: Organize transactions into customizable categories (Food, Transport, Entertainment, etc.)
- **Secure Access**: Multi-user support with secure authentication and data isolation
- **Real-time Updates**: Live dashboard updates with current financial status

## ✨ Features

- **🔐 User Authentication**: Secure JWT-based login and registration system
- **💰 Transaction Management**: Track income and expenses with detailed categorization
- **📊 Budget Management**: Set and monitor budgets by category with progress tracking
- **📈 Interactive Dashboard**: Visualize financial data with charts and summaries
- **🏷️ Smart Categories**: Organize transactions with customizable categories
- **💱 INR Currency Support**: Fully supports Indian Rupee (₹) for all transactions and budgets
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔄 Real-time Updates**: Live updates without page refreshes

## 🛠️ Tech Stack

### Backend
- **FastAPI** (Python) - Modern, fast web framework for building APIs
- **SQLAlchemy ORM** - Python SQL toolkit and Object-Relational Mapping
- **SQLite** - Lightweight database (perfect for single-user deployments)
- **JWT Authentication** - Secure token-based authentication
- **Pydantic** - Data validation using Python type annotations

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript for better development experience
- **React Router** - Declarative routing for React applications
- **Chart.js** - Flexible JavaScript charting library for data visualization
- **CSS3** - Modern styling with responsive design

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization for easy deployment
- **Nginx** - Web server for serving the React frontend
- **GitHub Actions** - CI/CD pipeline (configured for deployment)

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v16+ recommended) - [Download here](https://nodejs.org/)
- **Python** (v3.9+ required) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Docker & Docker Compose** (optional, for containerized deployment) - [Download here](https://docker.com/)

### 🏃‍♂️ Quick Start (Recommended)

#### Option 1: Using Docker (Easiest)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd personal-finance-tracker
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

#### Option 2: Manual Setup (For Development)

### 🔧 Running the Application Locally

#### 🐍 Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd personal-finance-tracker/backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt):**
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize the database:**
   ```bash
   python scripts/setup_database.py
   ```

6. **Start the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   ✅ Backend will be running at: http://localhost:8000

#### ⚛️ Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd personal-finance-tracker/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   
   ✅ Frontend will be running at: http://localhost:3000

### 🎮 Using the Application

1. **Open your browser** and go to http://localhost:3000
2. **Register a new account** or use the demo account:
   - Email: `demo@example.com`
   - Password: `password123`
3. **Start tracking your finances!**

## 🚢 Deployment

### Cloud VM Deployment

The application is configured for deployment on cloud VMs. We have deployment scripts for:

1. **Automated Deployment Script** (`deploy-vm.ps1` / `deploy-vm.sh`)
2. **Environment Configuration** (supports environment variables)
3. **Production Docker Setup** (optimized for production use)

### Environment Variables

Create a `.env` file in the root directory for custom configuration:

```env
# Backend Configuration
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./data/finance_tracker.db
ORIGINS=*

# Frontend Configuration  
REACT_APP_API_URL=http://your-vm-ip:8000/api
```

## 📚 API Documentation

When the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📁 Project Structure

```
personal-finance-tracker/
├── 📁 backend/                     # FastAPI Backend Application
│   ├── 📁 app/                     # Main application package
│   │   ├── 📁 api/                 # API endpoint handlers
│   │   │   ├── auth.py             # Authentication endpoints
│   │   │   ├── transactions.py     # Transaction CRUD operations
│   │   │   ├── budgets.py          # Budget management
│   │   │   ├── categories.py       # Category management
│   │   │   └── health.py           # Health check endpoint
│   │   ├── 📁 db/                  # Database configuration
│   │   │   └── database.py         # SQLAlchemy setup
│   │   ├── 📁 models/              # SQLAlchemy ORM models
│   │   │   ├── user.py             # User model
│   │   │   ├── transaction.py      # Transaction model
│   │   │   ├── category.py         # Category model
│   │   │   └── budget.py           # Budget model
│   │   └── 📁 schemas/             # Pydantic schemas for validation
│   │       ├── user.py             # User schemas
│   │       ├── transaction.py      # Transaction schemas
│   │       ├── category.py         # Category schemas
│   │       └── budget.py           # Budget schemas
│   ├── 📁 scripts/                 # Utility scripts
│   │   └── setup_database.py       # Database initialization
│   ├── 📄 main.py                  # FastAPI application entry point
│   ├── 📄 requirements.txt         # Python dependencies
│   └── 📄 Dockerfile               # Backend container configuration
├── 📁 frontend/                    # React Frontend Application
│   ├── 📁 public/                  # Static assets
│   │   ├── index.html              # Main HTML template
│   │   └── manifest.json           # PWA manifest
│   ├── 📁 src/                     # Source code
│   │   ├── 📁 components/          # Reusable React components
│   │   │   ├── 📁 layout/          # Layout components (Header, Sidebar)
│   │   │   └── 📁 ui/              # UI components (Button, Card)
│   │   ├── 📁 context/             # React Context providers
│   │   │   └── AuthContext.tsx     # Authentication context
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── Dashboard.tsx       # Main dashboard
│   │   │   ├── Transactions.tsx    # Transaction management
│   │   │   ├── Budgets.tsx         # Budget management
│   │   │   ├── Login.tsx           # Login page
│   │   │   └── Register.tsx        # Registration page
│   │   ├── 📁 services/            # API service functions
│   │   │   └── api.ts              # HTTP client setup
│   │   └── 📁 utils/               # Utility functions
│   │       └── formatters.ts       # Data formatting helpers
│   ├── 📄 package.json             # Node.js dependencies
│   ├── 📄 tsconfig.json            # TypeScript configuration
│   └── 📄 Dockerfile               # Frontend container configuration
├── 📄 docker-compose.yml           # Docker Compose configuration
├── 📄 deploy-vm.ps1                # Windows deployment script
├── 📄 deploy-vm.sh                 # Linux/macOS deployment script
└── 📄 README.md                    # This file
```

## 🛠️ Development & Testing

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests  
cd frontend
npm test
```

### Development Scripts

We've included helpful PowerShell scripts for Windows development:

- `run_backend.ps1` - Start the backend server
- `run_frontend.ps1` - Start the frontend development server
- `run_tests.ps1` - Run all tests

### Code Quality

- **Backend**: Uses FastAPI's automatic validation and OpenAPI documentation
- **Frontend**: TypeScript for type safety and better development experience
- **Linting**: ESLint and Prettier for consistent code formatting

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process using port 8000 (backend)
   npx kill-port 8000
   
   # Kill process using port 3000 (frontend)  
   npx kill-port 3000
   ```

2. **Database Issues**
   ```bash
   # Recreate the database
   cd backend
   python scripts/setup_database.py
   ```

3. **Docker Issues**
   ```bash
   # Clean up Docker containers and images
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- React team for the amazing frontend library
- Chart.js for beautiful data visualizations
- SQLAlchemy for robust ORM functionality
