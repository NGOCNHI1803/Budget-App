import { useState, useMemo, useCallback } from 'react';

const useBudget = () => {
    const [incomeCategories, setIncomeCategories] = useState([
        {
            parentName: 'General Income',
            subCategories: [
                { name: 'Sales', values: Array(12).fill(0) },
                { name: 'Commission', values: Array(12).fill(0) },
            ],
        },
        {
            parentName: 'Other Income',
            subCategories: [
                { name: 'Training', values: Array(12).fill(0) },
                { name: 'Consulting', values: Array(12).fill(0) },
            ],
        },
    ]);

    const [expensesCategories, setExpensesCategories] = useState([
        {
            parentName: 'Operational Expenses',
            subCategories: [
                { name: 'Management Fees', values: Array(12).fill(0) },
                { name: 'Cloud Hosting', values: Array(12).fill(0) },
            ],
        },
        {
            parentName: 'Salaries & Wages',
            subCategories: [
                { name: 'Full Time Dev Salaries', values: Array(12).fill(0) },
                { name: 'Part Time Dev Salaries', values: Array(12).fill(0) },
                { name: 'Remote Salaries', values: Array(12).fill(0) },
            ],
        },
    ]);

    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'short' })), []);

    const calculateSubCategoryTotal = useCallback((categories, parentIndex, monthIndex) => {
        const subCategories = categories[parentIndex].subCategories;
        return subCategories.reduce((acc, sub) => acc + sub.values[monthIndex], 0);
    }, []);

    const calculateTotal = useCallback((categories, monthIndex) => {
        return categories.reduce((acc, _, parentIndex) => acc + calculateSubCategoryTotal(categories, parentIndex, monthIndex), 0);
    }, [calculateSubCategoryTotal]);

    const calculateProfit = useCallback((monthIndex) => {
        const incomeTotal = calculateTotal(incomeCategories, monthIndex);
        const expenseTotal = calculateTotal(expensesCategories, monthIndex);
        return incomeTotal - expenseTotal;
    }, [incomeCategories, expensesCategories, calculateTotal]);

    const calculateOpeningBalance = useCallback((monthIndex) => {
        let openingBalance = 0;
        for (let i = 0; i < monthIndex; i++) {
            openingBalance += calculateProfit(i);
        }
        return openingBalance;
    }, [calculateProfit]);

    const calculateClosingBalance = useCallback((monthIndex) => {
        const openingBalance = calculateOpeningBalance(monthIndex);
        const profit = calculateProfit(monthIndex);
        return openingBalance + profit;
    }, [calculateOpeningBalance, calculateProfit]);

    const monthlyProfits = useMemo(() => months.map((_, i) => calculateProfit(i)), [calculateProfit, months]);
    const monthlyOpeningBalances = useMemo(() => months.map((_, i) => calculateOpeningBalance(i)), [calculateOpeningBalance, months]);
    const monthlyClosingBalances = useMemo(() => months.map((_, i) => calculateClosingBalance(i)), [calculateClosingBalance, months]);

    const addSubCategory = (type, parentIndex, name) => {
        if (type === 'income') {
            const newIncome = [...incomeCategories];
            newIncome[parentIndex].subCategories.push({ name, values: Array(12).fill(0) });
            setIncomeCategories(newIncome);
        } else {
            const newExpenses = [...expensesCategories];
            newExpenses[parentIndex].subCategories.push({ name, values: Array(12).fill(0) });
            setExpensesCategories(newExpenses);
        }
    };

    const addParentCategory = (type, name) => {
        if (type === 'income') {
            setIncomeCategories([...incomeCategories, { parentName: name, subCategories: [] }]);
        } else {
            setExpensesCategories([...expensesCategories, { parentName: name, subCategories: [] }]);
        }
    };

    const updateValue = (type, parentIndex, subIndex, monthIndex, value) => {
        if (type === 'income') {
            const newIncome = [...incomeCategories];
            newIncome[parentIndex].subCategories[subIndex].values[monthIndex] = parseFloat(value) || 0;
            setIncomeCategories(newIncome);
        } else {
            const newExpenses = [...expensesCategories];
            newExpenses[parentIndex].subCategories[subIndex].values[monthIndex] = parseFloat(value) || 0;
            setExpensesCategories(newExpenses);
        }
    };

    const applyToAllMonths = (type, parentIndex, subIndex, value) => {
        if (type === 'income') {
            const newIncome = [...incomeCategories];
            newIncome[parentIndex].subCategories[subIndex].values.fill(parseFloat(value) || 0);
            setIncomeCategories(newIncome);
        } else {
            const newExpenses = [...expensesCategories];
            newExpenses[parentIndex].subCategories[subIndex].values.fill(parseFloat(value) || 0);
            setExpensesCategories(newExpenses);
        }
    };

    return {
        incomeCategories,
        expensesCategories,
        addSubCategory,
        addParentCategory,
        updateValue,
        applyToAllMonths,
        calculateTotal,
        monthlyProfits,
        monthlyOpeningBalances,
        monthlyClosingBalances,
    };
};

export default useBudget;
