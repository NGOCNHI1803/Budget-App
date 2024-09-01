// Budget.js
import React from 'react';
import BudgetTable from './BudgetBuilder';
import months from './months'; // Ensure you have the months array defined in a file

// Define the initial data for the budget
const initialData = [
  {
    id: 1,
    name: 'General Income',
    category: 'income',
    values: months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {}),
    subRows: [
      { id: 1, name: 'Sales', values: months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {}) },
      { id: 2, name: 'Commission', values: months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {}) },
    ],
  },
  {
    id: 2,
    name: 'Operational Expenses',
    category: 'expenses',
    values: months.reduce((acc, month) => ({ ...acc, [month]: '' }), {}),
    subRows: [],
  },
  // Add more categories and subcategories as needed
];

const Budget = () => {
  return (
    <div className="budget-container">
      <h1>Budget Overview</h1>
      <BudgetTable initialData={initialData} />
    </div>
  );
};

export default Budget;
