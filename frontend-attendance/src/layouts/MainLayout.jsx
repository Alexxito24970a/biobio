// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="ml-64 w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}
