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
        addSubCategory,
        addParentCategory,
        updateValue,
        applyToAllMonths,
        
        monthlyOpeningBalances,
        monthlyClosingBalances,
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
            // Tính tổng cho mỗi tháng
            return categories.reduce((total, category) => {
                // Lấy giá trị của category chính
                const parentValue = parseInt(category.values[monthIndex] || 0, 10);
                // Tính tổng tất cả các giá trị của subcategories
                const subCategoryTotal = category.subCategories.reduce((subTotal, subCategory) => {
                    return subTotal + parseInt(subCategory.values[monthIndex] || 0, 10);
                }, 0);
                // Cộng giá trị chính của category và tổng của subcategories
                return total + parentValue + subCategoryTotal;
            }, 0);
        });
    }, [displayedMonths]);
    

    const incomeTotals = useMemo(() => getMonthlyTotals(incomeCategories), [incomeCategories, getMonthlyTotals]);
    const expenseTotals = useMemo(() => getMonthlyTotals(expensesCategories), [expensesCategories, getMonthlyTotals]);

    const getCategorySubtotals = useCallback((categories) => {
        return categories.map((category) => {
            return displayedMonths.map((_, monthIndex) => {
                // Include parent category value if applicable
                const parentValue = parseInt(category.values[monthIndex] || 0, 10);
                // Sum all subcategory values
                const subCategoryTotal = category.subCategories.reduce((total, subCategory) => {
                    return total + parseInt(subCategory.values[monthIndex] || 0, 10);
                }, 0);
                // Return the combined total for this category (parent + subcategories)
                return parentValue + subCategoryTotal;
            });
        });
    }, [displayedMonths]);
    

    const monthlyProfitLoss = useMemo(() => {
        return displayedMonths.map((_, monthIndex) => {
            const income = incomeTotals[monthIndex] || 0;
            const expenses = expenseTotals[monthIndex] || 0;
            return income - expenses;
        });
    }, [incomeTotals, expenseTotals, displayedMonths]);

    return (
        <div>
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
                            <th>Start Period V End Period V</th>
                            {displayedMonths.map((month, index) => (
                                <th key={index}>{month}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Income Categories */}
                        <tr>
                                    <td colSpan={displayedMonths.length + 2} className='main-record'>
                                        
                                        Income
                                    </td>
                                </tr>
                        {incomeCategories.map((category, parentIndex) => (
                            <React.Fragment key={`income-${parentIndex}`}>
                                 
                                 <tr>
                                    <td className='parent-record'>{category.parentName}</td>
                                    {category.values.slice(startMonthIndex, endMonthIndex + 1).map((value, monthIndex) => (
                                        <td key={monthIndex}>
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) => updateValue('income', parentIndex, null, monthIndex, e.target.value)} 
                                                // null passed for subIndex to indicate it's the parent category
                                            />
                                        </td>
                                    ))}
                                    <td></td>
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
                                <tr>
                                    <td className='sub-totals'>Sub Totals</td>
                                    {getCategorySubtotals([category])[0].map((total, index) => (
                                        <td key={index}>{total}</td>
                                    ))}
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan={displayedMonths.length + 2}>
                                        <button onClick={() => openModal('addSubCategory', { type: 'income', index: parentIndex })}>
                                            Add New Subcategory
                                        </button>
                                    </td>
                                </tr>
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
                            <td className='totals'>Total Income</td>
                            {incomeTotals.map((total, index) => (
                                <td key={index}>{total}</td>
                            ))}
                            <td></td>
                        </tr>

                        {/* Expenses Categories */}
                        <tr>
                                    <td colSpan={displayedMonths.length + 2} className='main-record'>
                                        
                                    Expenses
                                    </td>
                                </tr>
                        {expensesCategories.map((category, parentIndex) => (
                            <React.Fragment key={`expenses-${parentIndex}`}>
                               <tr>
                                    <td className='parent-record'>{category.parentName}</td>
                                    {category.values.slice(startMonthIndex, endMonthIndex + 1).map((value, monthIndex) => (
                                        <td key={monthIndex}>
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) => updateValue('expenses', parentIndex, null, monthIndex, e.target.value)} 
                                                // null passed for subIndex to indicate it's the parent category
                                            />
                                        </td>
                                    ))}
                                    <td></td>
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
                                <tr>
                                    <td colSpan={displayedMonths.length + 2}>
                                        <button onClick={() => openModal('addSubCategory', { type: 'expenses', index: parentIndex })}>
                                            Add New Subcategory
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='sub-totals'>Sub Totals</td>
                                    {getCategorySubtotals([category])[0].map((total, index) => (
                                        <td key={index}>{total}</td>
                                    ))}
                                    <td></td>
                                </tr>
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
                            <td className='totals'>Total Expenses</td>
                            {expenseTotals.map((total, index) => (
                                <td key={index}>{total}</td>
                            ))}
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className='summary'>Profit/Loss</td>
                            {monthlyProfitLoss.map((value, index) => (
                                <td key={index}>{value}</td>
                            ))}
                            <td></td>
                        </tr>
                        <tr>
                            <td className='summary'>Opening Balance</td>
                            {monthlyOpeningBalances.map((value, index) => (
                                <td key={index}>{value}</td>
                            ))}
                            <td></td>
                        </tr>
                        <tr>
                            <td className='summary'>Closing Balance</td>
                            {monthlyClosingBalances.map((value, index) => (
                                <td key={index}>{value}</td>
                            ))}
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} >
                <h2>{currentAction.type === 'addSubCategory' ? 'Add Sub-Category' : 'Add Parent Category'}</h2>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                />
                <button onClick={handleAddCategory}>Add</button>
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default BudgetBuilder;
