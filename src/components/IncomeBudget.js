import React, { useState, useEffect, useCallback } from "react";
import { Input, Button } from 'antd';
import months from './months'; // Assuming months is imported from a file

const BudgetTable = ({ initialData }) => {
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
    const currentMonthIndex = months.indexOf(month);
    let openingBalance = 0;
    for (let i = 0; i < currentMonthIndex; i++) {
      const previousMonth = months[i];
      const profit = calculateProfit(previousMonth);
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

  const handleKeyDown = (e, rowId, month) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentRowIndex = rows.findIndex(row => row.id === rowId);
      const nextRow = rows[currentRowIndex + 1];
      if (nextRow) {
        const firstMonth = months[0];
        document.querySelector(`input[data-row-id="${nextRow.id}"][data-month="${firstMonth}"]`)?.focus();
      } else {
        addNewCategory('income'); // or 'expenses' based on your logic
      }
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
                  onKeyDown={(e) => handleKeyDown(e, row.id, month)}
                  data-row-id={row.id}
                  data-month={month}
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
                    onKeyDown={(e) => handleKeyDown(e, row.id, month)}
                    data-row-id={subRow.id}
                    data-month={month}
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
      <div className="mt-4">
        <Button onClick={() => addNewCategory('income')}>Add New Income Category</Button>
        <Button onClick={() => addNewCategory('expenses')} className="ml-2">Add New Expense Category</Button>
      </div>
    </div>
  );
};

export default BudgetTable;
