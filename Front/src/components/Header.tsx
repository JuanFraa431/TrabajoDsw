import React from "react";
import "../styles/Header.css";
import userIcon from "../images/user-icon.png";
import logo from "../images/logoFinal2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Header = () => {
    const userName = "Juanfraa";

    const navigate = useNavigate();

    const handleLinkClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        
        try {
            // Hacer la solicitud al backend para obtener todos los paquetes
            const response = await axios.get('http://localhost:3000/api/paquete');

            // Redirigir a la página de paquetes con los datos obtenidos
            navigate('/paquetes', { state: { paquetes: response.data } });
        } catch (error) {
            console.error('Error al obtener paquetes:', error);
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
                        <Link to="/alojamiento" >Alojamiento</Link>
                    </li>
                    <li>
                        <Link to="/paquetes" onClick={handleLinkClick} >Paquetes</Link>
                    </li>
                    <li>
                        <a href="#excursiones">Excursiones</a>
                    </li>
                    <li>
                        <a href="#transporte">Transporte</a>
                    </li>
                    <li>
                        <a href="#nosotros">Nosotros</a>
                    </li>
                </ul>
            </nav>
            <div className="user">
                <img src={userIcon} alt="User Icon" className="user-icon" />
                <span>Hola! {userName}</span>
            </div>
        </header>
    );
};

export default Header;
