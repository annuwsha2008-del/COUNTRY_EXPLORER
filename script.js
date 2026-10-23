
const countryCardsContainer = document.getElementById("country-cards-container");
const countryNameInput = document.getElementById("country-name");
const regionInput = document.getElementById("region");
const populationInput = document.getElementById("population");
const showMoreButton = document.getElementById("show-more");
const errorMessage = document.getElementById("error-message");
const noResults = document.getElementById("no-results");
const backButton = document.getElementById("back-button");

const countriesPerPage = 12;
const countriesPerClick = 10;

let allCountries = Array.isArray(data) ? data : [];
let filteredCountries = [...allCountries];
let displayCount = countriesPerPage;

// Get a country's display name safely.
function getCountryName(country) {
  if (typeof country.name === "string") {
    return country.name;
  }

  return country.name?.common || country.name?.official || "Unknown";
}

// Support both string values and objects with a name property.
function getFormattedNames(items) {
  if (!items) return "";

  return Object.values(items)
    .map(item => typeof item === "string" ? item : item?.name)
    .filter(Boolean)
    .join(", ");
}

// Navigate to the Details page.
function countryCardHandler(country) {
  const params = new URLSearchParams({
    name: country.name?.official || getCountryName(country),
    flag: country.flags?.svg || country.flags?.png || "",
    population: String(country.population ?? 0),
    region: country.region || "",
    subRegion: country.subregion || "",
    capital: (country.capital || []).join(", "),
    currencies: getFormattedNames(country.currencies),
    languages: getFormattedNames(country.languages)
  });

  window.location.href = `detail.html?${params.toString()}`;
}

// Display the currently filtered countries.
function populateCountryCards() {
  countryCardsContainer.innerHTML = "";

  noResults.style.display =
    filteredCountries.length === 0 ? "block" : "none";

  if (filteredCountries.length === 0) {
    showMoreButton.style.display = "none";
    return;
  }

  const countriesToDisplay = filteredCountries.slice(0, displayCount);

  countriesToDisplay.forEach(country => {
    const card = document.createElement("div");
    card.classList.add("country-card");
    card.style.cursor = "pointer";

    const flag = document.createElement("img");
    flag.src = country.flags?.png || country.flags?.svg || "";
    flag.alt = `${getCountryName(country)} flag`;

    const heading = document.createElement("h2");
    heading.textContent = getCountryName(country);

    const population = document.createElement("p");
    population.innerHTML = "<strong>Population:</strong> ";
    population.append(
      Number(country.population || 0).toLocaleString()
    );

    const region = document.createElement("p");
    region.innerHTML = "<strong>Region:</strong> ";
    region.append(country.region || "N/A");

    const capital = document.createElement("p");
    capital.innerHTML = "<strong>Capital:</strong> ";
    capital.append((country.capital || ["N/A"]).join(", "));

    card.append(flag, heading, population, region, capital);

    card.addEventListener("click", () => {
      countryCardHandler(country);
    });

    countryCardsContainer.appendChild(card);
  });

  showMoreButton.style.display =
    displayCount < filteredCountries.length ? "block" : "none";
}

// Filter countries using all three fields.
function filterData() {
  const nameValue = countryNameInput.value.trim();
  const regionValue = regionInput.value;
  const populationValue = populationInput.value.trim();

  // Unicode letters are allowed, including names such as Åland Islands.
  // A hyphen is allowed, so "la-" produces a normal no-results search.
  const validNamePattern = /^[\p{L}\s'-]*$/u;

  // Invalid name input must not change the displayed country cards.
  if (!validNamePattern.test(nameValue)) {
    errorMessage.textContent =
      "Please enter a valid country name.";
    errorMessage.style.display = "block";
    return;
  }

  if (
    populationValue !== "" &&
    (
      !Number.isFinite(Number(populationValue)) ||
      Number(populationValue) < 0 ||
      Number(populationValue) > 1500000000
    )
  ) {
    errorMessage.textContent =
      "Enter a population between 0 and 1.5 billion.";
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  const searchName = nameValue.toLocaleLowerCase();

  filteredCountries = allCountries.filter(country => {
    const countryName = getCountryName(country).toLocaleLowerCase();

    const matchesName =
      countryName.includes(searchName);

    const matchesRegion =
      regionValue === "All Regions" ||
      country.region === regionValue;

    // Population is a maximum limit.
    const matchesPopulation =
      populationValue === "" ||
      Number(country.population) <= Number(populationValue);

    return matchesName && matchesRegion && matchesPopulation;
  });

  // Every new search starts at the first 12 matching countries.
  displayCount = countriesPerPage;
  populateCountryCards();
}

// Add exactly ten more cards on each click.
function showMoreHandler() {
  displayCount += countriesPerClick;
  populateCountryCards();
}

// Return to the previous page.
function backButtonHandler() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "index.html";
  }
}

// Register events once the HTML is ready.
document.addEventListener("DOMContentLoaded", () => {
  countryNameInput.addEventListener("input", filterData);
  regionInput.addEventListener("change", filterData);
  populationInput.addEventListener("input", filterData);

  showMoreButton.addEventListener("click", showMoreHandler);

  // The Back button is for the Details page, not the main page.
  backButton.style.display = "none";

  // Initial page load: first 12 countries.
  populateCountryCards();
});


