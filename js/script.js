let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

totalAmountCell.textContent = totalAmount;

const updateLocalStorage = () => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

const renderExpenses = () => {
  expenseTableBody.innerHTML = '';
  totalAmount = 0;
  expenses.forEach((expense, index) => {
    totalAmount += expense.amount;
    totalAmountCell.textContent = totalAmount;

    const newRow = expenseTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const actionsCell = newRow.insertCell();

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      expenses.splice(index, 1);
      updateLocalStorage();
      renderExpenses();
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => {
      // Replace cells with input fields
      const categoryInput = document.createElement('input');
      categoryInput.value = expense.category;

      const amountInput = document.createElement('input');
      amountInput.type = 'number';
      amountInput.value = expense.amount;

      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.value = expense.date;

      categoryCell.innerHTML = '';
      amountCell.innerHTML = '';
      dateCell.innerHTML = '';

      categoryCell.appendChild(categoryInput);
      amountCell.appendChild(amountInput);
      dateCell.appendChild(dateInput);

      editBtn.textContent = 'Save';
      editBtn.removeEventListener('click', this);
      editBtn.addEventListener('click', () => {
        // Update the expense data
        expense.category = categoryInput.value;
        expense.amount = Number(amountInput.value);
        expense.date = dateInput.value;

        // Validate inputs
        if (!expense.category || isNaN(expense.amount) || expense.amount <= 0 || !expense.date) {
          alert('Please enter valid data.');
          return;
        }

        // Update localStorage and rerender
        updateLocalStorage();
        renderExpenses();
      });
    });

    actionsCell.appendChild(deleteBtn);
    actionsCell.appendChild(editBtn);
  });
  totalAmountCell.textContent = totalAmount;
};

addBtn.addEventListener('click', () => {
  const category = categorySelect.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (category === '') {
    alert('Please select a category');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  if (date === '') {
    alert('Please select a date');
    return;
  }

  const newExpense = { category, amount, date };
  expenses.push(newExpense);
  updateLocalStorage();
  renderExpenses();

  categorySelect.value = '';
  amountInput.value = '';
  dateInput.value = '';
});

// Initial rendering of expenses from localStorage
renderExpenses();
