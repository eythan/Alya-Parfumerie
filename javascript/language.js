document.addEventListener('DOMContentLoaded', function() {
    const storedLanguage = localStorage.getItem('selectedLanguage') || 'fr';
    loadLanguage(storedLanguage);

    const dropdownItems = document.querySelectorAll('.language-dropdown ul li');
    dropdownItems.forEach(item => {
        if (item.getAttribute('data-code') === storedLanguage) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
});

document.querySelector('.language').addEventListener('click', function() {
    const dropdown = document.querySelector('.language-dropdown');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
});

document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.language-dropdown');
    const languageButton = document.querySelector('.language');
    if (!languageButton.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

document.querySelectorAll('.language-dropdown ul li').forEach(item => {
    item.addEventListener('click', function() {
        const language = this.getAttribute('data-code');
        loadLanguage(language);

        localStorage.setItem('selectedLanguage', language);
    });
});

function loadLanguage(language) {
    fetch(`../translations/${language}.json`)
        .then(response => response.json())
        .then(data => {
            applyTranslations(data);
            document.body.classList.add('translated');
        })
        .catch(error => console.error('Error loading language:', error));
}

function applyTranslations(data) {
    document.querySelectorAll('[data-translate]').forEach(item => {
        const translationKey = item.getAttribute('data-translate');
        if (data[translationKey]) {
            item.textContent = data[translationKey];
        }
    });
}
