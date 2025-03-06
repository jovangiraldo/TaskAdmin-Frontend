import "./CreateTaskAdmin.css"; 
import Swal from "sweetalert2";
import { Navbar } from "../Navbar";
import { useState, useEffect } from "react";
import { fetchUsers, assignTask } from "../actions"; // ← Importamos el servicio de API

 function CreateTask() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchUsers(token).then(setUsers);
  }, []);

  const handleAssignTask = async () => {
    console.log("📤 Enviando datos a la API:", {
      nameTask: taskName,
      descriptionTask: description,
      createAccountId: selectedUser,
    });
  
    if (!taskName || !selectedUser) {
      alert("⚠️ Completa todos los campos.");
      return;
    }

    const token = localStorage.getItem("token");
    const result = await assignTask(taskName, description, selectedUser, token);

    if (result) {
        Swal.fire({
            title: "¡Asignacion creada!",
            text: "Se ha asignado la tarea correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
        });
      setTaskName("");
      setDescription("");
    } else {
        Swal.fire({
            title: "¡Error al asignar la tarea!",
            text: "No se le pudo asignar la tarea al usuario.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
    }
  };


  return (
   
  <div className="task-admin-pricipal;">
    <Navbar />
    <div className="task-admin-container">
      <h2 className="task-admin-title">Panel de Administración - Asignar Tareas</h2>
      <select
        className="task-admin-select"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Selecciona un usuario</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.email}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Nombre de la tarea"
        className="task-admin-input"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      <textarea
        placeholder="Descripción de la tarea"
        className="task-admin-textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="task-admin-button" onClick={handleAssignTask}>
        Asignar Tarea
      </button>
    </div>
  </div>
  );
}

export { CreateTask };
