document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;

    const user = {
        fullname,
        email,
        password,
        phone,
        role
    };

    fetch('http://localhost:8080/save-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);
        alert('User registered successfully!');
        window.location.href = 'login.html'; 

    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error registering user. Please try again.');
    });
});    