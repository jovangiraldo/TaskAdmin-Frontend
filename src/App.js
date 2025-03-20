import React from "react";
import { Routes, Route } from "react-router-dom"; // ❌ No usar BrowserRouter aquí
import { Login } from "./Login";
import { CreateAccount } from "./CreateAccount";
import { CreateTask } from "./CreateTaskAdmin";
import { TaskAssigned } from "./TaskAssigned";
import { EditTask } from "./EditTask";
import ResetPassword from "./ChangePassword";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/Task-Assiend" element={<TaskAssigned />} />
        <Route path="/Task-Edit" element={<EditTask/>} />
        <Route path="/ResetPassword" element={<ResetPassword/>} />
        <Route path="*" element={<Login />} /> 
      </Routes>
    </>
  );
}

export default App;
