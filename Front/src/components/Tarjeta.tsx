import React, { useState } from 'react';
import '../styles/Tarjeta.css';
import visa from '../images/visa.png';
import mastercard from '../images/mastercard.png';
import chip from '../images/chip-tarjeta.png';

type TarjetaProps = {
    nombre: string;
    setNombre: (value: string) => void;
    numeroTarjeta: string;
    setNumeroTarjeta: (value: string) => void;
};

function formatCardNumber(value: string) {
    let digits = value.replace(/\D/g, '');
    digits = digits.slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpirationDate(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
}

function generateSignature(name: string) {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0] + parts[1].slice(0, 3)).toUpperCase();
    }
    return name ? name.substring(0, 7).toUpperCase() : 'FIRMA';
}

const Tarjeta: React.FC<TarjetaProps> = ({ nombre, setNombre, numeroTarjeta, setNumeroTarjeta }) => {
    const [fechaExpiracion, setFechaExpiracion] = useState('');
    const [cvv, setCvv] = useState('');
    const [tarjetaVolteada, setTarjetaVolteada] = useState(false);
    const [marcaTarjeta, setMarcaTarjeta] = useState<'visa' | 'mastercard' | 'none'>('none');

    const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setNumeroTarjeta(formatted);
        const cleanNumber = formatted.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) {
            setMarcaTarjeta('visa');
        } else if (cleanNumber.startsWith('5')) {
            setMarcaTarjeta('mastercard');
        } else {
            setMarcaTarjeta('none');
        }
        setTarjetaVolteada(false);
    };

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value.toUpperCase().slice(0, 20);
        setNombre(valor);
        setTarjetaVolteada(false);
    };

    const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpirationDate(e.target.value);
        setFechaExpiracion(formatted);
        setTarjetaVolteada(false);
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCvv(e.target.value);
        setTarjetaVolteada(true);
    };

    return (
        <div className="container-tarjeta">
            <div className="formulario-tarjeta">
                <h3>Formulario de Tarjeta</h3>
                <div className="grupo">
                    <label>Nombre del titular</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={handleNombreChange}
                        placeholder="JUAN PÉREZ"
                        autoComplete='off'
                    />
                </div>
                <div className="grupo">
                    <label>Número de tarjeta</label>
                    <input
                        type="text"
                        value={numeroTarjeta}
                        onChange={handleNumeroChange}
                        placeholder="#### #### #### ####"
                        autoComplete='off'
                    />
                </div>
                <div className="grupo">
                    <label>Fecha de expiración</label>
                    <input
                        type="text"
                        value={fechaExpiracion}
                        onChange={handleFechaChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        autoComplete='off'
                    />
                </div>
                <div className="grupo">
                    <label>CVV</label>
                    <input
                        type="text"
                        maxLength={3}
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        autoComplete='off'
                    />
                </div>
            </div>

            <div className="tarjeta" onClick={() => setTarjetaVolteada(!tarjetaVolteada)}>
                <div className={`tarjeta-content ${tarjetaVolteada ? 'flipped' : ''}`}>
                    <div className="delantera">
                        {marcaTarjeta !== 'none' && (
                            <div className="logo-marca">
                                {marcaTarjeta === 'visa' && <img src={visa} alt="Visa" />}
                                {marcaTarjeta === 'mastercard' && <img src={mastercard} alt="Mastercard" />}
                            </div>
                        )}
                        <div className="chip-image">
                            <img src={chip} alt="Chip" />
                        </div>
                        <p className="numero">{numeroTarjeta || '#### #### #### ####'}</p>
                        <div className="nombre-container">
                            <p className="nombre-label">Nombre del titular</p>
                            <p className="nombre">{nombre || 'NOMBRE DEL TITULAR'}</p>
                        </div>
                        <div className="expiracion-container">
                            <span className="vto-label">VTO:</span>
                            <p className="expiracion">{fechaExpiracion || 'MM/YY'}</p>
                            
                        </div>
                    </div>

                    <div className="trasera">
                        <div className="magnetic-stripe" />
                        <div className="signature-section">
                            <div className="signature-box">
                                <p>{generateSignature(nombre)}</p>
                            </div>
                            <div className="cvv-box">
                                <p>{cvv || 'CVV'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tarjeta;
