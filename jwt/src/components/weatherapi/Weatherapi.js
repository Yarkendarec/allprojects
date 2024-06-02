import React, { useState } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi'; // Импорт иконок
import './Weatherapi.css'; // Импорт стилей

function Weatherapi() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = '189c86a432384cce820165522242905';

  const getWeather = async () => {
    try {
      const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      setError('Не удалось получить данные о погоде для данного города.');
      setWeatherData(null);
    }
  };

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather();
  };

  // Функция для отображения иконки в зависимости от типа погоды
  const getWeatherIcon = (conditionCode) => {
    switch (conditionCode) {
      case 1000:
        return <WiDaySunny />;
      case 1003:
        return <WiCloudy />;
      case 1063:
      case 1150:
      case 1153:
      case 1240:
      case 1243:
        return <WiRain />;
      case 1066:
      case 1114:
        return <WiSnow />;
      case 1087:
      case 1273:
        return <WiThunderstorm />;
      default:
        return null;
    }
  };

  return (
    <div className="weather-app">
      <h1>Приложение погоды</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={city} onChange={handleChange} placeholder="Введите название города" />
        <button type="submit">Получить погоду</button>
      </form>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <h2>Погода в городе {weatherData.location.name}:</h2>
          <p>Температура: {weatherData.current.temp_c}°C</p>
          <p>Ощущается как: {weatherData.current.feelslike_c}°C</p>
          <p>Скорость ветра: {weatherData.current.wind_kph} км/ч</p>
          <p>Условия: {getWeatherIcon(weatherData.current.condition.code)}</p>
        </div>
      )}
    </div>
  );
}

export default Weatherapi;