import { useEffect, useState } from "react";

const STORAGE_KEY = "weather-dashboard-recent-searches";

function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(searches) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export default function App() {
  const [city, setCity] = useState("");
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    saveRecentSearches(recentSearches);
  }, [recentSearches]);

  async function fetchWeather(nextCity) {
    const queryCity = nextCity.trim();
    if (!queryCity) {
      setError("Enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(queryCity)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setWeather(data);
      setRecentSearches((current) => {
        const next = [queryCity, ...current.filter((item) => item.toLowerCase() !== queryCity.toLowerCase())].slice(0, 5);
        return next;
      });
    } catch (err) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetchWeather(city);
  }

  function handleRecentClick(value) {
    setCity(value);
    fetchWeather(value);
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    setWeather(null);
    setError("");
  }

  return (
    <main className="app-shell">
      <header className="app-bar">
        <div>
          <p className="eyebrow">Weather Companion</p>
          <h1>Simple weather, in a cleaner app shell.</h1>
          <p className="subtext">
            Search any city, view the current conditions, and jump back to recent places in one place.
          </p>
        </div>
        <div className="status-pill">Live API</div>
      </header>

      <section className="hero-card panel">
        <div className="hero-copy">
          <p className="section-label">Search</p>
          <h2>Enter a city to load the current weather.</h2>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Type a city name"
            aria-label="City name"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="dashboard-grid">
        <article className="panel weather-panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Now</p>
              <h2>Current Weather</h2>
            </div>
            {weather ? <span className="status-chip">{weather.weatherDescription}</span> : null}
          </div>
          {weather ? (
            <div className="weather-card">
              <div className="weather-hero">
                <div className="weather-orb" aria-hidden="true" />
                <div>
                <p className="city-name">{weather.city}</p>
                <p className="description">{weather.weatherDescription}</p>
                </div>
              </div>
              <div className="temperature-row">
                <span className="temperature">{weather.temperature}°C</span>
                <div className="meta-stack">
                  <span className="meta">Wind {weather.windspeed} km/h</span>
                  <span className="meta">Updated {weather.time}</span>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">City</span>
                  <span className="stat-value">{weather.city}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Condition</span>
                  <span className="stat-value">{weather.weatherDescription}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Wind</span>
                  <span className="stat-value">{weather.windspeed} km/h</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Code</span>
                  <span className="stat-value">{weather.weatherCode}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Search for a city to see the weather.</p>
              <p className="meta">Try Nairobi, Kisumu, Mombasa, or anywhere else.</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">History</p>
              <h2>Recent Searches</h2>
            </div>
            {recentSearches.length ? (
              <button type="button" className="ghost-button" onClick={clearRecentSearches}>
                Clear
              </button>
            ) : null}
          </div>
          {recentSearches.length ? (
            <ul className="recent-list">
              {recentSearches.map((item) => (
                <li key={item}>
                  <button type="button" className="recent-button" onClick={() => handleRecentClick(item)}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">Your last 5 searches will appear here.</p>
          )}
        </article>
      </section>
    </main>
  );
}
