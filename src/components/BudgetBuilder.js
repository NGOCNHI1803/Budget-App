import React, { useState } from 'react';
import { Input, Button, Table, Modal } from 'antd';
import months from './months';
import useBudget from '../hooks/useBudget';

const BudgetBuilder = ({ initialData }) => {
  const {
    rows,
    contextMenu,
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
  } = useBudget(initialData);

  const [newCategory, setNewCategory] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [showAddParentDialog, setShowAddParentDialog] = useState(false);
  const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false);
  const [newParentCategoryName, setNewParentCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [currentParent, setCurrentParent] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() && parentCategory.trim()) {
      addNewCategory(parentCategory.trim(), newCategory.trim());
      setNewCategory('');
      setParentCategory('');
    }
  };

  const handleAddParentCategory = () => {
    if (newParentCategoryName.trim()) {
      addNewCategory('parent', newParentCategoryName.trim());
      setNewParentCategoryName('');
      setShowAddParentDialog(false);
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && currentParent) {
      addNewCategory(currentParent, newSubcategoryName.trim());
      setNewSubcategoryName('');
      setShowAddSubcategoryDialog(false);
    }
  };

  const calculateSubcategoryTotals = (record) => {
    if (!record.subRows || record.subRows.length === 0) return {};
    return months.reduce((totals, month) => {
      const monthTotal = record.subRows.reduce((acc, subRow) => {
        const subRowTotal = parseFloat(subRow.values[month] || 0);
        return acc + subRowTotal;
      }, 0);
      return { ...totals, [month]: monthTotal };
    }, {});
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            type="text"
            className="w-full border-none outline-none"
            value={record.name}
            onChange={(e) => {
              handleNameChange(record.id, e.target.value);
              handleSubRowNameChange(record.id, e.target.value);
            }}
            disabled={record.isParentCategory}
          />
          {!record.isParentCategory && (
            <Button onClick={() => deleteRow(record.id)} className="ml-2" type="link" danger>
              Delete
            </Button>
          )}
        </div>
      ),
    },
    ...months.map((month) => ({
      title: month,
      dataIndex: month,
      key: month,
      align: 'right',
      render: (value, record) => {
        const monthValue = record.values && record.values[month] !== undefined ? record.values[month] : '';
        return (
          <div
            onContextMenu={(e) => handleContextMenu(e, record.id, month)}
            style={{ position: 'relative' }}
          >
            <Input
              type="number"
              min="0"
              className="w-full text-right border-none outline-none"
              value={monthValue}
              onChange={(e) => handleInputChange(record.id, month, e.target.value)}
            />
          </div>
        );
      },
    })),
  ];

  const dataSource = rows.map((row) => ({
    key: row.id,
    ...row,
    children: row.subRows ? row.subRows.map((subRow) => ({
      key: subRow.id,
      ...subRow,
      children: subRow.subRows ? subRow.subRows.map((subSubRow) => ({
        key: subSubRow.id,
        ...subSubRow,
      })) : undefined,
    })) : undefined,
  }));

  const summary = () => (
    <>
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={1} className="font-bold">
          Income Total
        </Table.Summary.Cell>
        {months.map((month) => (
          <Table.Summary.Cell key={month} align="right">
            {calculateTotalIncome(month)}
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={1} className="font-bold">
          Total Expenses
        </Table.Summary.Cell>
        {months.map((month) => (
          <Table.Summary.Cell key={month} align="right">
            {calculateTotalExpenses(month)}
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={1} className="font-bold">
          Profit/Loss
        </Table.Summary.Cell>
        {months.map((month) => (
          <Table.Summary.Cell key={month} align="right">
            {calculateProfit(month)}
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={1} className="font-bold">
          Opening Balance
        </Table.Summary.Cell>
        {months.map((month) => (
          <Table.Summary.Cell key={month} align="right">
            {calculateOpeningBalance(month)}
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={1} className="font-bold">
          Closing Balance
        </Table.Summary.Cell>
        {months.map((month) => (
          <Table.Summary.Cell key={month} align="right">
            {calculateClosingBalance(month)}
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
    </>
  );

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
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
        <Button onClick={() => {
          setCurrentParent('Income');
          setShowAddParentDialog(true);
        }} className="mb-2 sm:mb-0 sm:mr-4">
          Add New Parent Category to Income
        </Button>
        <Button onClick={() => {
          setCurrentParent('Expenses');
          setShowAddParentDialog(true);
        }} className="mb-2 sm:mb-0 sm:mr-4">
          Add New Parent Category to Expenses
        </Button>
        <Button onClick={() => setShowAddSubcategoryDialog(true)} className="mb-2 sm:mb-0">
          Add New Subcategory
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => record.subRows && record.subRows.length ? (
            <Table
              columns={columns}
              dataSource={record.subRows}
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={1} className="font-bold">
                    Subtotal
                  </Table.Summary.Cell>
                  {months.map((month) => (
                    <Table.Summary.Cell key={month} align="right">
                      {calculateSubcategoryTotals(record)[month]}
                    </Table.Summary.Cell>
                  ))}
                </Table.Summary.Row>
              )}
            />
          ) : null,
        }}
        summary={summary}
        onRow={(record) => ({
          onContextMenu: (event) => handleContextMenu(event, record.id),
        })}
      />
      <div style={contextMenuStyle}>
        <Button onClick={() => handleApplyToAll('category')}>Apply to All Categories</Button>
      </div>
      <Modal
        title="Add New Parent Category"
        visible={showAddParentDialog}
        onCancel={() => setShowAddParentDialog(false)}
        onOk={handleAddParentCategory}
      >
        <Input
          placeholder="Enter new parent category name"
          value={newParentCategoryName}
          onChange={(e) => setNewParentCategoryName(e.target.value)}
        />
      </Modal>
      <Modal
        title="Add New Subcategory"
        visible={showAddSubcategoryDialog}
        onCancel={() => setShowAddSubcategoryDialog(false)}
        onOk={handleAddSubcategory}
      >
        <Input
          placeholder="Enter new subcategory name"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default BudgetBuilder;
