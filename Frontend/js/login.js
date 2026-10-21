
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const user = { email, password };

    try {
        const response = await fetch("http://localhost:8080/dologin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const text = await response.text();

        console.log("HTTP Status:", response.status);
        console.log("Backend Response:", text);

        if (!text.trim()) {
            throw new Error("Empty response from server. Check your Java backend.");
        }

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("Invalid JSON response from server.");
        }

        if (!response.ok) {
            alert(data.message || "Login failed. Check your credentials.");
            return;
        }

        if (data.role === "USER") {
            localStorage.setItem("userId", data.id);
            localStorage.setItem("fullname", data.fullname);
            localStorage.setItem("role", data.role);

            if (data.email) {
                localStorage.setItem("email", data.email);
            }

            window.location.href = "userdashboard.html";

        } else if (data.role === "OWNER") {
            localStorage.setItem("userId", data.id);
            localStorage.setItem("fullname", data.fullname);
            localStorage.setItem("role", data.role);

            if (data.email) {
                localStorage.setItem("email", data.email);
            }

            window.location.href = "stationownerdashboard.html";

        } else {
            alert("Invalid email or password.");
        }

    } catch (error) {
        console.error("Login Error:", error);
        alert(error.message || "Something went wrong. Please try again.");
    }
});


// Show / Hide Password

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            passwordInput.type = "password";
            this.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });
}
