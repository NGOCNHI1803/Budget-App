import React from "react";
import Cell from "./Cell";
import '../styles/budget.css'
const Row = ({ rowName, values, onCellChange, isSubtotal, onDelete }) => {
    return (
      <div className="row">
        <div className="category-name">
          {rowName}
          {onDelete && <button onClick={onDelete}>Delete</button>}
        </div>
        {values.map((value, index) => (
          <Cell
            key={index}
            value={value}
            onChange={(newValue) => onCellChange(index, newValue)}
          />
        ))}
        {isSubtotal && <div className="subtotal">{values.reduce((a, b) => a + Number(b), 0)}</div>}
      </div>
    );
  };


export default Row;