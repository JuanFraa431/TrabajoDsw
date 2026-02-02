import React from 'react';
import '../styles/PreFooter.css';

const PreFooter = () => {
    return (
        <footer className="footer1">
            <div className="footer-bottom">
                <div>
                    <p className="disclaimer">
                        Podés cancelar tus compras realizadas de forma online o telefónica dentro de un plazo máximo de 10 días desde la fecha que realizaste la compra.
                    </p>
                </div>
                <a className="boton-arrepentimiento" href= "https://www.google.com/search?sca_esv=edde3339ea425524&sca_upv=1&rlz=1C1CHBF_esAR1085AR1085&sxsrf=ADLYWIJOAq3EC0r3wHZEZ8Ids_qOdR7lRw:1723690434624&q=risa&udm=2&fbs=AEQNm0CbCVgAZ5mWEJDg6aoPVcBgWizR0-0aFOH11Sb5tlNhdzTfxpAVBoexMFZnKJBpl_NibeLqpdqLlYXarYwntqndhqBN-wXZg0xSb2G09iERethf4VNvk4alLqIa4h6X5e3e13weHRpC0uFje19AJM8zjqcWi-uWMfjHcjnWxImDTFp7GjJr32eNFLdZ1-hFzLbq_yOCkVfaUuTc9OEoOW5IOlodyw&sa=X&ved=2ahUKEwjQzrug__WHAxWrqJUCHQ3jOuwQtKgLegQIFRAB&biw=1366&bih=607&dpr=1" target="_blank">Botón de arrepentimiento</a>
            </div>
        </footer>
    );
};

export default PreFooter;