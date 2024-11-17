function isValidEmail(email) {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    return password.length >= 1;
}

let emailWasInvalid = false;
let passwordWasInvalid = false;

document.getElementById("email").addEventListener("blur", function() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    
    if (isValidEmail(emailInput.value)) {
        emailInput.classList.add("valid");
        emailInput.classList.remove("invalid");
        emailError.textContent = "";
        emailWasInvalid = false;
    } else {
        emailInput.classList.add("invalid");
        emailInput.classList.remove("valid");
        emailError.textContent = translations.emailError
        emailWasInvalid = true;
    }
});

document.getElementById("email").addEventListener("input", function() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");

    if (emailWasInvalid) {
        if (isValidEmail(emailInput.value)) {
            emailInput.classList.add("valid");
            emailInput.classList.remove("invalid");
            emailError.textContent = "";
            emailWasInvalid = false;
        } else {
            emailInput.classList.add("invalid");
            emailInput.classList.remove("valid");
            emailError.textContent = translations.emailError
        }
    }
});

document.getElementById("password").addEventListener("blur", function() {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("password-error");

    if (isValidPassword(passwordInput.value)) {
        passwordInput.classList.add("valid");
        passwordInput.classList.remove("invalid");
        passwordError.textContent = "";
        passwordWasInvalid = false;
    } else {
        passwordInput.classList.add("invalid");
        passwordInput.classList.remove("valid");
        passwordError.textContent = translations.passwordError
        passwordWasInvalid = true;
    }
});

document.getElementById("password").addEventListener("input", function() {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("password-error");

    if (passwordWasInvalid) {
        if (isValidPassword(passwordInput.value)) {
            passwordInput.classList.add("valid");
            passwordInput.classList.remove("invalid");
            passwordError.textContent = "";
            passwordWasInvalid = false;
        } else {
            passwordInput.classList.add("invalid");
            passwordInput.classList.remove("valid");
            passwordError.textContent = translations.passwordError
        }
    }
});

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const loginErrorMessage = document.getElementById("login-error-message");

    emailError.textContent = "";
    passwordError.textContent = "";

    let formIsValid = true;

    if (!email || !password) {
        loginErrorMessage.textContent = translations.identicalerror;
        document.getElementById('login-message-error').style.display = 'block';
        formIsValid = false;
    }

    if (!isValidEmail(email)) {
        emailError.textContent = translations.emailError;
        formIsValid = false;
    }

    if (!isValidPassword(password)) {
        passwordError.textContent = translations.passwordError;
        formIsValid = false;
    }

    if (!formIsValid) {
        return;
    }

    fetch("/check-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.exists) {
            loginErrorMessage.textContent = translations.identicalerror;
            document.getElementById('login-message-error').style.display = 'block';
            return;
        }

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("authToken", data.token);
                window.location.href = "../html/account.html";
            } else {
                loginErrorMessage.textContent = translations.identicalerror;
                document.getElementById('login-message-error').style.display = 'block';
            }
        })
        .catch(err => {
            console.error(err);
            alert("Connection error.");
        });
    })
    .catch(err => {
        console.error(err);
        alert("Error verifying email.");
    });
});
