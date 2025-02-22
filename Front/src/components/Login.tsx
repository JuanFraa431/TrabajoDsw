import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/logoFinal2.png";
import '../styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, faApple } from '@fortawesome/free-brands-svg-icons';

declare global {
  interface Window {
    google?: any;
  }
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => console.log('Google Identity Services script loaded');
      script.onerror = () => console.error('Error loading Google script');
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await axios.post('/api/cliente/login', { username, password });

      if (response.status === 200) {
        const { usuario, token } = response.data.data;
        if (parseInt(usuario.estado, 10) === 1) {
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

  const handleGoogleLogin = () => {
    if (!window.google) {
      setError('Error al cargar Google. Inténtalo de nuevo.');
      return;
    }

    console.log('Google login clicked');

    window.google.accounts.id.initialize({
      client_id: '1013873914332-sf1up07lqjoch6tork8cpfohi32st8pi.apps.googleusercontent.com',
      callback: async (response: any) => {
        if (!response || !response.credential) {
          console.error('No se recibió un token de Google');
          setError('No se pudo obtener el token de Google.');
          return;
        }

        console.log('Google token received:', response.credential);
        try {
          const res = await axios.post('/api/cliente/auth/google', { token: response.credential });
          if (res.status === 200) {
            const { usuario, token } = res.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(usuario));
            navigate(usuario.tipo_usuario === 'admin' ? '/vistaAdmin' : '/');
          }
        } catch (error) {
          console.error('Google login failed:', error);
          setError('Error al iniciar sesión con Google.');
        }
      },
    });
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.error('Google login prompt not displayed or skipped:', notification);
        setError('Error al mostrar el prompt de Google.');
      } else {
        console.log('Google login prompt displayed successfully');
      }
    });
  };

  return (
    <div className='container-session'>
      <div className='container-image'>
        <Link to="/">
          <img src={logo} alt="Logo" className='logo'/>
        </Link>
      </div>
      <div className='form-session'>
        <div className='left-side'>
          <div className='title-login'>
            <h2>Ingresar a mi cuenta</h2>
          </div>
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
              <button type="submit" className="btn-login">Iniciar Sesión</button>
            </div>
          </form>
        </div>

        <div className='divider'></div>

        <div className='right-side'>
          <div className='social-login'>
            <p>O inicia sesión con</p>
            <button className='google-btn' onClick={handleGoogleLogin}>
              <FontAwesomeIcon icon={faGoogle} /> Google
            </button>
            <button className='facebook-btn' onClick={() => console.log('Implementar login con Facebook')}>
              <FontAwesomeIcon icon={faFacebookF} /> Facebook
            </button>
            <button className='apple-btn' onClick={() => console.log('Implementar login con Apple')}>
              <FontAwesomeIcon icon={faApple} /> Apple
            </button>
          </div>
          <div className='forgot-password'>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className='register-button'>
            <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
