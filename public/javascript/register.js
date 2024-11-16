function validateInput(input) {
    const errorMessage = document.querySelector(`#${input.id}-error`);
    let isValid = true;

    if (input.id === "email") {
        if (!/\S+@\S+\.\S+/.test(input.value)) {
            isValid = false;
            errorMessage.textContent = "Vous devez indiquer une adresse email valide.";
        } else {
            errorMessage.textContent = "";
        }
    }

    if (input.id === "password") {
        if (input.value === "") {
            isValid = false;
            errorMessage.textContent = "Vous devez indiquer un mot de passe.";
        } else if (input.value.length < 8) {
            isValid = false;
            errorMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères.";
        } else if (!/[A-Z]/.test(input.value) || !/[a-z]/.test(input.value) || !/\d/.test(input.value) || !/[!@#$%^&*(),.?":{}|<>]/.test(input.value)) {
            isValid = false;
            errorMessage.textContent = "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.";
        } else {
            errorMessage.textContent = "";
        }
    }

    if (input.id === "firstname") {
        if (input.value === "") {
            isValid = false;
            errorMessage.textContent = "Vous devez indiquer votre prénom.";
        } else {
            errorMessage.textContent = "";
        }
    }

    if (input.id === "lastname") {
        if (input.value === "") {
            isValid = false;
            errorMessage.textContent = "Vous devez indiquer votre nom.";
        } else {
            errorMessage.textContent = "";
        }
    }

    if (isValid) {
        input.classList.add("valid");
        input.classList.remove("invalid");
    } else {
        input.classList.add("invalid");
        input.classList.remove("valid");
    }

    return isValid;
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
            if (!validateInput(input)) {
                input.addEventListener("input", handleRealTimeValidation);
            } else {
                input.removeEventListener("input", handleRealTimeValidation);
            }
        }
    });
});

function handleRealTimeValidation(event) {
    validateInput(event.target);
}

document.querySelector("#register-btn").addEventListener("click", function(event) {
    event.preventDefault();

    const inputs = document.querySelectorAll(".input-group input");
    inputs.forEach(input => {
        input.classList.remove("invalid", "valid");
        const errorMessage = document.querySelector(`#${input.id}-error`);
        if (errorMessage) errorMessage.textContent = "";
    });

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const firstname = document.querySelector("#firstname").value;
    const lastname = document.querySelector("#lastname").value;
    const gender = document.querySelector("input[name='gender']:checked").value;

    let isValid = true;

    if (!validateInput(document.querySelector("#email"))) isValid = false;
    if (!validateInput(document.querySelector("#password"))) isValid = false;
    if (!validateInput(document.querySelector("#firstname"))) isValid = false;
    if (!validateInput(document.querySelector("#lastname"))) isValid = false;

    if (isValid) {
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
            if (data.message === "Compte créé avec succès") {
                window.location.href = "../index.html";
            } else {
                alert("Erreur lors de l'enregistrement : " + data.message);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la communication avec le serveur:", error);
            alert("Erreur serveur, veuillez réessayer plus tard.");
        });
    }
});