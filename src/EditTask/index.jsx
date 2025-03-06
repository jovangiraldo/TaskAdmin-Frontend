import './EditTask.css';
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getUserData, getUserTask, updateTasks,deleteTask } from '../actions';
import { User } from '../Img/user';
import { Edit } from '../Img/EditTask';
import { DeleteData } from '../Img/delete';
import { Back } from '../Img/back';
import { useNavigate } from "react-router-dom";

function EditTask() {
    const [selectedUser, setSelectedUser] = useState(""); 
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            console.error("⚠ No hay token disponible.");
            return;
        }
    
        getUserData(token)
            .then(data => setUsers(data))
            .catch(error => console.error("⚠ Error al obtener usuarios:", error));
    }, []);
    const navigate = useNavigate();
    const handleBack = () =>{

        navigate("/create-task");
    }

    const handleUserChange = async (userId) => {
        setSelectedUser(userId);
        setTasks([]);

        if (!userId) return;

        setLoading(true);
        const token = localStorage.getItem("token");
        const userTasks = await getUserTask(userId, token);
        setLoading(false);

        if (userTasks) {
            setTasks(userTasks);
        } else {
            Swal.fire("⚠ No hay tareas", "Este usuario no tiene tareas asignadas.", "warning");
        }
    };

    const handleDeleteTask = async (taskId) => {

        const token  = localStorage.getItem("token");

        const confirmdelete = await Swal.fire({
            title:"¿Estás seguro?",
            text:"Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText:"Si,eliminar",
            cancelButtonText: "Cancelar"
        })

        if (!confirmdelete.isConfirmed) {
            
            return;
        }

        const result = await deleteTask(taskId,token);
    
        if (result) {
            setTasks((prev)=>prev.filter(task=> task.id !== taskId));
            Swal.fire("✅ Tarea eliminada con éxito!", "", "success");    
        }else{
            Swal.fire("⚠ No se pudo eliminar la tarea", "Inténtalo nuevamente.", "error");    
        }
    }

    // 🔹 Editar tarea y actualizar en la base de datos
    const editTask = (task) => {
        Swal.fire({
            title: `📝 Editar Tarea`,
            html: `
                <label> Nombre de la tarea:</label>
                <input id="task-name" class="swal2-input" value="${task.nameTask}"/>

                <label> Descripción:</label>
                <input id="task-desc" class="swal2-input" value="${task.descriptionTask}"/>               
            `,
            showCancelButton: true,
            confirmButtonText: "Guardar Cambios",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                const newName = document.getElementById("task-name").value.trim();
                const newDesc = document.getElementById("task-desc").value.trim();

                if (!newName || !newDesc) {
                    Swal.showValidationMessage("⚠ Todos los campos son obligatorios.");
                    return false;
                }

                return { id: task.id, nameTask: newName, descriptionTask: newDesc };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedTask = result.value       
                const token = localStorage.getItem("token"); // Asegurar el token actualizado

                const response = await updateTasks(task.id, token, updatedTask);
                console.log("🔹 Respuesta de la API:", response);
                
                if (response && response.message === "Tarea actualizada correctamente") {
                    setTasks((prevTasks) =>
                        prevTasks.map((t) => (t.id === task.id ? { ...t, ...updatedTask } : t))
                    );       
                    Swal.fire("✅ Tarea editada con éxito!", "", "success");         
                } else {
                    Swal.fire("⚠ No se pudo actualizar la tarea", "Inténtalo nuevamente.", "error");
                }
            }
        });
    };

    return (
        <div className="edit-task-container">
             <div>
                <button  className='btnBack' onClick={handleBack}><Back/></button>
            </div>

            <h2>📝 Editar Tareas</h2>

           
           
            <div className="select-editTask">
                <label> <User/> Selecciona un usuario:</label>
                <select className="user-select" onChange={(e) => handleUserChange(e.target.value)}>
                    <option value="">-- Seleccionar --</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>

           
            {tasks.length > 0 && (
                <div className="task-list">
                    <h3>📋 Tareas de {users.find(u => u.id === parseInt(selectedUser))?.name}</h3>
                    <ul>
                        {tasks.map(task => (
                            <div className='contenedorList' key={task.id}> 
                                <li className="task-item">
                                    <strong>{task.nameTask}</strong> - {task.descriptionTask} ({task.status})
                                    <div className='contenedor-btns'>
                                        <button onClick={() => editTask(task)} className="edit-task-btn"><Edit/></button>
                                        <button onClick={()=> handleDeleteTask(task.id)} className="edit-task-btn"><DeleteData/></button>
                                    </div>                              
                                </li>
                           </div> 
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export { EditTask };

