import React, { useState, useEffect, useRef } from 'react';
import '../styles/budget.css'
// Utility function to calculate totals
const calculateTotals = (data) => {
  const totals = {
    incomeTotal: 0,
    totalExpenses: 0,
    profitLoss: 0,
    openingBalance: 0,
    closingBalance: 0
  };

  // Calculate totals for each category
  Object.keys(data).forEach(category => {
    data[category].forEach(row => {
      row.slice(1).forEach((value) => {
        if (typeof value === 'number') {
          if (category === 'income') totals.incomeTotal += value;
          if (category === 'expenses') totals.totalExpenses += value;
        }
      });
    });
  });

  
  totals.profitLoss = totals.incomeTotal - totals.totalExpenses;
  totals.openingBalance = 0; 
  totals.closingBalance = totals.profitLoss;

  return totals;
};

const Table = ({ data, setData, firstCellRef }) => {
  const [totals, setTotals] = useState(calculateTotals(data));
  const [editedCell, setEditedCell] = useState(null);

  useEffect(() => {
    setTotals(calculateTotals(data));
  }, [data]);

  const handleKeyDown = (e, rowIndex, colIndex) => {
    const key = e.key;
    const rowCount = Object.values(data)[0].length; // number of rows
    const colCount = Object.values(data)[0][0].length; // number of columns

    switch (key) {
      case 'ArrowDown':
        if (rowIndex < rowCount - 1) {
          setEditedCell({ rowIndex: rowIndex + 1, colIndex });
          e.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (rowIndex > 0) {
          setEditedCell({ rowIndex: rowIndex - 1, colIndex });
          e.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (colIndex < colCount - 1) {
          setEditedCell({ rowIndex, colIndex: colIndex + 1 });
          e.preventDefault();
        }
        break;
      case 'ArrowLeft':
        if (colIndex > 0) {
          setEditedCell({ rowIndex, colIndex: colIndex - 1 });
          e.preventDefault();
        }
        break;
      case 'Tab':
        if (e.shiftKey) {
          if (colIndex > 0) {
            setEditedCell({ rowIndex, colIndex: colIndex - 1 });
          } else if (rowIndex > 0) {
            setEditedCell({ rowIndex: rowIndex - 1, colIndex: colCount - 1 });
          }
        } else {
          if (colIndex < colCount - 1) {
            setEditedCell({ rowIndex, colIndex: colIndex + 1 });
          } else if (rowIndex < rowCount - 1) {
            setEditedCell({ rowIndex: rowIndex + 1, colIndex: 0 });
          }
        }
        e.preventDefault();
        break;
      case 'Enter':
        const newData = { ...data };
        Object.keys(newData).forEach(category => {
          newData[category].splice(rowIndex + 1, 0, Array(colCount).fill(0)); // Insert new row with default values
        });
        setData(newData);
        setEditedCell({ rowIndex: rowIndex + 1, colIndex: 0 });
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const handleChange = (e, rowIndex, colIndex, category) => {
    const value = parseFloat(e.target.value) || 0;
    const newData = { ...data };
    newData[category][rowIndex][colIndex] = value;
    setData(newData);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            {[...Array(12).keys()].map(i => (
              <th key={i}>{new Date(2024, i, 1).toLocaleString('default', { month: 'short' })}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map(category => (
            data[category].map((row, rowIndex) => (
              <tr key={`${category}-${rowIndex}`}>
                <td>{rowIndex === 0 ? category : row[0]}</td>
                {row.slice(1).map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    <input
                      type="number"
                      value={cell || 0}
                      ref={rowIndex === 0 && cellIndex === 0 ? firstCellRef : null}
                      onChange={(e) => handleChange(e, rowIndex, cellIndex + 1, category)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, cellIndex + 1)}
                    />
                  </td>
                ))}
              </tr>
            ))
          ))}
          <tr>
            <td>Totals</td>
            {[...Array(12).keys()].map(i => (
              <td key={i}>
                {i === 0 ? `Income Total: ${totals.incomeTotal}` : ''}
                {i === 1 ? `Total Expenses: ${totals.totalExpenses}` : ''}
                {i === 2 ? `Profit/Loss: ${totals.profitLoss}` : ''}
                {i === 3 ? `Opening Balance: ${totals.openingBalance}` : ''}
                {i === 4 ? `Closing Balance: ${totals.closingBalance}` : ''}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Table;
