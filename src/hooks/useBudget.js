// hooks/useBudget.js

import { useState, useEffect, useCallback } from 'react';
import months from '../components/months'; // Adjust the path accordingly

const useBudget = (initialData) => {
  const [rows, setRows] = useState(initialData);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    cellData: null,
  });

  const handleInputChange = (rowId, month, value) => {
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? { ...row, values: { ...row.values, [month]: value } }
          : row
      )
    );
  };

  const handleNameChange = (rowId, value) => {
    setRows(prevRows =>
      prevRows.map(row => (row.id === rowId ? { ...row, name: value } : row))
    );
  };

  const handleSubRowNameChange = (rowId, subRowId, value) => {
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? {
              ...row,
              subRows: row.subRows.map(subRow =>
                subRow.id === subRowId ? { ...subRow, name: value } : subRow
              ),
            }
          : row
      )
    );
  };

  const addNewCategory = (category) => {
    setRows(prevRows => [
      ...prevRows,
      {
        id: Date.now(),
        name: "New Category",
        values: months.reduce((acc, month) => ({ ...acc, [month]: "" }), {}),
        subRows: [],
        category,
      },
    ]);
  };

  const deleteRow = (rowId) => {
    setRows(prevRows => prevRows.filter(row => row.id !== rowId));
  };

  const calculateMonthlyTotal = (category, month) => {
    return rows
      .filter(row => row.category === category)
      .reduce((total, row) => {
        const rowTotal = parseFloat(row.values[month]) || 0;
        const subRowTotal = row.subRows.reduce(
          (subTotal, subRow) => subTotal + (parseFloat(subRow.values[month]) || 0),
          0
        );
        return total + rowTotal + subRowTotal;
      }, 0);
  };

  const calculateTotalIncome = (month) => calculateMonthlyTotal("income", month);
  const calculateTotalExpenses = (month) => calculateMonthlyTotal("expenses", month);

  const calculateProfit = (month) => {
    const incomeTotals = calculateTotalIncome(month);
    const expenseTotals = calculateTotalExpenses(month);
    return incomeTotals - expenseTotals;
  };

  const calculateOpeningBalance = (month) => {
    let openingBalance = 0;
    for (let i = 0; i < months.indexOf(month); i++) {
      const currentMonth = months[i];
      const profit = calculateProfit(currentMonth);
      openingBalance += profit;
    }
    return openingBalance;
  };

  const calculateClosingBalance = (month) => {
    const openingBalance = calculateOpeningBalance(month);
    const profit = calculateProfit(month);
    return openingBalance + profit;
  };

  const handleContextMenu = (e, rowId, month) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      cellData: { rowId, month },
    });
  };

  const handleApplyToAll = () => {
    if (contextMenu.cellData) {
      const { rowId, month } = contextMenu.cellData;
      const cellValue = rows.find(row => row.id === rowId).values[month];
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === rowId
            ? {
                ...row,
                values: Object.keys(row.values).reduce(
                  (acc, m) => ({ ...acc, [m]: cellValue }),
                  {}
                ),
              }
            : row
        )
      );
      setContextMenu({
        ...contextMenu,
        visible: false,
      });
    }
  };

  const handleClickOutside = useCallback(() => {
    setContextMenu({ ...contextMenu, visible: false });
  }, [contextMenu]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return {
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
    handleApplyToAll,
  };
};

export default useBudget;
