import React, { useState } from 'react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Estado para manejar si el usuario es admin

  const onLogin = () => {
    if (username.trim() === '') {
      setError('Por favor, ingresa un nombre de usuario.');
      setIsAdmin(false); // Asegurarse de que no se muestre el mensaje de admin
      return;
    }

    if (username === 'admin') {
      setIsAdmin(true); // Si el usuario es "admin", activamos el estado
      setError(''); // Limpiamos el mensaje de error
    } else {
      setIsAdmin(false); // Si no es "admin", desactivamos el estado
      setError('Usuario no reconocido.'); // Mostramos un mensaje de error
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="login-input"
      />
      {error && <p className="error-message">{error}</p>}
      {isAdmin && <p className="admin-message">¡Bienvenido, Admin!</p>}
      <button onClick={onLogin} className="login-button">
        Login
      </button>
    </div>
  );
};
