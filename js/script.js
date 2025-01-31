let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

let editingIndex = null; // To track the row being edited

totalAmountCell.textContent = totalAmount;

// Restrict date input to today or future dates
const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
dateInput.setAttribute('min', today); // Set the minimum date to today

const updateLocalStorage = () => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
};

const renderExpenses = () => {
    expenseTableBody.innerHTML = '';
    totalAmount = 0;
    expenses.forEach((expense, index) => {
        totalAmount += expense.amount;
        const newRow = expenseTableBody.insertRow();

        newRow.insertCell().textContent = expense.category;
        newRow.insertCell().textContent = expense.amount;
        newRow.insertCell().textContent = expense.date;

        const actionCell = newRow.insertCell();

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.style.marginRight = '5px';
        editBtn.addEventListener('click', () => {
            categorySelect.value = expense.category;
            amountInput.value = expense.amount;
            dateInput.value = expense.date;
            editingIndex = index; // Set the index of the expense being edited
            addBtn.textContent = 'Update'; // Change button text to indicate editing
        });
        actionCell.appendChild(editBtn);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            expenses.splice(index, 1);
            updateLocalStorage();
            renderExpenses();
        });
        actionCell.appendChild(deleteBtn);
    });
    totalAmountCell.textContent = totalAmount;
};

addBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    // Check if the selected date is in the past
    if (new Date(date) < new Date(today)) {
        alert('Please select today\'s date or a future date.');
        return;
    }

    if (!category || isNaN(amount) || amount <= 0 || !date) {
        alert('Please enter valid data.');
        return;
    }

    if (editingIndex !== null) {
        // Update existing expense
        expenses[editingIndex] = { category, amount, date };
        editingIndex = null; // Reset editing index
        addBtn.textContent = 'Add'; // Reset button text
    } else {
        // Add new expense
        expenses.push({ category, amount, date });
    }

    updateLocalStorage();
    renderExpenses();

    // Clear form fields
    categorySelect.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

const showSection = (sectionId) => {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
};

// Calendar Functionality
const calendar = document.getElementById('calendar');
const currentMonth = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let date = new Date();

const renderCalendar = () => {
    calendar.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonth.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.innerHTML += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        // Fix timezone issue by explicitly setting date to UTC
        const dateString = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
        const dayExpenses = expenses.filter(exp => exp.date === dateString);

        if (dayExpenses.length > 0) {
            const totalExpense = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

            const expenseBtn = document.createElement('button');
            expenseBtn.classList.add('expense-btn');
            expenseBtn.textContent = `Total: ${totalExpense}`;
            dayDiv.appendChild(expenseBtn);

            // Style expense button
            expenseBtn.style.backgroundColor = '#f9a825';
            expenseBtn.style.color = '#fff';
            expenseBtn.style.border = 'none';
            expenseBtn.style.borderRadius = '4px';
            expenseBtn.style.padding = '4px 6px';
            expenseBtn.style.marginTop = '5px';
            expenseBtn.style.cursor = 'pointer';
        }

        calendar.appendChild(dayDiv);
    }
};

prevMonthBtn.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

// Budget Calculator
const healthBudgetInput = document.getElementById('health-budget');
const foodBudgetInput = document.getElementById('food-budget');
const clothingBudgetInput = document.getElementById('clothing-budget');
const addBudgetBtn = document.getElementById('add-budget-btn');
const budgetList = document.getElementById('budget-list');
const totalBudgetElement = document.getElementById('total-budget');

// Load budget data from localStorage
let budgetItems = JSON.parse(localStorage.getItem('budgetItems')) || [];
let totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);

// Render budget data on page load
const renderBudgetTable = () => {
    budgetList.innerHTML = ''; // Clear existing content
    totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0); // Calculate total budget
    totalBudgetElement.textContent = totalBudget; // Update total budget display

    // Render each budget item in a table row
    budgetItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.category}</td>
            <td>$${item.amount}</td>
            <td>
                <button class="edit-btn" onclick="editBudgetItem(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteBudgetItem(${index})">Delete</button>
            </td>
        `;
        budgetList.appendChild(row);
    });
};

// Add or Update Budget Item
addBudgetBtn.addEventListener('click', () => {
    const healthBudget = Number(healthBudgetInput.value) || 0;
    const foodBudget = Number(foodBudgetInput.value) || 0;
    const clothingBudget = Number(clothingBudgetInput.value) || 0;

    // Update budget items
    budgetItems = [
        { category: 'Health', amount: healthBudget },
        { category: 'Food', amount: foodBudget },
        { category: 'Clothing', amount: clothingBudget }
    ];

    // Save to localStorage
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems));

    // Render the updated budget table
    renderBudgetTable();

    // Clear input fields
    healthBudgetInput.value = '';
    foodBudgetInput.value = '';
    clothingBudgetInput.value = '';
});

// Edit Budget Item
const editBudgetItem = (index) => {
    const item = budgetItems[index];
    healthBudgetInput.value = item.category === 'Health' ? item.amount : '';
    foodBudgetInput.value = item.category === 'Food' ? item.amount : '';
    clothingBudgetInput.value = item.category === 'Clothing' ? item.amount : '';
    addBudgetBtn.textContent = 'Update'; // Change button text to indicate editing
    addBudgetBtn.onclick = () => {
        budgetItems[index] = {
            category: item.category,
            amount: item.category === 'Health' ? Number(healthBudgetInput.value) :
                    item.category === 'Food' ? Number(foodBudgetInput.value) :
                    Number(clothingBudgetInput.value)
        };
        localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
        renderBudgetTable();
        addBudgetBtn.textContent = 'Add'; // Reset button text
        addBudgetBtn.onclick = addBudgetBtn.onclick; // Reset button click handler
    };
};

// Delete Budget Item
const deleteBudgetItem = (index) => {
    budgetItems.splice(index, 1); // Remove the item
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems)); // Update localStorage
    renderBudgetTable(); // Re-render the table
};

// Render budget table on page load
renderBudgetTable();

// Statistics Page Functionality
const statisticsSection = document.getElementById('statistics-section');
const statisticsChartCanvas = document.getElementById('statisticsChart');

let statisticsChart = null; // To store the chart instance

const renderStatistics = () => {
    // Get expenses data
    const expensesData = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
    }, {});

    // Get budget data
    const budgetData = budgetItems.reduce((acc, item) => {
        acc[item.category] = item.amount;
        return acc;
    }, {});

    // Prepare chart data
    const categories = [...new Set([...Object.keys(expensesData), ...Object.keys(budgetData)])];
    const expensesValues = categories.map(category => expensesData[category] || 0);
    const budgetValues = categories.map(category => budgetData[category] || 0);

    // Destroy existing chart instance if it exists
    if (statisticsChart) {
        statisticsChart.destroy();
    }

    // Render the chart
    statisticsChart = new Chart(statisticsChartCanvas, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Expenses',
                    data: expensesValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Budget',
                    data: budgetValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

// Show Statistics Section
document.querySelector('.navbar a[href="#statistics-section"]').addEventListener('click', () => {
    showSection('statistics-section');
    renderStatistics(); // Render the chart when the section is shown
});

renderExpenses();
renderCalendar();