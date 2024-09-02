import React, { useState, useEffect } from 'react';
import BudgetTable from './BudgetBuilder'; // Đảm bảo đường dẫn chính xác
import useBudget from '../hooks/useBudget'; // Giả sử bạn có hook này cho các chức năng liên quan đến ngân sách

const Budget = () => {
  // State để lưu dữ liệu ngân sách ban đầu
  const [initialData, setInitialData] = useState([]);

  // Hook để lấy dữ liệu ngân sách từ nguồn bên ngoài (API, localStorage, v.v.)
  useEffect(() => {
    // Hàm giả lập để lấy dữ liệu ngân sách, thay thế bằng API call hoặc localStorage nếu cần
    const fetchData = async () => {
      // Giả sử bạn có dữ liệu mẫu hoặc gọi API để lấy dữ liệu thực tế
      const data = [
        {
          id: '1',
          name: 'Income',
          subRows: [
            { id: '1-1', name: 'General Income', values: { 'January 2024': '100', 'February 2024': '120' } },
            { id: '1-2', name: 'Sales', values: { 'January 2024': '200', 'February 2024': '400' } },
          ],
        },
        {
          id: '2',
          name: 'Expenses',
          subRows: [
            { id: '2-1', name: 'Operational Expenses', values: { 'January 2024': '50', 'February 2024': '100' } },
            { id: '2-2', name: 'Management Fees', values: { 'January 2024': '100', 'February 2024': '200' } },
          ],
        },
      ];
      setInitialData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="budget-app">
      <h1>Budget Management</h1>
      <BudgetTable initialData={initialData} />
    </div>
  );
};

export default Budget;
