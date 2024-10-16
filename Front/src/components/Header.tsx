import React from "react";
import "../styles/Header.css";
import userIcon from "../images/user-icon.png";
import logo from "../images/logoFinal2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";


const Header = () => {
    const location = useLocation();
    const cliente = location.state?.cliente;

    const navigate = useNavigate();
    
    const handleLinkClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, endpoint: string, route: string) => {
        event.preventDefault();

        try {
            // Hacer la solicitud al backend usando el endpoint proporcionado
            const response = await axios.get(`http://localhost:3000/api/${endpoint}`);

            // Redirigir a la página correspondiente con los datos obtenidos
            navigate(`/${route}`, { state: { [route]: response.data } });
        } catch (error) {
            console.error(`Error al obtener ${endpoint}:`, error);
        }
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/" ><img src={logo} alt="Logo"/></Link>
            </div>
            <nav className="nav">
                <ul>
                    <li>
                        <Link to="/hoteles" >Hoteles</Link>
                    </li>
                    <li>
                        <Link to="/paquetes" onClick={(event) => handleLinkClick(event, 'paquete', 'paquetes')}>Paquetes</Link>
                    </li>
                    <li>
                        <Link to="/excursiones" onClick={(event) => handleLinkClick(event, 'excursion', 'excursiones')}>Excursiones</Link>
                    </li>
                    <li>
                        <a href="#transporse">Transporte</a>
                    </li>
                    <li>
                        <a href="#nosotros">Nosotros</a>
                    </li>
                </ul>
            </nav>
            <div className="user">
                <img src={userIcon} alt="User Icon" className="user-icon" />
                {cliente ? (
                    <a
                        href="/detalleCliente"
                        onClick={(event) => {
                            event.preventDefault();
                            navigate('/detalleCliente', { state: { cliente } });
                        }}
                    >
                        {cliente.nombre} {cliente.apellido}
                    </a>
                ) : (
                    <a href="/login">Iniciar Sesión</a>
                )}
            </div>
        </header>
    );
};

export default Header;
