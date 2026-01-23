/* =========================
   GLOBAL ELEMENTS
========================= */
const cardsArea = document.getElementById("cards");
const getSearch = document.getElementById("searchInput");
const locBtn = document.getElementById("locBtn");
const recentSearchesList = document.getElementById("recentSearches");
let recentSearches = [];

// Load recent searches from localStorage
if (localStorage.getItem('recentSearches')) {
    recentSearches = JSON.parse(localStorage.getItem('recentSearches'));
    updateRecentSearches();
}

// Add event listeners
getSearch.addEventListener("keypress", function(e) {
    if (e.key === 'Enter') {
        searchCountry();
    }
});

locBtn.addEventListener("click", getLocation);

/* =========================
   1. GEOLOCATION DETECTION
========================= */
function getLocation() {
    if (!navigator.geolocation) {
        showNotification("Geolocation is not supported", "error");
        return;
    }

    locBtn.innerHTML = '<span class="loading"></span> Detecting...';
    locBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            getCountryFromCoords(latitude, longitude);
            locBtn.innerHTML = '📍 Get My Country';
            locBtn.disabled = false;
        },
        () => {
            showNotification("Please allow location access", "warning");
            locBtn.innerHTML = '📍 Get My Country';
            locBtn.disabled = false;
        }
    );
}

/* =========================
   2. COUNTRY FROM COORDS
========================= */
function getCountryFromCoords(lat, lon) {
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        .then(res => res.json())
        .then(data => {
            if (!data.countryName) {
                showNotification("Country not detected", "error");
                return;
            }
            fetchCountryDetails(data.countryName);
        })
        .catch(() => {
            showNotification("Failed to detect country", "error");
        });
}

/* =========================
   3. SEARCH COUNTRY
========================= */
function searchCountry() {
    const searchTerm = getSearch.value.trim();

    if (!searchTerm) {
        showNotification("Please enter a country name", "info");
        return;
    }

    // Add to recent searches
    if (!recentSearches.includes(searchTerm.toLowerCase())) {
        recentSearches.unshift(searchTerm.toLowerCase());
        if (recentSearches.length > 5) recentSearches.pop();
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        updateRecentSearches();
    }

    fetchCountryDetails(searchTerm);
    getSearch.value = "";
}

/* =========================
   4. UPDATE RECENT SEARCHES
========================= */
function updateRecentSearches() {
    if (!recentSearchesList) return;
    
    recentSearchesList.innerHTML = '';
    recentSearches.forEach(search => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-search icon"></i> ${search}`;
        li.onclick = () => fetchCountryDetails(search);
        recentSearchesList.appendChild(li);
    });
}

/* =========================
   5. FETCH COUNTRY DETAILS
========================= */
function fetchCountryDetails(country) {
    cardsArea.innerHTML = `
        <div class="hero-card">
            <div class="hero-content" style="text-align: center; padding: 4rem;">
                <div class="loading" style="width: 40px; height: 40px; margin: 0 auto 2rem;"></div>
                <h3>Discovering ${country}...</h3>
            </div>
        </div>
    `;

    fetch(`https://restcountries.com/v3.1/name/${country}`)
        .then(res => res.json())
        .then(data => {
            renderMainCountry(data[0]);

            const borders = data[0].borders;
            if (borders && borders.length > 0) {
                fetchNeighborCountries(borders);
            } else {
                cardsArea.innerHTML += `
                    <div class="neighbors-section">
                        <h3><i class="fas fa-users icon"></i> Neighbors</h3>
                        <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
                            No neighboring countries found
                        </p>
                    </div>
                `;
            }
        })
        .catch(() => {
            showNotification("Country not found", "error");
            cardsArea.innerHTML = '';
        });
}

/* =========================
   6. RENDER MAIN COUNTRY
========================= */
function renderMainCountry(country) {
    const languages = country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A";

    const currencies = country.currencies
        ? Object.values(country.currencies)
              .map(cur => `${cur.name} (${cur.symbol})`)
              .join(", ")
        : "N/A";

    const demonym = country.demonyms?.eng?.m || "N/A";
    const populationDensity = country.area
        ? (country.population / country.area).toFixed(2)
        : "N/A";

    cardsArea.innerHTML = `
        <div class="hero-card">
            <img src="${country.flags.png || country.flags.svg}" class="hero-flag" alt="${country.name.common} Flag">
            <div class="hero-content">
                <div class="hero-header">
                    <div>
                        <h1 class="hero-title">${country.name.common}</h1>
                        <p class="hero-subtitle">${country.name.official}</p>
                    </div>
                    <div class="hero-badges">
                        ${country.unMember ? '<span class="badge badge-un">UN Member</span>' : ''}
                        ${country.independent ? '<span class="badge badge-ind">Independent</span>' : ''}
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-card-title">Population</div>
                        <div class="stat-card-value">${(country.population / 1000000).toFixed(1)}<span class="stat-card-unit">M</span></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-title">Area</div>
                        <div class="stat-card-value">${(country.area / 1000).toFixed(0)}<span class="stat-card-unit">k km²</span></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-title">Capital</div>
                        <div class="stat-card-value">${country.capital?.[0] || "N/A"}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-title">Region</div>
                        <div class="stat-card-value">${country.region}</div>
                    </div>
                </div>

                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Languages</span>
                        <span class="detail-value">${languages}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Currencies</span>
                        <span class="detail-value">${currencies}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Demonym</span>
                        <span class="detail-value">${demonym}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time Zones</span>
                        <span class="detail-value">${country.timezones.join(", ")}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Top-Level Domain</span>
                        <span class="detail-value">${country.tld?.join(", ") || "N/A"}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Driving Side</span>
                        <span class="detail-value">${country.car?.side || "N/A"}</span>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-card-title">Population Density</div>
                        <div class="stat-card-value">${populationDensity}<span class="stat-card-unit">/km²</span></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-title">Neighbors</div>
                        <div class="stat-card-value">${country.borders?.length || 0}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-title">Latitude</div>
                        <div class="stat-card-value">${country.latlng?.[0] || "N/A"}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-title">Longitude</div>
                        <div class="stat-card-value">${country.latlng?.[1] || "N/A"}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* =========================
   7. FETCH NEIGHBOR COUNTRIES
========================= */
function fetchNeighborCountries(borderCodes) {
    fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`)
        .then(res => res.json())
        .then(data => {
            renderNeighborCountries(data);
        })
        .catch(() => {
            cardsArea.innerHTML += `
                <div class="neighbors-section">
                    <h3><i class="fas fa-users icon"></i> Neighbors</h3>
                    <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
                        Failed to load neighboring countries
                    </p>
                </div>
            `;
        });
}

/* =========================
   8. RENDER NEIGHBOR COUNTRIES
========================= */
function renderNeighborCountries(countries) {
    cardsArea.innerHTML += `
        <div class="neighbors-section">
            <h3><i class="fas fa-users icon"></i> Neighboring Countries</h3>
            <div class="neighbors-grid">
    `;

    countries.forEach(country => {
        cardsArea.innerHTML += `
            <div class="neighbor-card">
                <img src="${country.flags.png}" class="neighbor-flag" alt="${country.name.common} Flag">
                <div class="neighbor-name">${country.name.common}</div>
                <div class="neighbor-info">
                    <i class="fas fa-city icon"></i>
                    ${country.capital?.[0] || "N/A"}
                </div>
                <div class="neighbor-info">
                    <i class="fas fa-globe icon"></i>
                    ${country.region}
                </div>
            </div>
        `;
    });

    cardsArea.innerHTML += `
            </div>
        </div>
    `;
}

/* =========================
   9. NOTIFICATION SYSTEM
========================= */
function showNotification(message, type = "info") {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#cf6679' : type === 'warning' ? '#ffb74d' : '#03dac6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease-out;
    `;
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);