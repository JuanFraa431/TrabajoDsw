import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createEntity } from '../services/crudService'; 

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
                estado:1, 
                tipo_usuario:'cliente',
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
        <div className='container-session'>
            <div className='form-session'>
                <h2>Registro</h2>
                <form onSubmit={handleRegister}>
                    <div>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Apellido:</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>DNI:</label>
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            required
                        />
                    </div>
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
                    {error && <p className="error-message">{error}</p>}
                    <div className='container-button'>
                        <button type="submit">Registrarse</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
