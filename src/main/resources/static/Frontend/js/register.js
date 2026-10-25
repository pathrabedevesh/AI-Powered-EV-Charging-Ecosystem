function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    if (!registerForm) {
        console.error('Register form not found.');
        return;
    }

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const user = {
            fullname: document.getElementById('fullname').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value.trim(),
            role: document.getElementById('role').value
        };

        try {
            const response = await fetch('/save-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.text();
            console.log('Register status:', response.status, data);

            if (!response.ok) {
                throw new Error('Server error ' + response.status + ': ' + data);
            }

            alert('User registered successfully!');
            window.location.href = 'login.html';

        } catch (error) {
            console.error('Error:', error);
            alert('Error registering user. Please try again.');
        }
    });
});