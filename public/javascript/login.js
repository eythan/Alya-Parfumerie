document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Veuillez remplir tous les champs.");
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
            alert("L'email n'est pas enregistré.");
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
                alert("Mot de passe incorrect.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Erreur lors de la connexion.");
        });
    })
    .catch(err => {
        console.error(err);
        alert("Erreur lors de la vérification de l'email.");
    });
});