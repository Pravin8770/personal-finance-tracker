import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Budgets from './Budgets';

// Mock services
jest.mock('../services/api', () => ({
  budgets: {
    getAll: jest.fn().mockResolvedValue([]),
  },
  categories: {
    getAll: jest.fn().mockResolvedValue([]),
  },
}));

describe('Budgets Component', () => {
  it('renders the budgets page with title', async () => {
    render(<Budgets />);
    
    // Check if loading state is shown
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
    
    // Wait for data to load
    const title = await screen.findByText('Budgets');
    expect(title).toBeInTheDocument();
  });

  it('shows empty state when no budgets are available', async () => {
    render(<Budgets />);
    
    // Wait for data to load and check for empty state message
    const emptyMessage = await screen.findByText('No budgets found. Create one to get started!');
    expect(emptyMessage).toBeInTheDocument();
  });
});
