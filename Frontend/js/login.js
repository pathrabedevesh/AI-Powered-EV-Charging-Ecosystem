document.getElementById("loginForm").addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
        email: email,
        password: password
    };

    fetch("http://localhost:8080/dologin", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })

    .then(response => response.json())

    .then(data => {

        console.log(data);   // Check backend response

        localStorage.setItem("userId", data.id);
        localStorage.setItem("fullname", data.fullname);
        localStorage.setItem("role", data.role);

        // Save email if backend sends it
        if (data.email) {
            localStorage.setItem("email", data.email);
        }

        if (data.role === "USER") {

            window.location.href = "userdashboard.html";

        } else if (data.role === "OWNER") {

            window.location.href = "stationownerdashboard.html";

        } else {

            alert("Invalid email or password.");

        }

    })

    .catch(error => {

        console.error("Error:", error);
        alert("Something went wrong. Please try again.");

    });

});


// ==========================
// Show / Hide Password
// ==========================

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