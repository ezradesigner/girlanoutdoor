// List of available cities (replace with your actual cities)
const availableCities = [
    "Alagoinhas", "Barreiras", "Camaçari", "Eunápolis", "Feira de Santana", "Ilhéus", "Itabuna", "Jequié", "Juazeiro", "Lauro de Freitas",
    "Paulo Afonso", "Porto Seguro", "Salvador", "Simões Filho", "Teixeira de Freitas", "Vitória da Conquista"
];

const cityInput = document.getElementById('cityInput');
const autocompleteResults = document.getElementById('autocompleteResults');
const clearIcon = document.getElementById('clearSearch');

// Show autocomplete results
cityInput.addEventListener('input', function () {
    clearIcon.classList.toggle('visible', this.value.length > 0);
    const input = this.value.toLowerCase();
    autocompleteResults.innerHTML = '';
    if (input.length < 1) {
        autocompleteResults.style.display = 'none';
        return;
    }
    const filteredCities = availableCities.filter(city =>
        city.toLowerCase().includes(input)
    );
    if (filteredCities.length > 0) {
        document.getElementById('searchError').style.display = 'none';
        filteredCities.forEach(city => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.textContent = city;
            div.addEventListener('click', function () {
                cityInput.value = city;
                autocompleteResults.style.display = 'none';
                setTimeout(() => {
                    window.location.href = `/cidades/${city.toLowerCase().replace(/\s+/g, '-')}.html`;
                }, 120);
            });
            autocompleteResults.appendChild(div);
        });
        autocompleteResults.style.display = 'block';
    } else {
        autocompleteResults.style.display = 'none';
    }
});

// Hide autocomplete when clicking outside
document.addEventListener('click', function (e) {
    if (e.target !== cityInput) {
        autocompleteResults.style.display = 'none';
    }
});

// Clear input when X is clicked
clearIcon.addEventListener('click', function () {
    cityInput.value = '';
    cityInput.focus();
    clearIcon.classList.remove('visible');
    autocompleteResults.style.display = 'none';
    document.getElementById('searchError').style.display = 'none';
});

// Search functionality
cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        autocompleteResults.style.display = 'none';
        searchCity();
    }
});

function searchCity() {
    const city = cityInput.value.trim();
    const errorElement = document.getElementById('searchError');
    errorElement.style.display = 'none';
    errorElement.textContent = '';

    const foundCity = availableCities.find(availableCity =>
        availableCity.toLowerCase() === city.toLowerCase()
    );
    if (foundCity) {
        // Redirect to city page
        window.location.href = `/cidades/${foundCity.toLowerCase().replace(/\s+/g, '-')}`;
    } else {
        errorElement.textContent = 'Por favor, selecione uma cidade válida da lista.';
        errorElement.style.display = 'block';
    }
}
