import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { login } from "../actions"; // Asegúrate de importar correctamente

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
          const respose =  await login(email, password);
         
          if (respose) {
            
             const {token, role} = respose;

             localStorage.setItem("token",token);
             localStorage.setItem("role",role)
             
             alert("✅ Inicio de sesión exitoso");

            if (role === "Admin") {
              navigate("/create-task");
            }else {
              navigate("/Task-Assiend"); // Usuarios normales van a la página principal
            }
          }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="login">
            <div className="form-container">
                <img /* src={logo} */ alt="logo" className="logo" />

                <form onSubmit={handleSubmit} className="form">
                    <label htmlFor="email" className="label">Email address</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="platzi@example.com"
                        className="input input-email"
                        value={email} // ✅ Conectado con useState
                        onChange={(e) => setEmail(e.target.value)} // ✅ Manejo de cambios
                        required
                    />

                    <label htmlFor="password" className="label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="*********"
                        className="input input-password"
                        value={password} // ✅ Conectado con useState
                        onChange={(e) => setPassword(e.target.value)} // ✅ Manejo de cambios
                        required
                    />

                    {error && <p className="error-message">{error}</p>} {/* Muestra error si existe */}

                    <input type="submit" value="Log in" className="primary-button login-button" />
                    
                    <a href="/ResetPassword">Forgot my password</a>
                </form>   

                <Link to="/create-account">
                    <button type="button" className="secondary-button signup-button">Sign up</button>
                </Link>    
            </div>
        </div>
    );
}

export { Login };
