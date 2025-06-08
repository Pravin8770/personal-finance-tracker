import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { transactions, categories } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import './Dashboard.css';

interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

interface CategorySummary {
  id: number;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0
  });
  const [topCategories, setTopCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // For demonstration purposes, just load transactions
        const allTransactions = await transactions.getAll();
        const allCategories = await categories.getAll();
        
        // Calculate summary
        const income = allTransactions
          .filter((t: any) => t.type === 'income')
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        
        const expenses = allTransactions
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        
        setSummary({
          totalIncome: income,
          totalExpenses: expenses,
          netBalance: income - expenses
        });
        
        // Process category data (simplified)
        const categoryMap = new Map<number, CategorySummary>();
        
        allTransactions
          .filter((t: any) => t.type === 'expense' && t.category_id)
          .forEach((t: any) => {
            if (!categoryMap.has(t.category_id)) {
              const category = allCategories.find((c: any) => c.id === t.category_id);
              categoryMap.set(t.category_id, {
                id: t.category_id,
                name: category ? category.name : 'Unknown',
                color: category ? category.color : '#888',
                amount: 0,
                percentage: 0
              });
            }
            
            const current = categoryMap.get(t.category_id);
            if (current) {
              current.amount += t.amount;
            }
          });
        
        // Calculate percentages
        if (expenses > 0) {
          categoryMap.forEach(category => {
            category.percentage = (category.amount / expenses) * 100;
          });
        }
        
        // Sort by amount and take top 5
        const categoryList = Array.from(categoryMap.values())
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);
          
        setTopCategories(categoryList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Financial Dashboard</h1>
      
      <div className="summary-cards">        <Card title="Income" className="summary-card income">
          <div className="amount">{formatCurrency(summary.totalIncome)}</div>
        </Card>
        
        <Card title="Expenses" className="summary-card expenses">
          <div className="amount">{formatCurrency(summary.totalExpenses)}</div>
        </Card>
        
        <Card title="Balance" className="summary-card balance">
          <div className="amount">{formatCurrency(summary.netBalance)}</div>
        </Card>
      </div>
      
      <div className="dashboard-section">
        <Card title="Top Expense Categories">
          {topCategories.length > 0 ? (
            <div className="category-list">
              {topCategories.map(category => (
                <div className="category-item" key={category.id}>
                  <div className="category-info">
                    <div className="category-name">
                      <span 
                        className="category-color" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                    <div className="category-amount">{formatCurrency(category.amount)}</div>
                  </div>
                  <div className="category-bar-container">
                    <div 
                      className="category-bar" 
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No expense data available.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
