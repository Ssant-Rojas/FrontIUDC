import './HeaderStyles.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header() {
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsRegistered(!!token);
    }, []);

    return (
        <div className="Header-TopBar">
            <div className="Logo-Space">
                <div className="Logo">
                    <Link to="/principal">
                        <img src="src/assets/Logo_universitaria_white.webp" alt="Logo Universitaria" />
                    </Link>
                </div>
            </div>
            {isRegistered && (
                <div className="Header-Menu">
                    <Link to="/solicitud" className="Header-Link">Solicitudes</Link>
                </div>
            )}
        </div>
    );
}

export default Header;
