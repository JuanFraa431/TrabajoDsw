import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Hook para redireccionar

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/cliente/login/', { username, password });
      const cliente = response.data;

      if (cliente.estado === 1) {
        console.log('Login successful:', cliente);
        setError('');

        if (cliente.tipo_usuario === 'admin') {
          navigate('/vistaAdmin', { state: { cliente } });
        } else {
          navigate('/', { state: { cliente } });
        }
      } else {
        setError('La cuenta ha sido deshabilitada.');
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className='container-session'>
      <div className='form-session'>
      <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <div className='container-button'>
              <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
