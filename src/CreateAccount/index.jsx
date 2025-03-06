import "./CreateAccount.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { createAccount } from "../actions"; // Importa la función de API

function CreateAccount() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false); // Estado para bloquear el botón

  const navigate = useNavigate();

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validación y envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    // Validaciones en el frontend
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrors("Todos los campos son obligatorios");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors("Correo electrónico no válido");
      return;
    }

    if (formData.password.length < 6) {
      setErrors("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors("Las contraseñas no coinciden");
      return;
    }

    setLoading(true); // Deshabilita el botón mientras se procesa

    try {
      // Llama a la API para crear la cuenta
      const response = await createAccount(formData);

      if (response.success) {
        // Redirigir según el rol del usuario
        setTimeout(() => {
          if (response.role === "Admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/user-dashboard");
          }
        }, 1500);

        // Limpiar formulario después del registro
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } else {
        setErrors(response.message || "Error en el registro");
      }
    } catch (error) {
      setErrors("Error inesperado en el registro");
    } finally {
      setLoading(false); // Habilita el botón nuevamente
    }
  };

  return (
    <div className="create-account">
      <div className="form-container">
        <h2>Crear Cuenta</h2>

        {errors && <p className="error">{errors}</p>}

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="name" className="label">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Tu nombre"
            className="input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email" className="label">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="ejemplo@correo.com"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password" className="label">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            className="input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword" className="label">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="********"
            className="input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Creando..." : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export { CreateAccount };
