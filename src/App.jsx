import { useEffect, useState } from 'react';
import { CloudFog, Droplets, Gauge, Search, Wind } from 'lucide-react';
import './App.css';

const API_KEY = '1da56765c1c874776b767cbe97d54eab'; // Replace with your OpenWeatherMap API key
const GLOBAL_CITIES = [
  'London',
  'Tokyo',
  'New York',
  'Dubai',
  'Sydney',
  'Paris',
  'Berlin',
  'Toronto',
  'Singapore',
  'Mumbai',
  'Cape Town',
  'São Paulo',
  'Mexico City',
  'Istanbul',
  'Seoul',
  'Bangkok',
  'Nairobi',
  'Cairo',
  'Buenos Aires',
  'Auckland',
];

const pickRandomCities = (cities, count) => {
  const shuffled = [...cities].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snapshotWeather, setSnapshotWeather] = useState([]);
  const [snapshotLoading, setSnapshotLoading] = useState(true);

  const getCityWeatherData = async (cityName) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();

    return {
      name: data.name,
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      visibility: data.visibility,
      pressure: data.main.pressure,
    };
  };

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const weatherData = await getCityWeatherData(cityName);
      setWeather(weatherData);
    } catch (err) {
      setError('City not found or network error.');
      console.error('FetchWeather error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const handleSnapshotClick = (cityName) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  useEffect(() => {
    const fetchGlobalSnapshot = async () => {
      setSnapshotLoading(true);

      try {
        const selectedCities = pickRandomCities(GLOBAL_CITIES, 4);
        const allWeather = await Promise.all(
          selectedCities.map((cityName) => getCityWeatherData(cityName)),
        );

        setSnapshotWeather(allWeather);
      } catch (err) {
        console.error('Global snapshot fetch error:', err);
        setSnapshotWeather([]);
      } finally {
        setSnapshotLoading(false);
      }
    };

    fetchGlobalSnapshot();
  }, []);

  const visibilityInKm = weather
    ? (weather.visibility / 1000).toFixed(1)
    : null;

  return (
    <main className="app-shell">
      <section className="weather-card">
        <h1 className="app-title">Weather Dashboard</h1>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City name"
          />
          <button type="submit" disabled={loading}>
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>

        {loading ? (
          <p className="loading">Loading weather...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : weather ? (
          <div className="weather-content weather-animate">
            <div className="weather-main">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.condition}
                className="weather-icon"
              />
              <h2 className="weather-temp">{weather.temp}°C</h2>
            </div>

            <p className="city-name">{weather.name}</p>
            <p className="weather-condition">{weather.description}</p>

            <div className="details-section">
              <p className="details-title">Weather Details</p>

              <div className="details-grid">
                <article className="detail-card">
                  <Droplets size={20} className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Humidity</p>
                    <p className="detail-value">{weather.humidity}%</p>
                  </div>
                </article>

                <article className="detail-card">
                  <Wind size={20} className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Wind Speed</p>
                    <p className="detail-value">{weather.wind} m/s</p>
                  </div>
                </article>

                <article className="detail-card">
                  <CloudFog size={20} className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Visibility</p>
                    <p className="detail-value">{visibilityInKm} km</p>
                  </div>
                </article>

                <article className="detail-card">
                  <Gauge size={20} className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Pressure</p>
                    <p className="detail-value">{weather.pressure} hPa</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        ) : (
          <p className="info">Enter a city to view a live weather snapshot.</p>
        )}
      </section>

      <section className="snapshot-section" aria-label="Global Snapshot">
        <h2 className="snapshot-title">Global Snapshot</h2>

        {snapshotLoading ? (
          <p className="snapshot-status">Loading global snapshot...</p>
        ) : (
          <div className="snapshot-grid">
            {snapshotWeather.map((cityWeather) => (
              <button
                key={cityWeather.name}
                type="button"
                className="snapshot-card"
                onClick={() => handleSnapshotClick(cityWeather.name)}
              >
                <p className="snapshot-city">{cityWeather.name}</p>
                <div className="snapshot-weather">
                  <img
                    src={`https://openweathermap.org/img/wn/${cityWeather.icon}.png`}
                    alt={cityWeather.condition}
                    className="snapshot-icon"
                  />
                  <p className="snapshot-temp">{cityWeather.temp}°C</p>
                </div>

                <div
                  className="snapshot-mini-details"
                  aria-label="Snapshot details"
                >
                  <div className="snapshot-mini-item">
                    <Droplets size={12} className="snapshot-mini-icon" />
                    <span className="snapshot-mini-value">
                      {cityWeather.humidity}%
                    </span>
                  </div>

                  <div className="snapshot-mini-item">
                    <Wind size={12} className="snapshot-mini-icon" />
                    <span className="snapshot-mini-value">
                      {cityWeather.wind} m/s
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
