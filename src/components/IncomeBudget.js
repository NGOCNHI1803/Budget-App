// src/components/BudgetTable/IncomeBudget.js

import React, { useState, useEffect } from 'react';

const GeneralIncome = ({ data, onAddCategory }) => {
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
        <td>General Income</td>
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
          <button onClick={() => onAddCategory(-1, 0, 0)}>Add a New General Income Category</button>
        </td>
      </tr>
    </>
  );
};

const OtherIncome = ({ data, onAddCategory }) => {
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
        <td>Other Income</td>
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
          <button onClick={() => onAddCategory(-1, 0, 0)}>Add a New Other Income Category</button>
        </td>
      </tr>
    </>
  );
};

const TotalIncome = ({ total }) => {
  return (
    <tr>
      <td>Total Income</td>
      {total.map((monthTotal, index) => (
        <td key={index}>{monthTotal}</td>
      ))}
    </tr>
  );
};

const IncomeBudget = ({ generalIncomeData, otherIncomeData, totalIncome, onGeneralIncomeChange, onOtherIncomeChange }) => {
  return (
    <>
      <GeneralIncome data={generalIncomeData} onAddCategory={onGeneralIncomeChange} />
      <OtherIncome data={otherIncomeData} onAddCategory={onOtherIncomeChange} />
      <TotalIncome total={totalIncome} />
    </>
  );
};

export default IncomeBudget;
