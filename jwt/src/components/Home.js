import React from 'react';

const Home = () => {
  // Функция для выхода из авторизации
  const handleLogout = () => {
    // Удаление токена из LocalStorage
    localStorage.removeItem('token');
    // Перенаправление на страницу входа
    window.location.href = '/signin';
  };

  

  // Функция для перехода на страницу калькулятора
  const goToCalculator = () => {
    window.location.href = '/calculator';
  };

  // Функция для перехода на страницу крестиков-ноликов
  const goToTicTacToe = () => {
    window.location.href = '/tictactoe';
  };

  // Функция для перехода на страницу списка дел
  const goToList = () => {
    window.location.href = '/todolist';
  };

  // Функция для перехода на страницу с погодой
  const goToWeather = () => {
    window.location.href = '/weatherapi';
  };

  return (
    <div>
      <h2>Добро пожаловать на первоначальную страницу</h2>
      {/* Кнопка для выхода из авторизации */}
      <button onClick={handleLogout}>Выход из авторизации</button>

      {/* Квадраты-кнопки для перехода на другие проекты */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div style={buttonStyle} onClick={goToCalculator}>Калькулятор</div>
        <div style={buttonStyle} onClick={goToTicTacToe}>Крестики-нолики</div>
        <div style={buttonStyle} onClick={goToList}>Список дел</div>
        <div style={buttonStyle} onClick={goToWeather}>Погода</div>
      </div>
    </div>
  );
};

// Стили для кнопок
const buttonStyle = {
    width: '200px',
    height: '50px',
    backgroundColor: '#ADD8E6',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
}

export default Home;