// components/ContextMenu.js
import React from 'react';

const ContextMenu = ({ x, y, visible, onApplyToAll }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '4px',
        zIndex: 1000,
      }}
    >
      <button onClick={onApplyToAll} className="p-2">Apply to All</button>
    </div>
  );
};

export default ContextMenu;
