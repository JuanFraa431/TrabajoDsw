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
                username,
                password,
                nombre,
                apellido,
                dni,
                email,
                estado: 1,
                tipo_usuario: 'cliente',
                fecha_nacimiento: fechaNacimiento
            });

            setError('');
            navigate('/login');
        } catch (error) {
            console.error('Register failed:', error);
            setError('Error al registrarse, por favor intente nuevamente.');
        }
    }

    return (
        <div className="container-session">
            <div className="container-image">
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>
            <div className="form-session">
                <h2>Registro</h2>
                <form onSubmit={handleRegister}>
                    {/* Fila 1: Nombre y Apellido */}
                    <div className="form-group-half">
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellido:</label>
                            <input
                                type="text"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Fila 2: DNI y Email */}
                    <div className="form-group-half">
                        <div className="form-group">
                            <label>DNI:</label>
                            <input
                                type="text"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Fila 3: Fecha de nacimiento y Username */}
                    <div className="form-group-half">
                        <div className="form-group">
                            <label>Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Fila 4: Password */}
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Mensaje de error */}
                    {error && <p className="error-message">{error}</p>}

                    {/* Botón de submit */}
                    <div className="container-button">
                        <button type="submit">Registrarse</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
