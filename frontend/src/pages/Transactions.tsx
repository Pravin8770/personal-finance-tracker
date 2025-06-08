import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { transactions, categories } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import './Transactions.css';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category_id: number;
  currency?: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

const Transactions: React.FC = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState<boolean>(false);  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    type: 'expense',
    category_id: '',
    currency: 'INR'
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch transactions and categories
        const [transactionsData, categoriesData] = await Promise.all([
          transactions.getAll(),
          categories.getAll()
        ]);
        
        setTransactionList(transactionsData);
        setCategoryList(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load transactions');
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
      const newTransaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      };
      
      const result = await transactions.create(newTransaction);
      
      // Update the list with the new transaction
      setTransactionList([result, ...transactionList]);
        // Reset form
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category_id: '',
        currency: 'INR'
      });
      
      setShowForm(false);
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError('Failed to create transaction');
    }
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactions.delete(id);
        setTransactionList(transactionList.filter(t => t.id !== id));
      } catch (err) {
        console.error('Error deleting transaction:', err);
        setError('Failed to delete transaction');
      }
    }
  };
  
  const getCategoryName = (categoryId: number) => {
    const category = categoryList.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  const getCategoryColor = (categoryId: number) => {
    const category = categoryList.find(c => c.id === categoryId);
    return category ? category.color : '#ccc';
  };
  
  if (loading) {
    return <div>Loading transactions...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Transaction'}
        </Button>
      </div>
      
      {showForm && (
        <Card title="New Transaction">
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Category --</option>
                  {categoryList.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <Button type="submit">Save Transaction</Button>
            </div>
          </form>
        </Card>
      )}
      
      <Card>
        {transactionList.length > 0 ? (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactionList.map(transaction => (
                <tr key={transaction.id} className={transaction.type}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>
                    {transaction.category_id && (
                      <span className="category-tag" style={{ backgroundColor: getCategoryColor(transaction.category_id) }}>
                        {getCategoryName(transaction.category_id)}
                      </span>
                    )}
                  </td>                  <td className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount)).replace('₹', '')}
                  </td>
                  <td className="actions">
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No transactions found. Add your first transaction!</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;
