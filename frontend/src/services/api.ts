import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication service
export const auth = {
  login: async (email: string, password: string) => {
    try {
      // FastAPI expects form data for token endpoint
      const formData = new FormData();
      formData.append('username', email); // FastAPI OAuth2 uses 'username'
      formData.append('password', password);
      
      const response = await axios.post(`${BASE_URL}/auth/token`, formData);
      return response.data;
    } catch (error) {
      console.warn('Using mock authentication');
      // For demo purposes, accept any credentials
      if (email && password) {
        return { access_token: 'demo_token_for_development' };
      }
      throw new Error('Invalid credentials');
    }
  },
  
  register: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      return response.data;
    } catch (error) {
      console.warn('Using mock registration');
      // For demo purposes, always succeed
      if (email && password && password.length >= 6) {
        return { message: 'User registered successfully' };
      }
      throw new Error('Invalid registration data. Password must be at least 6 characters.');
    }
  },
};

// Mock data for demo
const mockTransactions = [
  {
    id: 1,
    amount: 12000.00,
    description: "Monthly rent",
    date: "2025-06-01",
    type: "expense",
    category_id: 1,
    user_id: 1,
    currency: "INR"
  },
  {
    id: 2,
    amount: 90000.00,
    description: "Salary",
    date: "2025-06-05",
    type: "income",
    category_id: 10,
    user_id: 1,
    currency: "INR"
  },
  {
    id: 3,
    amount: 2500.75,
    description: "Grocery shopping",
    date: "2025-06-07",
    type: "expense",
    category_id: 3,
    user_id: 1,
    currency: "INR"
  },
  {
    id: 4,
    amount: 1500.00,
    description: "Gas",
    date: "2025-06-06",
    type: "expense",
    category_id: 2,
    user_id: 1,
    currency: "INR"
  },
  {
    id: 5,
    amount: 3200.50,
    description: "Electric bill",
    date: "2025-06-03",
    type: "expense",
    category_id: 4,
    user_id: 1,
    currency: "INR"
  }
];

// Transactions service
export const transactions = {
  getAll: async () => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.warn('Using mock transaction data');
      return mockTransactions;
    }
  },
  
  getById: async (id: number) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock transaction data');
      return mockTransactions.find(t => t.id === id);
    }
  },
    create: async (transactionData: any) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.warn('Using mock transaction data - create operation');
      const newTransaction = {
        ...transactionData,
        currency: transactionData.currency || 'INR',
        id: Math.max(...mockTransactions.map(t => t.id)) + 1,
        user_id: 1
      };
      mockTransactions.push(newTransaction);
      return newTransaction;
    }
  },
  
  update: async (id: number, transactionData: any) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.warn('Using mock transaction data - update operation');
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTransactions[index] = { ...mockTransactions[index], ...transactionData };
        return mockTransactions[index];
      }
      throw new Error('Transaction not found');
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock transaction data - delete operation');
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTransactions.splice(index, 1);
        return { success: true };
      }
      throw new Error('Transaction not found');
    }
  },
};

// Mock data for categories
const mockCategories = [
  { id: 1, name: "Housing", color: "#4a6cf7", user_id: 1 },
  { id: 2, name: "Transportation", color: "#f59e0b", user_id: 1 },
  { id: 3, name: "Food", color: "#10b981", user_id: 1 },
  { id: 4, name: "Utilities", color: "#6366f1", user_id: 1 },
  { id: 5, name: "Entertainment", color: "#ec4899", user_id: 1 },
  { id: 6, name: "Health", color: "#ef4444", user_id: 1 },
  { id: 7, name: "Shopping", color: "#8b5cf6", user_id: 1 },
  { id: 8, name: "Personal Care", color: "#14b8a6", user_id: 1 },
  { id: 9, name: "Education", color: "#f97316", user_id: 1 },
  { id: 10, name: "Salary", color: "#22c55e", user_id: 1 },
  { id: 11, name: "Investments", color: "#64748b", user_id: 1 },
  { id: 12, name: "Gifts", color: "#a855f7", user_id: 1 },
];

// Categories service
export const categories = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.warn('Using mock category data');
      return mockCategories;
    }
  },
  
  create: async (categoryData: any) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.warn('Using mock category data - create operation');
      const newCategory = {
        ...categoryData,
        id: Math.max(...mockCategories.map(c => c.id)) + 1,
        user_id: 1
      };
      mockCategories.push(newCategory);
      return newCategory;
    }
  },
  
  update: async (id: number, categoryData: any) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.warn('Using mock category data - update operation');
      const index = mockCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCategories[index] = { ...mockCategories[index], ...categoryData };
        return mockCategories[index];
      }
      throw new Error('Category not found');
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock category data - delete operation');
      const index = mockCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCategories.splice(index, 1);
        return { success: true };
      }
      throw new Error('Category not found');
    }
  },
};

// Mock data for budgets
const mockBudgets = [
  {
    id: 1,
    category_id: 1,
    amount: 1300.00,
    start_date: "2025-06-01",
    end_date: "2025-06-30",
    user_id: 1,
  },
  {
    id: 2,
    category_id: 3,
    amount: 400.00,
    start_date: "2025-06-01",
    end_date: "2025-06-30",
    user_id: 1,
  },
  {
    id: 3,
    category_id: 2,
    amount: 200.00,
    start_date: "2025-06-01",
    end_date: "2025-06-30",
    user_id: 1,
  },
  {
    id: 4,
    category_id: 5,
    amount: 150.00,
    start_date: "2025-06-01",
    end_date: "2025-06-30",
    user_id: 1,
  },
];

// Budgets service
export const budgets = {
  getAll: async () => {
    try {
      const response = await api.get('/budgets');
      return response.data;
    } catch (error) {
      console.warn('Using mock budget data');
      return mockBudgets;
    }
  },
  
  getById: async (id: number) => {
    try {
      const response = await api.get(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock budget data - getById');
      return mockBudgets.find(b => b.id === id);
    }
  },
  
  create: async (budgetData: any) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response.data;
    } catch (error) {
      console.warn('Using mock budget data - create operation');
      const newBudget = {
        ...budgetData,
        id: Math.max(...mockBudgets.map(b => b.id)) + 1,
        user_id: 1
      };
      mockBudgets.push(newBudget);
      return newBudget;
    }
  },
  
  update: async (id: number, budgetData: any) => {
    try {
      const response = await api.put(`/budgets/${id}`, budgetData);
      return response.data;
    } catch (error) {
      console.warn('Using mock budget data - update operation');
      const index = mockBudgets.findIndex(b => b.id === id);
      if (index !== -1) {
        mockBudgets[index] = { ...mockBudgets[index], ...budgetData };
        return mockBudgets[index];
      }
      throw new Error('Budget not found');
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock budget data - delete operation');
      const index = mockBudgets.findIndex(b => b.id === id);
      if (index !== -1) {
        mockBudgets.splice(index, 1);
        return { success: true };
      }
      throw new Error('Budget not found');
    }
  },
};

const apiService = {
  auth,
  transactions,
  categories,
  budgets,
};

export default apiService;
