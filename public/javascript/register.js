function validateInput(input) {
    const errorMessage = document.querySelector(`#${input.id}-error`);
    let isValid = true;

    if (input.id === "email") {
        if (!/\S+@\S+\.\S+/.test(input.value)) {
            isValid = false;
            input.classList.add("invalid");
            input.classList.remove("valid");
            errorMessage.textContent = "Vous devez indiquer une adresse email valide.";
        } else {
            input.classList.add("valid");
            input.classList.remove("invalid");
            errorMessage.textContent = "";
        }
    }

    if (input.id === "password") {
        if (input.value.length < 6) {
            isValid = false;
            input.classList.add("invalid");
            input.classList.remove("valid");
            errorMessage.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
        } else {
            input.classList.add("valid");
            input.classList.remove("invalid");
            errorMessage.textContent = "";
        }
    }

    if (input.id === "firstname") {
        if (input.value === "") {
            isValid = false;
            input.classList.add("invalid");
            input.classList.remove("valid");
            errorMessage.textContent = "Vous devez indiquer votre prénom.";
        } else {
            input.classList.add("valid");
            input.classList.remove("invalid");
            errorMessage.textContent = "";
        }
    }

    if (input.id === "lastname") {
        if (input.value === "") {
            isValid = false;
            input.classList.add("invalid");
            input.classList.remove("valid");
            errorMessage.textContent = "Vous devez indiquer votre nom.";
        } else {
            input.classList.add("valid");
            input.classList.remove("invalid");
            errorMessage.textContent = "";
        }
    }

    return isValid;
}

const inputs = document.querySelectorAll(".input-group input");
inputs.forEach(input => {
    input.addEventListener("input", function() {
        validateInput(input);
    });
});

inputs.forEach(input => {
    input.addEventListener("blur", function() {
        validateInput(input);
    });
});

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
                alert("Erreur lors de l\"enregistrement : " + data.message);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la communication avec le serveur:", error);
            alert("Erreur serveur, veuillez réessayer plus tard.");
        });
    }
});
