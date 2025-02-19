import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/logoFinal2.png";
import '../styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, faApple } from '@fortawesome/free-brands-svg-icons';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();  

    try {
      const response = await axios.post('/api/cliente/login', { username, password });
      
      if (response.status === 200) {
        const { usuario, token } = response.data.data;

        const est = parseInt(usuario.estado, 10);
        if (est === 1) {
          setError('');
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(usuario));

          navigate(usuario.tipo_usuario === 'admin' ? '/vistaAdmin' : '/');
        } else {
          setError('La cuenta ha sido deshabilitada.');
        }
      } else {
        setError('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Error al iniciar sesión, por favor intente nuevamente.');
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Iniciar sesión con ${provider}`);
    // Aquí puedes integrar la lógica de autenticación con Google, Facebook y Apple
  };

  return (
    <div className='container-session'>
      <div className='container-image'>
        <Link to="/">
          <img src={logo} alt="Logo" className='logo'/>
        </Link>
      </div>
      <div className='form-session'>
        <h2>Ingresar a mi cuenta</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Usuario:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="container-button">
            <button type="submit" className="btn-login">Iniciar Sesion</button>
          </div>
        </form>

        <div className='social-login'>
          <p>O inicia sesión con</p>
          <button className='google-btn' onClick={() => handleSocialLogin('Google')}> <FontAwesomeIcon icon={faGoogle} /> Google</button>
          <button className='facebook-btn' onClick={() => handleSocialLogin('Facebook')}> <FontAwesomeIcon icon={faFacebookF} /> Facebook</button>
          <button className='apple-btn' onClick={() => handleSocialLogin('Apple')}> <FontAwesomeIcon icon={faApple} /> Apple</button>
        </div>
        <div className='forgot-password'>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>
        <div className='register-button'>
          <p>¿No tenes cuenta? <Link to="/register">Regístrate</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
