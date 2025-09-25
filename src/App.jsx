

import { useState } from 'react';
import './App.css';

const API_KEY = '1da56765c1c874776b767cbe97d54eab'; // Replace with your OpenWeatherMap API key

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      console.log('Fetching:', url);
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeather({
        name: data.name,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
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

  return (
    <div className="weather-app-container">
      <h1>Weather Dashboard</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={e => setCity(e.target.value)}
          aria-label="City name"
        />
        <button type="submit" disabled={loading}>Search</button>
      </form>
      <div className="weather-card">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : weather ? (
          <>
            <h2>{weather.name}</h2>
            <div className="weather-main">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.condition}
                className="weather-icon"
              />
              <span className="weather-temp">{weather.temp}°C</span>
            </div>
            <p className="weather-condition">{weather.condition}</p>
            <div className="weather-details">
              <span>Humidity: {weather.humidity}%</span>
              <span>Wind: {weather.wind} m/s</span>
            </div>
          </>
        ) : (
          <p className="info">Enter a city to see the weather.</p>
        )}
      </div>
    </div>
  );
}

export default App;
