document.addEventListener("DOMContentLoaded", function() {
    const storedLanguage = localStorage.getItem("selectedLanguage") || "fr";
    loadLanguage(storedLanguage);

    const languageButton = document.querySelector(".language");
    if (languageButton) {
        const dropdownItems = document.querySelectorAll(".language-dropdown ul li");
        dropdownItems.forEach(item => {
            if (item.getAttribute("data-code") === storedLanguage) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        });

        languageButton.addEventListener("click", function() {
            const dropdown = document.querySelector(".language-dropdown");
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", function(event) {
            const dropdown = document.querySelector(".language-dropdown");
            if (!languageButton.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = "none";
            }
        });

        document.querySelectorAll(".language-dropdown ul li").forEach(item => {
            item.addEventListener("click", function() {
                const language = this.getAttribute("data-code");
                loadLanguage(language);
                localStorage.setItem("selectedLanguage", language);
            });
        });
    }
});

function loadLanguage(language) {
    fetch(`../translations/${language}.json`)
        .then(response => response.json())
        .then(data => {
            applyTranslations(data);
            document.body.classList.add("translated");
        })
        .catch(error => console.error("Error loading language:", error));
}

function applyTranslations(data) {
    document.querySelectorAll("[data-translate]").forEach(item => {
        const translationKey = item.getAttribute("data-translate");
        if (data[translationKey]) {
            item.textContent = data[translationKey];
        }
    });
}
