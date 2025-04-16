// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Importaciones de estilos
import "bootstrap/dist/css/bootstrap.min.css";         // ✅ Estilos de Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";     // ✅ Funcionalidad JS de Bootstrap (modales, dropdowns, etc.)

import "./index.css"; // tu CSS global
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  </React.StrictMode>
);
