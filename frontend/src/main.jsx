import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import {RouterProvider, createBrowserRouter,Navigate, redirect} from "react-router";
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import api from "./api/axios.js";

//checking auth
const authLoader = async ()=>{
  const token = localStorage.getItem("token");
 
  if(!token) throw redirect('/login');

  // const response = await api.get('/tasks');
  // return response.data;
 try {
   const response = await api.get("/tasks");
   return response.data;
 } catch (err) {
   // agar token invalid ya expired hai
   localStorage.removeItem("token");
   localStorage.removeItem("user");
   throw redirect("/login");
 }
}

// if logged in then go to dashboard

const guestLoader = async()=>{
  const token  = localStorage.getItem("token");
  if(token) throw redirect("/dashboard");
  return null;
}





const router = createBrowserRouter([
  { path: "/login", element: <Login />, loader: guestLoader },
  { path: "/register", element: <Register /> , loader:guestLoader},
  { path: "/dashboard", element: <Dashboard /> , loader: authLoader },
  {path: "/", element: <Navigate to = "/login"/> , loader: async()=>{const token = localStorage.getItem("token");
    throw redirect(token? "/dashboard": "/login");
  }},
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <AuthProvider>
        <RouterProvider router={router}/>
        {/* <App/> */}
      </AuthProvider>
  </StrictMode>,
);
