import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { budgets, categories } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import './Budgets.css';

interface Budget {
  id: number;
  category_id: number;
  amount: number;
  start_date: string;
  end_date: string;
  spent?: number;
  remaining?: number;
  percentage?: number;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

const Budgets: React.FC = () => {
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    start_date: new Date().toISOString().split('T')[0], // Today's date
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0] // Next month
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch budgets and categories
        const [budgetsData, categoriesData] = await Promise.all([
          budgets.getAll(),
          categories.getAll()
        ]);

        // Process budget data with spending information
        const processedBudgets = budgetsData.map((budget: Budget) => {
          // In a real app, you would calculate the actual spent amount
          // For demo purposes, we'll generate a random spent amount
          const spent = Math.random() * budget.amount;
          const remaining = budget.amount - spent;
          const percentage = (spent / budget.amount) * 100;

          return {
            ...budget,
            spent,
            remaining,
            percentage
          };
        });

        setBudgetList(processedBudgets);
        setCategoryList(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load budgets');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newBudget = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id)
      };

      const result = await budgets.create(newBudget);

      // Add placeholder metrics for demo
      const spent = 0;
      const remaining = result.amount;
      const percentage = 0;

      // Update the list with the new budget
      setBudgetList([
        {
          ...result,
          spent,
          remaining,
          percentage
        },
        ...budgetList
      ]);

      // Reset form
      setFormData({
        category_id: '',
        amount: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      });

      setShowForm(false);
    } catch (err) {
      console.error('Error creating budget:', err);
      setError('Failed to create budget');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgets.delete(id);
        setBudgetList(budgetList.filter(budget => budget.id !== id));
      } catch (err) {
        console.error('Error deleting budget:', err);
        setError('Failed to delete budget');
      }
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categoryList.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getCategoryColor = (categoryId: number) => {
    const category = categoryList.find(cat => cat.id === categoryId);
    return category ? category.color : '#888';
  };  // Using the shared formatCurrency utility function

  if (loading) {
    return (
      <div className="budgets-page">
        <h1>Budgets</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="budgets-page">
        <h1>Budgets</h1>
        <p className="error-message">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="budgets-page">
      <div className="budgets-header">
        <h1>Budgets</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Budget'}
        </Button>
      </div>

      {showForm && (
        <Card className="budget-form-card">
          <form onSubmit={handleSubmit} className="budget-form">
            <div className="form-group">
              <label htmlFor="category_id">Category</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Budget Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit">Save Budget</Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {budgetList.length === 0 ? (
        <Card>
          <div className="no-budgets">
            <p>No budgets found. Create one to get started!</p>
          </div>
        </Card>
      ) : (
        <div className="budgets-list">
          {budgetList.map((budget) => (
            <Card key={budget.id} className="budget-card">
              <div className="budget-header">
                <div 
                  className="budget-category" 
                  style={{ backgroundColor: getCategoryColor(budget.category_id) }}
                >
                  {getCategoryName(budget.category_id)}
                </div>
                <div className="budget-actions">
                  <button 
                    className="icon-button" 
                    onClick={() => handleDelete(budget.id)}
                    aria-label="Delete budget"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="budget-details">
                <div className="budget-amount">
                  <span>Total Budget</span>
                  <span className="value">{formatCurrency(budget.amount)}</span>
                </div>                <div className="budget-period">
                  <span>{formatDate(budget.start_date)} - {formatDate(budget.end_date)}</span>
                </div>
              </div>
              
              <div className="budget-progress-container">
                <div className="budget-metrics">
                  <div className="metric">
                    <span className="label">Spent</span>
                    <span className="value">{formatCurrency(budget.spent || 0)}</span>
                  </div>
                  <div className="metric">
                    <span className="label">Remaining</span>
                    <span className="value">{formatCurrency(budget.remaining || 0)}</span>
                  </div>
                </div>
                
                <div className="progress-wrapper">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.min(budget.percentage || 0, 100)}%`,
                      backgroundColor: 
                        budget.percentage && budget.percentage > 90 ? '#ef4444' : 
                        budget.percentage && budget.percentage > 70 ? '#f59e0b' : 
                        '#22c55e'
                    }}
                  />
                </div>
                <div className="progress-label">
                  {budget.percentage ? Math.round(budget.percentage) : 0}% spent
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Budgets;
