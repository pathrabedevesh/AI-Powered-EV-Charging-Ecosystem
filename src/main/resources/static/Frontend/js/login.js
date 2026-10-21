
document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // Login Form
    // ==========================

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (!loginForm || !emailInput || !passwordInput) {
        console.error("Login form or required input fields not found.");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        const user = {
            email: email,
            password: password
        };

        try {
            const response = await fetch("/dologin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(user)
            });

            // Read the response as text first to prevent JSON parsing errors
            const responseText = await response.text();

            console.log("Login HTTP Status:", response.status);
            console.log("Login Backend Response:", responseText);

            if (!response.ok) {
                throw new Error(
                    "Server error " + response.status +
                    (responseText ? ": " + responseText : "")
                );
            }

            if (!responseText.trim()) {
                throw new Error(
                    "The backend returned an empty response. Check your Java /dologin endpoint."
                );
            }

            let data;

            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(
                    "The backend did not return valid JSON. Check the console response."
                );
            }

            console.log("Login Data:", data);

            // Check the role returned by the backend
            if (data.role === "USER" || data.role === "OWNER") {

                // Save login details
                if (data.id != null) {
                    localStorage.setItem("userId", data.id);
                }

                if (data.fullname) {
                    localStorage.setItem("fullname", data.fullname);
                }

                localStorage.setItem("role", data.role);

                if (data.email) {
                    localStorage.setItem("email", data.email);
                }

                // Redirect according to role
                if (data.role === "USER") {
                    window.location.href = "userdashboard.html";
                } else if (data.role === "OWNER") {
                    window.location.href = "stationownerdashboard.html";
                }

            } else {
                alert(data.message || "Invalid email or password.");
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert(
                "Unable to sign in. " +
                "Please check the browser console for details."
            );
        }
    });


    // ==========================
    // Show / Hide Password
    // ==========================

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

});
