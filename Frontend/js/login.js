document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email,
        password
    };

    fetch('http://localhost:8080/dologin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify(user)
    })  
    .then(response => response.text())
        
    .then(data => { 
        if(data === 'Success') {
        
            alert('Login successful!');
            window.location.href = 'dashboard.html'; 
        }else{
            alert('Invalid email or password. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Someting went wrong. Please try again later.');
    });    
});    

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        password.type = "password";
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }

});