// Store registered users
let users = [];

// Generate a random 7-digit employee ID
function generateEmployeeId() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Set the initial employee ID for registration
document.getElementById('employeeId').value = generateEmployeeId();

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
    // Hide all forms first
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registrationForm').classList.add('hidden');
    document.getElementById('acknowledgmentScreen').classList.add('hidden');
    document.getElementById('homePage').classList.add('hidden');

    // Show the requested form
    if (form === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
    } else if (form === 'registration') {
        document.getElementById('registrationForm').classList.remove('hidden');
        document.getElementById('employeeId').value = generateEmployeeId();
    } else if (form === 'acknowledgment') {
        document.getElementById('acknowledgmentScreen').classList.remove('hidden');
    } else if (form === 'home') {
        document.getElementById('homePage').classList.remove('hidden');
    }
}

// Handle registration
function handleRegistration(event) {
    event.preventDefault();

    // Get form values
    const employeeId = document.getElementById('employeeId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const address = document.getElementById('address').value;
    const contactNumber = document.getElementById('contactNumber').value;

    // Validation
    if (firstName.length > 50) {
        alert('First name cannot exceed 50 characters');
        return false;
    }

    if (lastName.length > 50) {
        alert('Last name cannot exceed 50 characters');
        return false;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (password.length > 30) {
        alert('Password cannot exceed 30 characters');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }

    if (address.length > 100) {
        alert('Address cannot exceed 100 characters');
        return false;
    }

    if (!contactNumber.match(/^\d{10}$/)) {
        alert('Contact number must be 10 digits');
        return false;
    }

    // Store user data
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

    // Update acknowledgment screen
    document.getElementById('ackEmployeeId').textContent = employeeId;
    document.getElementById('ackName').textContent = `${firstName} ${lastName}`;
    document.getElementById('ackEmail').textContent = email;

    // Show acknowledgment screen
    toggleForms('acknowledgment');

    return false;
}

// Handle login
function handleLogin(event) {
    event.preventDefault();

    const employeeId = document.getElementById('loginEmployeeId').value;
    const password = document.getElementById('loginPassword').value;

    // Find user
    const user = users.find(u => u.employeeId === employeeId && u.password === password);

    if (user) {
        // Show home page
        document.getElementById('employeeName').textContent = `${user.firstName} ${user.lastName}`;
        toggleForms('home');
    } else {
        alert('Invalid credentials. Please try again.');
    }

    return false;
}

// Handle logout
function logout() {
    toggleForms('login');
    document.getElementById('loginEmployeeId').value = '';
    document.getElementById('loginPassword').value = '';
}