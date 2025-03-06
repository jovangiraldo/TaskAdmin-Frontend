import './Navbar.css';
import { Link } from "react-router-dom";



function Navbar(){

    const handleLogout = () => {
        localStorage.removeItem("token"); // Elimina el token de autenticación
        sessionStorage.clear(); // Limpia cualquier sesión activa
    };

    return(
    <>
    <div className="container-navbar-principal"> 
        <div className="contenedor">
            <nav>
                <ul>                   
                    <li><Link to="/Task-Edit">Opciones de administrador</Link></li>
                    <li><Link to="/login" onClick={handleLogout}>Cerrar Sesión</Link></li>
                </ul>
            </nav>
        </div>
    </div>
    
    </>);
}

export{Navbar};