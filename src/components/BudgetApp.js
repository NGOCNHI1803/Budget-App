import React, { useState, useEffect } from 'react';
import IncomeBudget from './IncomeBudget';
import ExpensesBudget from './ExpensesBudget';
import SummaryBudget from './TotalBudget';
import '../styles/budget.css'; 

const BudgetApp = () => {
  const [generalIncomeData, setGeneralIncomeData] = useState(Array(12).fill([]).map(() => [0]));
  const [otherIncomeData, setOtherIncomeData] = useState(Array(12).fill([]).map(() => [0]));
  const [totalIncome, setTotalIncome] = useState(Array(12).fill(0));
  const [expensesData, setExpensesData] = useState(Array(12).fill(0)); // Ví dụ cho Expenses

  const handleGeneralIncomeChange = (monthIndex, itemIndex, value) => {
    const updatedData = [...generalIncomeData];
    if (monthIndex === -1) {
      updatedData.forEach(month => month.push(0));
    } else {
      updatedData[monthIndex][itemIndex] = value;
    }
    setGeneralIncomeData(updatedData);
    updateTotalIncome(updatedData, otherIncomeData);
  };

  const handleOtherIncomeChange = (monthIndex, itemIndex, value) => {
    const updatedData = [...otherIncomeData];
    if (monthIndex === -1) {
      updatedData.forEach(month => month.push(0));
    } else {
      updatedData[monthIndex][itemIndex] = value;
    }
    setOtherIncomeData(updatedData);
    updateTotalIncome(generalIncomeData, updatedData);
  };

  const handleExpensesChange = (monthIndex, value) => {
    const updatedData = [...expensesData];
    updatedData[monthIndex] = value;
    setExpensesData(updatedData);
  };

  const updateTotalIncome = (general, other) => {
    const total = Array(12).fill(0).map((_, index) => {
      const generalSum = general[index].reduce((acc, val) => acc + Number(val), 0);
      const otherSum = other[index].reduce((acc, val) => acc + Number(val), 0);
      return generalSum + otherSum;
    });
    setTotalIncome(total);
  };

  useEffect(() => {
    updateTotalIncome(generalIncomeData, otherIncomeData);
  }, [generalIncomeData, otherIncomeData]);

  return (
    <div className="table-container">
      <table className="budget-table">
        <thead>
          <tr>
            <th>Start Period V and End Period V</th>
            {Array.from({ length: 12 }).map((_, index) => (
              <th key={index}>{`Month ${index + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <IncomeBudget
            generalIncomeData={generalIncomeData}
            otherIncomeData={otherIncomeData}
            totalIncome={totalIncome}
            onGeneralIncomeChange={handleGeneralIncomeChange}
            onOtherIncomeChange={handleOtherIncomeChange}
          />
          <ExpensesBudget
            expensesData={expensesData}
            onExpensesChange={handleExpensesChange}
          />
          <SummaryBudget
            profitLossData={totalIncome.map((income, index) => income - expensesData[index])}
            openingBalanceData={Array(12).fill(0)} 
            closingBalanceData={totalIncome} 
          />
        </tbody>
      </table>
    </div>
  );
};

export default BudgetApp;
