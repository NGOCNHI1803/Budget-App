import React from 'react';

// Component để render hàng Profit/Loss
const ProfitLoss = ({ data = [] }) => (
  <tr>
    <td>Profit/Loss</td>
    {data.map((monthData, index) => (
      <td key={index}>{monthData}</td>
    ))}
  </tr>
);

// Component để render hàng Opening Balance
const OpeningBalance = ({ data = [] }) => (
  <tr>
    <td>Opening Balance</td>
    {data.map((monthData, index) => (
      <td key={index}>{monthData}</td>
    ))}
  </tr>
);

// Component để render hàng Closing Balance
const ClosingBalance = ({ data = [] }) => (
  <tr>
    <td>Closing Balance</td>
    {data.map((monthData, index) => (
      <td key={index}>{monthData}</td>
    ))}
  </tr>
);

// Component chính để kết hợp các hàng
const SummaryBudget = ({
  profitLossData = [],
  openingBalanceData = [],
  closingBalanceData = []
}) => (
  <tbody>
    <ProfitLoss data={profitLossData} />
    <OpeningBalance data={openingBalanceData} />
    <ClosingBalance data={closingBalanceData} />
  </tbody>
);

export default SummaryBudget;
