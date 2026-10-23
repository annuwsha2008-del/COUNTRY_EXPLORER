

const params = new URLSearchParams(window.location.search);

const countryName = params.get("name") || "";
const flag = params.get("flag") || "";
const population = params.get("population") || "";
const region = params.get("region") || "";
const subRegion = params.get("subRegion") || "";
const capital = params.get("capital") || "";
const currencies = params.get("currencies") || "";
const languages = params.get("languages") || "";

document.getElementById("country-name").textContent =
    countryName;

document.getElementById("official-name").textContent =
    countryName;

document.getElementById("country-population").textContent =
    population ? Number(population).toLocaleString() : "N/A";

document.getElementById("country-region").textContent =
    region || "N/A";

document.getElementById("country-subregion").textContent =
    subRegion || "N/A";

document.getElementById("country-capital").textContent =
    capital || "N/A";

document.getElementById("country-currencies").textContent =
    currencies || "N/A";

document.getElementById("country-languages").textContent =
    languages || "N/A";

const countryFlag = document.getElementById("country-flag");

if (flag) {
    countryFlag.src = flag;
    countryFlag.alt = `${countryName} flag`;
} else {
    countryFlag.style.display = "none";
}
