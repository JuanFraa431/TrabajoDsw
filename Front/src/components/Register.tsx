import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEntity } from '../services/crudService';
import { Link } from 'react-router-dom';
import logo from "../images/logoFinal2.png";
import '../styles/Register.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
                username: null,
                password,
                tipo_usuario: "cliente",
                imagen:null
            });
            setError('');
            navigate('/login');
        } catch (error) {
            console.error('Register failed:', error);
            setError('Error al registrarse, por favor intente nuevamente.');
        }
    }

    function togglePasswordVisibility(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
        const passwordInput = event.currentTarget.previousElementSibling as HTMLInputElement;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            event.currentTarget.textContent = 'OCULTAR';
        } else {
            passwordInput.type = 'password';
            event.currentTarget.textContent = 'MOSTRAR';
        }
    }

    return (
        <div className='container-session'>
    <div className='container-image'>
        <Link to="/"><img src={logo} alt="Logo" /></Link>
    </div>
    <div className='form-session'>
        <h2>Crear una cuenta</h2>
        <form onSubmit={handleRegister}>
            <div className='form-group'>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className='form-group'>
                <label>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <span className="show-password" onClick={togglePasswordVisibility}>MOSTRAR</span>
            </div>

            <div className='password-criteria'>
                <p>8 caracteres</p>
                <p>Una mayúscula</p>
                <p>Un número</p>
            </div>

            <div className='terms'>
                <p>Al crear una cuenta aceptas:</p>
                <ul>
                    <li><a href="#">Nuestra política de privacidad.</a></li>
                    <li><a href="#">Recibir ofertas y recomendaciones por email.</a></li>
                </ul>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit">Crear una cuenta</button>
        </form>
    </div>
</div>

    );
};

export default Register;
