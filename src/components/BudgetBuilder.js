// BudgetBuilder.js

import React, { useState } from 'react';
import { Input, Button } from 'antd';
import months from './months';
import useBudget from '../hooks/useBudget';

const BudgetBuilder = ({ initialData }) => {
  const {
    rows,
    contextMenu,
    handleInputChange,
    handleNameChange,
    handleSubRowNameChange,
    addNewCategory,
    deleteRow,
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateProfit,
    calculateOpeningBalance,
    calculateClosingBalance,
    handleContextMenu,
    handleApplyToAll
  } = useBudget(initialData);

  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addNewCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const renderCategoryRows = (category) => {
    return rows
      .filter(row => row.category === category)
      .map(row => (
        <React.Fragment key={row.id}>
          <tr>
            <td className="font-bold border border-black">
              <Input
                type="text"
                className="w-full border-none outline-none"
                value={row.name}
                onChange={(e) => handleNameChange(row.id, e.target.value)}
                disabled={row.name === "General Income" || row.name === "Other Income" || row.name === "Operational Expenses"}
              />
              <Button onClick={() => deleteRow(row.id)} className="ml-2">Delete</Button>
            </td>
            {months.map((month) => (
              <td
                key={month}
                className="border border-black text-right"
                onContextMenu={(e) => handleContextMenu(e, row.id, month)}
              >
                <Input
                  type="text"
                  className="w-full text-right border-none outline-none"
                  value={row.values[month]}
                  onChange={(e) => handleInputChange(row.id, month, e.target.value)}
                />
              </td>
            ))}
          </tr>
          {row.subRows.map(subRow => (
            <tr key={subRow.id}>
              <td className="pl-4 border border-black">
                <Input
                  type="text"
                  className="w-full border-none outline-none"
                  value={subRow.name}
                  onChange={(e) => handleSubRowNameChange(row.id, subRow.id, e.target.value)}
                />
                <Button onClick={() => deleteRow(subRow.id)} className="ml-2">Delete</Button>
              </td>
              {months.map((month) => (
                <td
                  key={month}
                  className="border border-black text-right"
                >
                  <Input
                    type="text"
                    className="w-full text-right border-none outline-none"
                    value={subRow.values[month]}
                    onChange={(e) => handleInputChange(row.id, month, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </React.Fragment>
      ));
  };

  const contextMenuStyle = {
    display: contextMenu.visible ? 'block' : 'none',
    position: 'absolute',
    top: contextMenu.y,
    left: contextMenu.x,
    zIndex: 1000,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '4px',
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <Button onClick={handleAddCategory} className="mt-2">Add Category</Button>
      </div>
      <table className="table-auto border-collapse border border-black w-full">
        <thead>
          <tr>
            <th className="border border-black">Category</th>
            {months.map((month) => (
              <th key={month} className="border border-black">{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderCategoryRows('income')}
          {renderCategoryRows('expenses')}
          <tr>
            <td className="font-bold border border-black">Total Income</td>
            {months.map((month) => (
              <td key={month} className="border border-black text-right">
                {calculateTotalIncome(month)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="font-bold border border-black">Total Expenses</td>
            {months.map((month) => (
              <td key={month} className="border border-black text-right">
                {calculateTotalExpenses(month)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="font-bold border border-black">Profit/Loss</td>
            {months.map((month) => (
              <td key={month} className="border border-black text-right">
                {calculateProfit(month)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="font-bold border border-black">Opening Balance</td>
            {months.map((month) => (
              <td key={month} className="border border-black text-right">
                {calculateOpeningBalance(month)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="font-bold border border-black">Closing Balance</td>
            {months.map((month) => (
              <td key={month} className="border border-black text-right">
                {calculateClosingBalance(month)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div style={contextMenuStyle}>
        <Button onClick={handleApplyToAll}>Apply to All</Button>
      </div>
    </div>
  );
};

export default BudgetBuilder;
