// src/components/Category.js
import React from 'react';
import '../styles/budget.css'
const Category = ({ months }) => {
 
  if (!Array.isArray(months)) {
    return <div>Error: No months data available.</div>;
  }

  return (
    <div className="category">
      <div className="header">
        {months.map((month, index) => (
          <div key={index} className="month">
            {month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
