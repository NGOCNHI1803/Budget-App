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
  const [activeCell, setActiveCell] = useState({ rowId: null, month: months[0] });

  // Set initial focus
  useEffect(() => {
    if (rows.length > 0) {
      setActiveCell({ rowId: rows[0].id, month: months[0] });
    }
  }, [rows]);

  const handleInputChange = (rowId, month, value) => {
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? { ...row, values: { ...row.values, [month]: parseFloat(value) || 0 } }
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
        values: months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {}),
        subRows: [],
        category,
      },
    ]);
  };

  const deleteRow = (rowId) => {
    setRows(prevRows => prevRows.filter(row => row.id !== rowId && !row.subRows.some(sub => sub.id === rowId)));
  };

  const calculateTotalForCategory = (category, month) => {
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

  const calculateTotalIncome = (month) => calculateTotalForCategory("income", month);
  const calculateTotalExpenses = (month) => calculateTotalForCategory("expenses", month);

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
      const cellValue = rows.find(row => row.id === rowId)?.values[month] || 0;
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

  const handleKeyDown = useCallback((e) => {
    const { rowId, month } = activeCell;
    const rowIndex = rows.findIndex(row => row.id === rowId);
    const monthIndex = months.indexOf(month);

    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (monthIndex < months.length - 1) {
          setActiveCell({ rowId, month: months[monthIndex + 1] });
        } else if (rowIndex < rows.length - 1) {
          setActiveCell({ rowId: rows[rowIndex + 1].id, month: months[0] });
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (monthIndex < months.length - 1) {
          setActiveCell({ rowId, month: months[monthIndex + 1] });
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (monthIndex > 0) {
          setActiveCell({ rowId, month: months[monthIndex - 1] });
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (rowIndex < rows.length - 1) {
          setActiveCell({ rowId: rows[rowIndex + 1].id, month });
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (rowIndex > 0) {
          setActiveCell({ rowId: rows[rowIndex - 1].id, month });
        }
        break;
      default:
        break;
    }
  }, [activeCell, rows]);

  const handleClickOutside = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  return {
    rows,
    contextMenu,
    activeCell,
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
