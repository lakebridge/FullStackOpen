import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import "./App.css";
import { useEffect } from "react";
import countriesService from "../services/countries";
import weatherService from "../services/weather";

const SearchCountry = ({ search, setSearch, setShowCountryInfo }) => {
  return (
    <div>
      Find Country:{" "}
      <input
        type="text"
        placeholder="Search for a country..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowCountryInfo(null);
        }}
      />
    </div>
  );
};

const ShowWeather = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService.getWeather(lat, lon).then((data) => {
      setWeather(data);
    });
  }, [lat, lon]);

  if (!weather) {
    return <p>Loading weather data...</p>;
  }

  return (
    <div>
      <h3>Weather in {weather.name}</h3>
      <p>
        <strong>Temperature:</strong> {weather.main.temp} °C
      </p>
      <p>
        {weather.weather[0].icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
        )}
      </p>
      <p>
        <strong>Weather:</strong> {weather.weather[0].description}
      </p>
      <p>
        <strong>Wind:</strong> {weather.wind.speed} m/s
      </p>
    </div>
  );
};

const ShowCountryInfo = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>
        <strong>Capital:</strong> {country.capital}
      </p>
      <p>
        <strong>Population:</strong> {country.population}
      </p>
      <p>
        <strong>Languages:</strong>{" "}
        {Object.values(country.languages).join(", ")}
      </p>
      <img
        border="1"
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
      />
      <ShowWeather lat={country.latlng[0]} lon={country.latlng[1]} />
    </div>
  );
};

const CountryList = ({ search, countries, setShowCountryInfo }) => {
  const countriesToShow =
    search === ""
      ? countries
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(search.toLowerCase()),
        );
  if (search === "") {
    return (
      <>
        <p>Please enter a search term to find countries.</p>
        {countries.length > 0 && (
          <ul>
            {countries.map((country) => (
              <li className="country-item" key={country.cca3}>
                {country.name.common}{" "}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  } else if (countriesToShow.length === 0) {
    return <p>No countries found.</p>;
  } else if (countriesToShow.length > 10) {
    return <p>Too many matches, specify another filter.</p>;
  } else if (countriesToShow.length > 1 && countriesToShow.length <= 10) {
    return (
      <ul>
        {countriesToShow.map((country) => (
          <li className="country-item" key={country.cca3}>
            {country.name.common}{" "}
            <button onClick={() => setShowCountryInfo(country)}>
              Show Info
            </button>
          </li>
        ))}
      </ul>
    );
  } else if (countriesToShow.length === 1) {
    const country = countriesToShow[0];
    return <ShowCountryInfo country={country} />;
  }
};

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [showCountryInfo, setShowCountryInfo] = useState(null);

  useEffect(() => {
    // Fetch data from an API or perform any side effects here
    countriesService.getAll().then((data) => {
      setCountries(data);
    });
  }, []);

  return (
    <>
      <section id="center">
        <h1>Data for Countries</h1>

        <SearchCountry
          search={search}
          setSearch={setSearch}
          setShowCountryInfo={setShowCountryInfo}
        />
        <CountryList
          search={search}
          countries={countries}
          setShowCountryInfo={setShowCountryInfo}
        />
        {showCountryInfo && <ShowCountryInfo country={showCountryInfo} />}
      </section>

      {/* <section id="country-list"> */}

      {/* </section> */}

      <section id="spacer"></section>
    </>
  );
}

export default App;
