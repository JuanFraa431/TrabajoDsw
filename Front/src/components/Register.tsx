import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEntity } from '../services/crudService';
import { Link } from 'react-router-dom';
import logo from "../images/logoFinal2.png";
import '../styles/Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { log } from 'console';

const Register: React.FC = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPasswordLongEnough = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await createEntity('/api/cliente/', {
                nombre: null,
                apellido: null,
                dni: null,
                email,
                fechaNacimiento: null,
                estado: 1,
                username,
                password,
                tipo_usuario: "cliente",
                imagen: null
            });
            setError('');
            navigate('/login');
        } catch (error: any) {
            console.error('Register failed:', error);
            console.log(error.message);
            const errorMessage = error.message;
            setError(errorMessage);
        }
    }


    function togglePasswordVisibility(): void {
        setIsPasswordVisible(!isPasswordVisible);
    }
    return (
        <div className='custom-container-session'>
            <div className='custom-container-image'>
                <Link to="/"><img src={logo} alt="Logo" /></Link>
            </div>
            <div className='custom-form-session'>
                <h2>Crear una cuenta</h2>
                <form onSubmit={handleRegister}>
                    <div className='custom-form-group'>
                        <label>Email</label>
                        <input
                            type="email"
                            className="custom-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='custom-form-group'>
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="custom-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='custom-form-group'>
                        <label>Contraseña</label>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                className="custom-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '30px' }}
                            />
                            <span
                                className="custom-show-password"
                                onClick={togglePasswordVisibility}
                                style={{ position: 'absolute', right: '10px', cursor: 'pointer', color: "gray" }}
                            >
                                {isPasswordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                            </span>
                        </div>
                    </div>

                    <div className="custom-validations">
                        <div className="custom-validation-item">
                            <span className={isPasswordLongEnough ? "valid" : "invalid"}>
                                {isPasswordLongEnough ? "✓" : "✗"} 8 caracteres
                            </span>
                        </div>
                        <div className="custom-validation-item">
                            <span className={hasUpperCase ? "valid" : "invalid"}>
                                {hasUpperCase ? "✓" : "✗"} Una mayúscula
                            </span>
                        </div>
                        <div className="custom-validation-item">
                            <span className={hasNumber ? "valid" : "invalid"}>
                                {hasNumber ? "✓" : "✗"} Un número
                            </span>
                        </div>
                    </div>

                    <div className='custom-terms'>
                        <p>Al crear una cuenta aceptas:</p>
                        <ul>
                            <li><a href="#" className="custom-link">Nuestra política de privacidad.</a></li>
                            <li><a href="#" className="custom-link">Recibir ofertas y recomendaciones por email.</a></li>
                        </ul>
                    </div>

                    {error && <p className="custom-error-message">{error}</p>}

                    <button type="submit" className="custom-button">Crear una cuenta</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
