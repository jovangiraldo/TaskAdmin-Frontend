import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// 🔹 Base URL de la API
const API_BASE_URL = "https://localhost:7030/api";

// 🔹 Clientes Axios específicos para cada funcionalidad
const apiAuth = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: { "Content-Type": "application/json" },
});

const apiAccount = axios.create({
  baseURL: `${API_BASE_URL}/Account`,
  headers: { "Content-Type": "application/json" },
});

const apiTasks = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Crear una cuenta de usuario
export const createAccount = async (userData) => {
  try {
    const response = await apiAccount.post("", userData);

    if (response.data.token) {
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Decodificar el token para obtener el rol del usuario
      const decodedToken = jwtDecode(token);
      localStorage.setItem("role", decodedToken["role"]);

      Swal.fire({
        title: "¡Cuenta creada y sesión iniciada!",
        text: `Bienvenido, ${decodedToken["role"]}!`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      return { success: true, role: decodedToken["role"] };
    }

    Swal.fire({
      title: "¡Cuenta creada!",
      text: "El usuario ha sido registrado con éxito.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    return response.data;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Ocurrió un error al crear la cuenta.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    return { success: false, message: error.response?.data?.message || "Error al conectar con el servidor" };
  }
};

// 🔹 Iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await apiAuth.post("/login", { email, password }, { withCredentials: true });    

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("email", response.data.email);
    localStorage.setItem("userId", response.data.userId);

    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error.response?.data?.message || "Error al conectar con el servidor";
  }
};

// 🔹 Obtener todos los usuarios (Solo Admin)
export const fetchUsers = async (token) => {
  try {
    const response =  await apiAccount.get("/GetUsers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return [];
  }
};

// 🔹 Asignar una tarea a un usuario
export const assignTask = async (taskName, description, userId, token) => {
    // Verificación de datos antes de la solicitud
    if (!taskName || !description || !userId) {
        console.error("❌ Error: Faltan datos obligatorios (taskName, description, userId)");
        return null;
    }

    console.log("📤 Enviando datos a la API:", {
        nameTask: taskName,
        descriptionTask: description,
        createAccountId: userId
    });

    try {
        const response = await apiTasks.post(
            "/assign",
            { 
                nameTask: taskName, 
                descriptionTask: description, 
                createAccountId: userId 
            },
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Respuesta del servidor:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("❌ Error en la solicitud:", error.response.data);
        } else if (error.request) {
            console.error("⚠ No hubo respuesta del servidor.");
        } else {
            console.error("⚠ Error inesperado:", error.message);
        }
        return null;
    }
};

export const getUserTask = async (userId, token) => {
    try {
        const response = await apiTasks.get(`/user-task/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
                "Content-Type": "application/json",
            },
        });
        console.log("✅ Tareas obtenidas:", response.data);
        return response.data;
    } catch (err) {
        console.error("❌ Error al obtener las tareas:", err.response?.data || err.message);
        return null;
    }
};


export const  getUserData = async (token) =>{
  try{
    const response = await apiAccount.get(`/GetUsers`,{
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
      return response.data;
  } catch (err) {
      console.log("❌ Error al obtener los usuarios:",err.response?.data|| err.message);
      return null;
  }
  
}

 export const updateTaskStatus = async (taskId, newStatus, token) => {
    try {
        const response = await apiTasks.patch(
            `/Update-State/${taskId}`,
            { status: newStatus }, // 🔹 Enviar el nuevo estado en el body
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 🔹 Token JWT para autenticación
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ Estado actualizado:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error al actualizar el estado:", error.response?.data || error.message);
        return null;
    }
}; 


export const updateTasks = async (taskId,token,updatedData) =>{

    try{
      const response = await apiTasks.patch(`/${taskId}`,updatedData,{
        headers:{ 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      });
        return response.data; 
    } catch(err){
      console.error("❌ Error al actualizar el estado:", err.response?.data || err.message);
      return null;
    }
};

export const deleteTask = async (taskId,token) =>{
    try {
      const response = await apiTasks.delete(`?taskId=${taskId}`,{
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
        },
      });
      return response.data;
      
    } catch (error) {
      console.error("❌ Error al eliminar la tarea:", error);
      return null;
    }
}




  
