import React, { useState, useMemo, useCallback } from 'react';
import Modal from 'react-modal';
import useBudget from '../hooks/useBudget';
import months from './months';
import '../styles/budget.css';

Modal.setAppElement('#root');

const BudgetBuilder = () => {
    const {
        incomeCategories,
        expensesCategories,
        openingBalance,
        closingBalance,
        addSubCategory,
        addParentCategory,
        updateValue,
        applyToAllMonths,
    } = useBudget();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [currentAction, setCurrentAction] = useState({ type: '', parentIndex: null });
    const [startMonthIndex, setStartMonthIndex] = useState(0);
    const [endMonthIndex, setEndMonthIndex] = useState(11);
    const [currentValue, setCurrentValue] = useState('');

    const openModal = (type, parentIndex = null) => {
      console.log('Opening modal:', type, parentIndex);
      setCurrentAction({ type, parentIndex });
      setModalIsOpen(true);
  };
  
  const closeModal = () => {
    
      setModalIsOpen(false);
      setNewCategoryName('');
  };
  
  const handleAddCategory = () => {
    console.log('Adding category:', currentAction, newCategoryName);
      if (currentAction.type === 'addSubCategory') {
          addSubCategory(currentAction.parentIndex.type, currentAction.parentIndex.index, newCategoryName);
      } else if (currentAction.type === 'addParentCategory') {
          addParentCategory(currentAction.parentIndex, newCategoryName);
      }
      closeModal();
  };
  

    const displayedMonths = useMemo(() => {
        return months.slice(startMonthIndex, endMonthIndex + 1);
    }, [startMonthIndex, endMonthIndex]);

    const getMonthlyTotals = useCallback((categories) => {
        return displayedMonths.map((_, monthIndex) => {
            return categories.reduce((total, category) => {
                return total + category.subCategories.reduce((subTotal, subCategory) => {
                    return subTotal + parseFloat(subCategory.values[monthIndex] || 0);
                }, 0);
            }, 0);
        });
    }, [displayedMonths]);

    const incomeTotals = useMemo(() => getMonthlyTotals(incomeCategories), [incomeCategories, getMonthlyTotals]);
    const expenseTotals = useMemo(() => getMonthlyTotals(expensesCategories), [expensesCategories, getMonthlyTotals]);

    const openingBalanceTotals = useMemo(() => {
        const defaultOpeningBalance = new Array(12).fill(0);
        return (openingBalance?.values || defaultOpeningBalance).slice(startMonthIndex, endMonthIndex + 1);
    }, [openingBalance, startMonthIndex, endMonthIndex]);

    const closingBalanceTotals = useMemo(() => {
        const defaultClosingBalance = new Array(12).fill(0);
        return (closingBalance?.values || defaultClosingBalance).slice(startMonthIndex, endMonthIndex + 1);
    }, [closingBalance, startMonthIndex, endMonthIndex]);

    const monthlyProfitLoss = useMemo(() => {
        return incomeTotals.map((income, index) => {
            const expenses = expenseTotals[index] || 0;
            const openingBalance = openingBalanceTotals[index] || 0;
            const closingBalance = closingBalanceTotals[index] || 0;
            return income - expenses - openingBalance + closingBalance;
        });
    }, [incomeTotals, expenseTotals, openingBalanceTotals, closingBalanceTotals]);

    return (
        <div>
            <h2>Budget Builder</h2>

            <div className="month-selection">
                <label>
                    Start Month:
                    <select value={startMonthIndex} onChange={(e) => setStartMonthIndex(Number(e.target.value))}>
                        {months.map((month, index) => (
                            <option key={index} value={index}>
                                {month}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    End Month:
                    <select value={endMonthIndex} onChange={(e) => setEndMonthIndex(Number(e.target.value))}>
                        {months.slice(startMonthIndex).map((month, index) => (
                            <option key={startMonthIndex + index} value={startMonthIndex + index}>
                                {month}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="table-container">
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            {displayedMonths.map((month, index) => (
                                <th key={index}>{month}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Income Categories */}
                        {incomeCategories.map((category, parentIndex) => (
                            <React.Fragment key={`income-${parentIndex}`}>
                                <tr>
                                    <td colSpan={displayedMonths.length + 2}>
                                        <strong>{category.parentName}</strong>
                                    </td>
                                </tr>
                                {category.subCategories.map((subCategory, subIndex) => (
                                    <tr key={`income-sub-${subIndex}`}>
                                        <td>{subCategory.name}</td>
                                        {subCategory.values.slice(startMonthIndex, endMonthIndex + 1).map((value, monthIndex) => (
                                            <td key={monthIndex}>
                                                <input
                                                    type="number"
                                                    value={value}
                                                    onChange={(e) => updateValue('income', parentIndex, subIndex, monthIndex, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <input
                                                type="number"
                                                value={currentValue}
                                                onChange={(e) => setCurrentValue(e.target.value)}
                                                placeholder="Enter value"
                                            />
                                            <button onClick={() => applyToAllMonths('income', parentIndex, subIndex, currentValue)}>
                                                Apply to All Months
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {/* Add New Subcategory Button */}
                                {category.parentName === 'Commission' && (
                                    <tr>
                                        <td colSpan={displayedMonths.length + 2}>
                                            <button onClick={() => openModal('addSubCategory', { type: 'income', index: parentIndex })}>
                                                Add New Subcategory
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        <tr>
                            <td colSpan={displayedMonths.length + 2}>
                                <button onClick={() => openModal('addParentCategory', 'income')}>
                                    Add New Parent Category
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>Total Income</td>
                            {incomeTotals.map((total, index) => (
                                <td key={index}>{total.toFixed(2)}</td>
                            ))}
                            <td></td>
                        </tr>

                        {/* Expenses Categories */}
                        {expensesCategories.map((category, parentIndex) => (
                            <React.Fragment key={`expenses-${parentIndex}`}>
                                <tr>
                                    <td colSpan={displayedMonths.length + 2}>
                                        <strong>{category.parentName}</strong>
                                    </td>
                                </tr>
                                {category.subCategories.map((subCategory, subIndex) => (
                                    <tr key={`expenses-sub-${subIndex}`}>
                                        <td>{subCategory.name}</td>
                                        {subCategory.values.slice(startMonthIndex, endMonthIndex + 1).map((value, monthIndex) => (
                                            <td key={monthIndex}>
                                                <input
                                                    type="number"
                                                    value={value}
                                                    onChange={(e) => updateValue('expenses', parentIndex, subIndex, monthIndex, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <input
                                                type="number"
                                                value={currentValue}
                                                onChange={(e) => setCurrentValue(e.target.value)}
                                                placeholder="Enter value"
                                            />
                                            <button onClick={() => applyToAllMonths('expenses', parentIndex, subIndex, currentValue)}>
                                                Apply to All Months
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {/* Add New Subcategory Button */}
                                {category.parentName === 'Remote Salaries' && (
                                    <tr>
                                        <td colSpan={displayedMonths.length + 2}>
                                            <button onClick={() => openModal('addSubCategory', { type: 'expenses', index: parentIndex })}>
                                                Add New Subcategory
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        <tr>
                            <td colSpan={displayedMonths.length + 2}>
                                <button onClick={() => openModal('addParentCategory', 'expenses')}>
                                    Add New Parent Category
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>Total Expenses</td>
                            {expenseTotals.map((total, index) => (
                                <td key={index}>{total.toFixed(2)}</td>
                            ))}
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Opening Balance</td>
                            {openingBalanceTotals.map((balance, index) => (
                                <td key={index}>{balance.toFixed(2)}</td>
                            ))}
                            <td></td>
                        </tr>
                        <tr>
                            <td>Closing Balance</td>
                            {closingBalanceTotals.map((balance, index) => (
                                <td key={index}>{balance.toFixed(2)}</td>
                            ))}
                            <td></td>
                        </tr>
                        <tr>
                            <td>Profit/Loss</td>
                            {monthlyProfitLoss.map((profitLoss, index) => (
                                <td key={index}>{profitLoss.toFixed(2)}</td>
                            ))}
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>{currentAction.type === 'addSubCategory' ? 'Add Subcategory' : 'Add Parent Category'}</h2>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category Name"
                />
                <button onClick={handleAddCategory}>Add</button>
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default BudgetBuilder;
