async function validateInput(input) {
    const errorMessage = document.querySelector(`#${input.id}-error`);
    let isValid = true;

    if (input.id === "email") {
        if (!/\S+@\S+\.\S+/.test(input.value)) {
            isValid = false;
            errorMessage.textContent = translations.emailError;
        } else {
            const emailExists = await checkEmailExists(input.value);
            if (emailExists) {
                isValid = false;
                errorMessage.textContent = translations.useemail;
            } else {
                errorMessage.textContent = "";
            }
        }
    }

    if (input.id === "password") {
        if (input.value === "") {
            isValid = false;
            errorMessage.textContent = translations.passwordError;
        } else if (input.value.length < 8) {
            isValid = false;
            errorMessage.textContent = translations.passwordsecure;
        } else if (!/[A-Z]/.test(input.value) || !/[a-z]/.test(input.value) || !/\d/.test(input.value) || !/[!@#$%^&*(),.?":{}|<>]/.test(input.value)) {
            isValid = false;
            errorMessage.textContent = translations.passwordcharacter;
        } else {
            errorMessage.textContent = "";
        }
    }

    if (input.id === "firstname") {
        if (input.value === "") {
            isValid = false;
            errorMessage.textContent = translations.firstnameerror;
        } else {
            if (document.getElementById("lastname").value === input.value) {
                isValid = false;
                errorMessage.textContent = translations.identicalname;
            } else {
                errorMessage.textContent = "";
            }
        }
    }
    
    if (input.id === "lastname") {
        if (input.value === "") {
            isValid = false;
            errorMessage.textContent = translations.lastnameerror;
        } else {
            if (document.getElementById("firstname").value === input.value) {
                isValid = false;
                errorMessage.textContent = translations.identicalname;
            } else {
                errorMessage.textContent = "";
            }
        }
    }
    
    if (isValid) {
        input.classList.add("valid");
        input.classList.remove("invalid");
        input.dataset.invalid = "false";
    } else {
        input.classList.add("invalid");
        input.classList.remove("valid");
        input.dataset.invalid = "true";
    }

    return isValid;
}

async function checkEmailExists(email) {
    try {
        const response = await fetch("/check-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error("Error verifying email:", error);
        return false;
    }
}

const inputs = document.querySelectorAll(".input-group input");

inputs.forEach(input => {
    let hasFocusedOnce = false;

    input.addEventListener("focus", function() {
        if (!hasFocusedOnce) {
            input.dataset.initialValue = input.value;
            hasFocusedOnce = true;
        }
    });

    input.addEventListener("blur", function() {
        if (input.value !== "" || input.dataset.initialValue !== "") {
            validateInput(input);
        }
    });

    input.addEventListener("input", function(event) {
        handleRealTimeValidation(event);
    });
});

function handleRealTimeValidation(event) {
    const input = event.target;
    
    if (input.dataset.invalid === "true") {
        validateInput(input);
    }
}

document.querySelector("#register-btn").addEventListener("click", async function(event) {
    event.preventDefault();

    const inputs = document.querySelectorAll(".input-group input");
    let isValid = true;

    inputs.forEach(input => {
        input.classList.remove("invalid", "valid");
        const errorMessage = document.querySelector(`#${input.id}-error`);
        if (errorMessage) errorMessage.textContent = "";
        input.dataset.invalid = "false";
    });

    const emailInput = document.querySelector("#email");
    if (!(await validateInput(emailInput))) {
        isValid = false;
    }

    const passwordInput = document.querySelector("#password");
    if (!validateInput(passwordInput)) {
        isValid = false;
    }

    const firstnameInput = document.querySelector("#firstname");
    if (!validateInput(firstnameInput)) {
        isValid = false;
    }

    const lastnameInput = document.querySelector("#lastname");
    if (!validateInput(lastnameInput)) {
        isValid = false;
    }

    if (isValid) {
        const email = emailInput.value;
        const password = passwordInput.value;
        const firstname = firstnameInput.value;
        const lastname = lastnameInput.value;
        const gender = document.querySelector("input[name='gender']:checked").value;

        const formData = {
            email,
            password,
            firstname,
            lastname,
            gender
        };

        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Account created successfully") {
                localStorage.setItem("authToken", data.token);
                window.location.href = "../html/account.html";
            } else {
                alert("Registration error: " + data.message);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la communication avec le serveur:", error);
            alert("Server error, please try again later.");
        });
    }
});