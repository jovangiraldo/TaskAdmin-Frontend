import { useState } from "react";
import "./ChangePassword.css"; // Importamos los estilos
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 🔹 Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== newPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden.",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
      return;
    }

    // 🔹 Simulación del envío a la API
    Swal.fire({
      title: "✅ Contraseña actualizada",
      text: "Tu contraseña ha sido cambiada con éxito.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    // Aquí deberías llamar a la API para cambiar la contraseña
  };

  return (
    <div className="login">
      <div className="form-container">
        <img src="./logos/logo_yard_sale.svg" alt="logo" className="logo" />

        <h1 className="title">Crea una nueva contraseña</h1>
        <p className="subtitle">Introduce una nueva contraseña para tu cuenta</p>

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="password" className="label">Nueva Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="*********"
            className="input input-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="new-password" className="label">Confirmar Contraseña</label>
          <input
            type="password"
            id="new-password"
            placeholder="*********"
            className="input input-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button type="submit" className="primary-button login-button">
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
