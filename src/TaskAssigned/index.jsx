import { useState, useEffect } from "react";
import { getUserTask, updateTaskStatus} from "../actions"; // Importar API
import "./TaskAssigned.css"; // Estilos
import { NavbarUser } from "../NavbarUser";
import Swal from "sweetalert2";

const TaskAssigned = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [taskStatuses, setTaskStatuses] = useState({});

    const userId = localStorage.getItem("userId"); // 🔹 Obtener `userId` de `localStorage`
    const token = localStorage.getItem("token"); // 🔹 Obtener el `token` para autenticación

    console.log("🔍 userId:", userId);
    console.log("🔍 Token:", token);


    // 🔹 Cargar las tareas desde la API cuando el componente se monta
    useEffect(() => {
        if (!userId) {
            setError("⚠ No se encontró el usuario.");
            setLoading(false);
            return;
        }

        const fetchTasks = async () => {
            try {
                const userTasks = await getUserTask(userId, token);       
                if (userTasks) {
                    setTasks(userTasks);
                } else {
                    setError("No hay tareas asignadas.");
                }
            } catch (err) {
                setError("❌ Error al obtener las tareas.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [userId, token]);

   const handleStatusChange = (taskid,newstatus) =>{
    setTaskStatuses((prevstatus) => ({
        ...prevstatus,[taskid]:newstatus,
    }));
   };

   const handleUpdateStatus = async (taskId) =>{
    const token = localStorage.getItem("token");
    const newStatus = taskStatuses[taskId] || tasks.find(task => task.id == taskId)?.status;

    const result = await updateTaskStatus(taskId,newStatus,token);

    if (result) {
        Swal.fire("✅ Estado actualizado con éxito!", "", "success");
        setTasks((prevTask)=>
            prevTask.map((task) =>
                task.id === taskId ? {...task, status:newStatus}:task
            )
        );
    }else{
        Swal.fire("⚠ No se pudo actualizar el estado", "Inténtalo nuevamente.", "error");
    }   
};


    return (
        <div className="task-list-wrapper">
            <NavbarUser/>
            <div className="task-list-container">
                <h2>📋 Mis Tareas</h2>
                {loading && <p>🔄 Cargando tareas...</p>}
                {error && <p style={{ color: "red" }}>❌ {error}</p>}

                {!loading && tasks.length > 0 ? (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id} className="task-item">
                            <strong>{task.nameTask}</strong> - {task.descriptionTask}
                            <br />
                            Estado:{" "}
                            <select
                                value={taskStatuses[task.id] || task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="EnProceso">En proceso</option>
                                <option value="Finalizada">Finalizada</option>
                            </select>
                            {/* 🔥 Botón de actualización por cada tarea */}
                            <div className="containBtnTask">
                                <button className="btnState" onClick={() => handleUpdateStatus(task.id)}>
                                    Actualizar Estado
                                </button>
                            </div>
                         
                        </li>
                    ))}
                    </ul>
                ) : !loading && <p>No tienes tareas asignadas.</p>}
                                 
            </div>
       
        </div>
    );
};

export {TaskAssigned};
