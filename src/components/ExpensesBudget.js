

import React, { useState, useEffect } from 'react';

// GeneralExpenses Component
const GeneralExpenses = ({ data, onAddCategory }) => {
  const [subTotal, setSubTotal] = useState(Array(12).fill(0));

  useEffect(() => {
    const total = Array(12).fill(0);
    data.forEach((monthData, index) => {
      total[index] = monthData.reduce((acc, value) => acc + Number(value), 0);
    });
    setSubTotal(total);
  }, [data]);

  return (
    <>
      <tr>
        <td>General Expenses</td>
        {data.map((monthData, monthIndex) => (
          <td key={monthIndex}>
            {monthData.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                className="input-field"
                onChange={(e) => onAddCategory(monthIndex, index, e.target.value)}
              />
            ))}
          </td>
        ))}
      </tr>
      <tr>
        <td>Sub Total</td>
        {subTotal.map((total, index) => (
          <td key={index}>{total}</td>
        ))}
      </tr>
      <tr>
        <td colSpan="13">
          <button onClick={() => onAddCategory(-1, 0, 0)}>Add a New General Expenses Category</button>
        </td>
      </tr>
    </>
  );
};

// OtherExpenses Component
const OtherExpenses = ({ data, onAddCategory }) => {
  const [subTotal, setSubTotal] = useState(Array(12).fill(0));

  useEffect(() => {
    const total = Array(12).fill(0);
    data.forEach((monthData, index) => {
      total[index] = monthData.reduce((acc, value) => acc + Number(value), 0);
    });
    setSubTotal(total);
  }, [data]);

  return (
    <>
      <tr>
        <td>Other Expenses</td>
        {data.map((monthData, monthIndex) => (
          <td key={monthIndex}>
            {monthData.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                className="input-field"
                onChange={(e) => onAddCategory(monthIndex, index, e.target.value)}
              />
            ))}
          </td>
        ))}
      </tr>
      <tr>
        <td>Sub Total</td>
        {subTotal.map((total, index) => (
          <td key={index}>{total}</td>
        ))}
      </tr>
      <tr>
        <td colSpan="13">
          <button onClick={() => onAddCategory(-1, 0, 0)}>Add a New Other Expenses Category</button>
        </td>
      </tr>
    </>
  );
};

// TotalExpenses Component
const TotalExpenses = ({ generalData = [], otherData = [] }) => {
  const [total, setTotal] = useState(Array(12).fill(0));

  useEffect(() => {
    if (generalData && otherData && Array.isArray(generalData) && Array.isArray(otherData)) {
      const newTotal = Array(12).fill(0);
      generalData.forEach((monthData, index) => {
        newTotal[index] += monthData.reduce((acc, value) => acc + Number(value), 0);
      });
      otherData.forEach((monthData, index) => {
        newTotal[index] += monthData.reduce((acc, value) => acc + Number(value), 0);
      });
      setTotal(newTotal);
    }
  }, [generalData, otherData]);

  return (
    <tr>
      <td>Total Expenses</td>
      {total.map((value, index) => (
        <td key={index}>{value}</td>
      ))}
    </tr>
  );
};

// ExpensesBudget Component
const ExpensesBudget = () => {
  const [generalExpensesData, setGeneralExpensesData] = useState(Array(12).fill([]));
  const [otherExpensesData, setOtherExpensesData] = useState(Array(12).fill([]));

  const handleAddGeneralCategory = (monthIndex, categoryIndex, value) => {
    // Implement logic to add or update general expenses category
  };

  const handleAddOtherCategory = (monthIndex, categoryIndex, value) => {
    // Implement logic to add or update other expenses category
  };

  return (
    <table>
      <tbody>
        <GeneralExpenses data={generalExpensesData} onAddCategory={handleAddGeneralCategory} />
        <OtherExpenses data={otherExpensesData} onAddCategory={handleAddOtherCategory} />
        <TotalExpenses generalData={generalExpensesData} otherData={otherExpensesData} />
      </tbody>
    </table>
  );
};

export default ExpensesBudget;
