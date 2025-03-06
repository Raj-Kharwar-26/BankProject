// Store registered users, customers, loans, and transactions
let users = [];
let customers = [];
let loans = [];
let transactions = [];

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedUsers = localStorage.getItem('users');
    const storedCustomers = localStorage.getItem('customers');
    const storedLoans = localStorage.getItem('loans');
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    
    if (storedCustomers) {
        customers = JSON.parse(storedCustomers);
    }

    if (storedLoans) {
        loans = JSON.parse(storedLoans);
    }

    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showHomePage();
        document.getElementById('employeeName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }

    // Initialize tables if on respective management pages
    if (!document.getElementById('customerManagement').classList.contains('hidden')) {
        updateCustomerTable();
    }
    if (!document.getElementById('loanManagement').classList.contains('hidden')) {
        updateLoanTable();
    }
    if (!document.getElementById('transactionManagement').classList.contains('hidden')) {
        updateTransactionTable();
    }
});

// Generate a random 7-digit employee ID
function generateEmployeeId() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Generate a random loan ID
function generateLoanId() {
    return 'L' + Math.floor(100000 + Math.random() * 900000).toString();
}

// Toggle password visibility
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

// Toggle between forms
function toggleForms(form) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registrationForm').classList.add('hidden');
    document.getElementById('acknowledgmentScreen').classList.add('hidden');
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('customerManagement').classList.add('hidden');
    document.getElementById('loanManagement').classList.add('hidden');
    document.getElementById('transactionManagement').classList.add('hidden');

    if (form === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
    } else if (form === 'registration') {
        document.getElementById('registrationForm').classList.remove('hidden');
        document.getElementById('employeeId').value = generateEmployeeId();
    } else if (form === 'acknowledgment') {
        document.getElementById('acknowledgmentScreen').classList.remove('hidden');
    } else if (form === 'home') {
        document.getElementById('homePage').classList.remove('hidden');
    } else if (form === 'customerManagement') {
        document.getElementById('customerManagement').classList.remove('hidden');
        updateCustomerTable();
    } else if (form === 'loanManagement') {
        document.getElementById('loanManagement').classList.remove('hidden');
        updateLoanTable();
    } else if (form === 'transactionManagement') {
        document.getElementById('transactionManagement').classList.remove('hidden');
        updateTransactionTable();
    }
}

// Handle registration
function handleRegistration(event) {
    event.preventDefault();

    const employeeId = document.getElementById('employeeId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value;
    const contactNumber = document.getElementById('contactNumber').value;

    const user = {
        employeeId,
        firstName,
        lastName,
        email,
        password,
        address,
        contactNumber
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    // Update acknowledgment screen
    document.getElementById('ackEmployeeId').textContent = employeeId;
    document.getElementById('ackName').textContent = `${firstName} ${lastName}`;
    document.getElementById('ackEmail').textContent = email;

    toggleForms('acknowledgment');
    return false;
}

// Handle login
function handleLogin(event) {
    event.preventDefault();

    const employeeId = document.getElementById('loginEmployeeId').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.employeeId === employeeId && u.password === password);

    if (user) {
        // Store logged-in user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        document.getElementById('employeeName').textContent = `${user.firstName} ${user.lastName}`;
        toggleForms('home');
    } else {
        alert('Invalid credentials. Please try again.');
    }

    return false;
}

// Handle logout
function logout() {
    localStorage.removeItem('currentUser');
    toggleForms('login');
    document.getElementById('loginEmployeeId').value = '';
    document.getElementById('loginPassword').value = '';
}

// Show home page
function showHomePage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('employeeName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        toggleForms('home');
    } else {
        toggleForms('login');
    }
}

// Show customer management page
function showCustomerManagement() {
    toggleForms('customerManagement');
}

// Show loan management page
function showLoanManagement() {
    toggleForms('loanManagement');
    // Add button to show loan action modal
    const header = document.querySelector('#loanManagement .section-header');
    const actionButton = document.createElement('button');
    actionButton.className = 'action-btn';
    actionButton.innerHTML = '<i class="fas fa-plus"></i> Loan Actions';
    actionButton.onclick = () => document.getElementById('loanActionModal').classList.remove('hidden');
    header.appendChild(actionButton);
}

// Generate a random account number
function generateAccountNumber() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Show new customer form modal
function showNewCustomerForm() {
    const modal = document.getElementById('newCustomerModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Generate and set account number
        document.getElementById('accountNumber').value = generateAccountNumber();
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        // Remove dynamically created modals
        if (modalId === 'editCustomerModal' || modalId === 'editLoanModal') {
            modal.remove();
        }
    }
}

// Update customer table
function updateCustomerTable() {
    const tableBody = document.getElementById('customerTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.ssn}</td>
            <td>${customer.name}</td>
            <td>${customer.accountNumber}</td>
            <td>${customer.email}</td>
            <td>
                <button onclick="editCustomer('${customer.ssn}')" class="action-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCustomer('${customer.ssn}')" class="action-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update loan table
function updateLoanTable() {
    const tableBody = document.getElementById('loanTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.loanId}</td>
            <td>${loan.customerName}</td>
            <td>$${loan.amount.toLocaleString()}</td>
            <td>${loan.duration} months</td>
            <td>${loan.status}</td>
            <td>
                <button onclick="editLoan('${loan.loanId}')" class="action-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteLoan('${loan.loanId}')" class="action-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle new customer registration
function handleNewCustomer(event) {
    event.preventDefault();

    const customer = {
        ssn: document.getElementById('customerSSN').value,
        name: document.getElementById('customerName').value,
        accountNumber: document.getElementById('accountNumber').value,
        ifscCode: document.getElementById('ifscCode').value,
        balance: parseFloat(document.getElementById('accountBalance').value),
        aadharCard: document.getElementById('aadharCard').value,
        panCard: document.getElementById('panCard').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        maritalStatus: document.getElementById('maritalStatus').value,
        email: document.getElementById('customerEmail').value,
        address: document.getElementById('customerAddress').value,
        contactNumber: document.getElementById('contactNumber').value
    };

    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));
    
    updateCustomerTable();
    closeModal('newCustomerModal');
    
    // Reset form
    document.getElementById('newCustomerForm').reset();
    
    return false;
}

// Show new loan form
function showNewLoanForm() {
    closeModal('loanActionModal');
    const modal = document.getElementById('newLoanModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Show update loan form
function showUpdateLoanForm() {
    closeModal('loanActionModal');
    const modal = document.getElementById('loanSearchModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Handle new loan application
function handleNewLoan(event) {
    event.preventDefault();

    const loan = {
        loanId: generateLoanId(),
        customerSSN: document.getElementById('loanCustomerSSN').value,
        customerName: document.getElementById('loanCustomerName').value,
        occupation: document.getElementById('occupation').value,
        employerName: document.getElementById('employerName').value,
        employerAddress: document.getElementById('employerAddress').value,
        amount: parseFloat(document.getElementById('loanAmount').value),
        duration: parseInt(document.getElementById('loanDuration').value),
        status: 'Pending',
        applicationDate: new Date().toISOString()
    };

    loans.push(loan);
    localStorage.setItem('loans', JSON.stringify(loans));
    
    updateLoanTable();
    closeModal('newLoanModal');
    
    // Reset form
    document.getElementById('newLoanForm').reset();
    alert('Loan application submitted successfully!');
    
    return false;
}

// Edit customer
function editCustomer(ssn) {
    const customer = customers.find(c => c.ssn === ssn);
    if (customer) {
        // Create and show edit form modal
        const editModal = document.createElement('div');
        editModal.className = 'modal';
        editModal.id = 'editCustomerModal';
        editModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Customer Details</h3>
                    <span class="close" onclick="closeModal('editCustomerModal')">&times;</span>
                </div>
                <form onsubmit="return handleUpdateCustomer(event, '${customer.ssn}')">
                    <div class="form-row">
                        <div class="form-group">
                            <label>SSN ID</label>
                            <input type="text" value="${customer.ssn}" readonly />
                        </div>
                        <div class="form-group">
                            <label>Account Number</label>
                            <input type="text" value="${customer.accountNumber}" readonly />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editCustomerName">Full Name</label>
                            <input type="text" id="editCustomerName" value="${customer.name}" required />
                        </div>
                        <div class="form-group">
                            <label for="editCustomerEmail">Email</label>
                            <input type="email" id="editCustomerEmail" value="${customer.email}" required />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="editCustomerPhone">Contact Number</label>
                            <input type="tel" id="editCustomerPhone" value="${customer.contactNumber}" required pattern="\\d{10}" />
                        </div>
                        <div class="form-group">
                            <label for="editMaritalStatus">Marital Status</label>
                            <select id="editMaritalStatus" required>
                                <option value="single" ${customer.maritalStatus === 'single' ? 'selected' : ''}>Single</option>
                                <option value="married" ${customer.maritalStatus === 'married' ? 'selected' : ''}>Married</option>
                                <option value="divorced" ${customer.maritalStatus === 'divorced' ? 'selected' : ''}>Divorced</option>
                                <option value="widowed" ${customer.maritalStatus === 'widowed' ? 'selected' : ''}>Widowed</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="editCustomerAddress">Address</label>
                        <textarea id="editCustomerAddress" required rows="3">${customer.address}</textarea>
                    </div>

                    <div class="form-actions">
                        <button type="button" onclick="closeModal('editCustomerModal')" class="secondary-btn">Cancel</button>
                        <button type="submit">Update Customer</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(editModal);
        editModal.classList.remove('hidden');
    }
}

// Handle customer update
function handleUpdateCustomer(event, ssn) {
    event.preventDefault();
    
    const customerIndex = customers.findIndex(c => c.ssn === ssn);
    
    if (customerIndex !== -1) {
        // Update only editable fields
        customers[customerIndex] = {
            ...customers[customerIndex],
            name: document.getElementById('editCustomerName').value,
            email: document.getElementById('editCustomerEmail').value,
            contactNumber: document.getElementById('editCustomerPhone').value,
            maritalStatus: document.getElementById('editMaritalStatus').value,
            address: document.getElementById('editCustomerAddress').value
        };
        
        localStorage.setItem('customers', JSON.stringify(customers));
        updateCustomerTable();
        closeModal('editCustomerModal');
        alert('Customer details updated successfully!');
    }
    
    return false;
}

// Delete customer
function deleteCustomer(ssn) {
    if (confirm('Are you sure you want to delete this customer?')) {
        customers = customers.filter(c => c.ssn !== ssn);
        localStorage.setItem('customers', JSON.stringify(customers));
        updateCustomerTable();
    }
}

// Search and edit loan
function searchAndEditLoan(loanId = null) {
    // If loanId is provided directly, use it, otherwise get it from the search input
    const searchId = loanId || document.getElementById('searchLoanId').value;
    const loan = loans.find(l => l.loanId === searchId || l.customerSSN === searchId);
    
    if (loan) {
        // Create and show edit form modal
        const editModal = document.createElement('div');
        editModal.className = 'modal';
        editModal.id = 'editLoanModal';
        editModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Loan Application</h3>
                    <span class="close" onclick="closeModal('editLoanModal')">&times;</span>
                </div>
                <form onsubmit="return handleUpdateLoan(event, '${loan.loanId}')">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Loan ID</label>
                            <input type="text" value="${loan.loanId}" readonly />
                        </div>
                        <div class="form-group">
                            <label>Customer Name</label>
                            <input type="text" value="${loan.customerName}" readonly />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" value="${loan.amount}" readonly />
                        </div>
                        <div class="form-group">
                            <label>Duration (Months)</label>
                            <input type="number" value="${loan.duration}" readonly />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="loanStatus">Status</label>
                        <select id="loanStatus" required>
                            <option value="Pending" ${loan.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Approved" ${loan.status === 'Approved' ? 'selected' : ''}>Approved</option>
                            <option value="Rejected" ${loan.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="closeModal('editLoanModal')" class="secondary-btn">Cancel</button>
                        <button type="submit">Update Loan</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(editModal);
        closeModal('loanSearchModal');
        editModal.classList.remove('hidden');
    } else {
        alert('Loan not found!');
    }
}

// Handle loan update
function handleUpdateLoan(event, loanId) {
    event.preventDefault();
    
    const status = document.getElementById('loanStatus').value;
    const loanIndex = loans.findIndex(l => l.loanId === loanId);
    
    if (loanIndex !== -1) {
        loans[loanIndex].status = status;
        localStorage.setItem('loans', JSON.stringify(loans));
        updateLoanTable();
        closeModal('editLoanModal');
        alert('Loan status updated successfully!');
    }
    
    return false;
}

// Edit loan
function editLoan(loanId) {
    searchAndEditLoan(loanId);
}

// Delete loan
function deleteLoan(loanId) {
    if (confirm('Are you sure you want to delete this loan application?')) {
        loans = loans.filter(l => l.loanId !== loanId);
        localStorage.setItem('loans', JSON.stringify(loans));
        updateLoanTable();
    }
}

// Search customers
function searchCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    const filteredCustomers = customers.filter(customer => 
        customer.ssn.toLowerCase().includes(searchTerm) ||
        customer.name.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.getElementById('customerTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    filteredCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.ssn}</td>
            <td>${customer.name}</td>
            <td>${customer.accountNumber}</td>
            <td>${customer.email}</td>
            <td>
                <button onclick="editCustomer('${customer.ssn}')" class="action-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCustomer('${customer.ssn}')" class="action-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Search loans
function searchLoans() {
    const searchTerm = document.getElementById('loanSearch').value.toLowerCase();
    const filteredLoans = loans.filter(loan => 
        loan.loanId.toLowerCase().includes(searchTerm) ||
        loan.customerSSN.toLowerCase().includes(searchTerm) ||
        loan.customerName.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.getElementById('loanTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    filteredLoans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.loanId}</td>
            <td>${loan.customerName}</td>
            <td>$${loan.amount.toLocaleString()}</td>
            <td>${loan.duration} months</td>
            <td>${loan.status}</td>
            <td>
                <button onclick="editLoan('${loan.loanId}')" class="action-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteLoan('${loan.loanId}')" class="action-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Generate a random transaction ID
function generateTransactionId() {
    return 'TXN' + Math.floor(100000 + Math.random() * 900000).toString();
}

// Show transaction management page
function showTransactionManagement() {
    toggleForms('transactionManagement');
    updateTransactionTable();
}

// Show new transaction form
function showNewTransactionForm() {
    const modal = document.getElementById('newTransactionModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Set current date as default
        document.getElementById('transactionDate').valueAsDate = new Date();
    }
}

// Handle new transaction
function handleNewTransaction(event) {
    event.preventDefault();

    const transaction = {
        transactionId: generateTransactionId(),
        customerSSN: document.getElementById('transactionCustomerSSN').value,
        customerName: document.getElementById('transactionCustomerName').value,
        accountId: document.getElementById('transactionAccountId').value,
        type: document.getElementById('transactionType').value,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        date: document.getElementById('transactionDate').value,
        description: document.getElementById('transactionDescription').value,
        status: 'Completed',
        timestamp: new Date().toISOString()
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateTransactionTable();
    closeModal('newTransactionModal');
    
    // Reset form
    document.getElementById('newTransactionForm').reset();
    alert('Transaction processed successfully!');
    
    return false;
}

// Update transaction table
function updateTransactionTable() {
    const tableBody = document.getElementById('transactionTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.transactionId}</td>
            <td>${transaction.customerName}</td>
            <td>${transaction.accountId}</td>
            <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
            <td>$${transaction.amount.toLocaleString()}</td>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${transaction.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Search transactions
function searchTransactions() {
    const searchTerm = document.getElementById('transactionSearch').value.toLowerCase();
    const filteredTransactions = transactions.filter(transaction => 
        transaction.transactionId.toLowerCase().includes(searchTerm) ||
        transaction.customerSSN.toLowerCase().includes(searchTerm) ||
        transaction.customerName.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.getElementById('transactionTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.transactionId}</td>
            <td>${transaction.customerName}</td>
            <td>${transaction.accountId}</td>
            <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
            <td>$${transaction.amount.toLocaleString()}</td>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${transaction.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Add click event listener to home links
document.addEventListener('DOMContentLoaded', () => {
    const homeLinks = document.querySelectorAll('a[href="index.html"]');
    homeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showHomePage();
        });
    });

    // Add transaction card to dashboard
    const dashboardGrid = document.querySelector('.dashboard-grid');
    if (dashboardGrid) {
        const transactionCard = document.createElement('div');
        transactionCard.className = 'dashboard-card';
        transactionCard.onclick = () => showTransactionManagement();
        transactionCard.innerHTML = `
            <i class="fas fa-exchange-alt"></i>
            <h3>Transaction Processing</h3>
            <p>Process customer transactions</p>
        `;
        dashboardGrid.appendChild(transactionCard);
    }
});