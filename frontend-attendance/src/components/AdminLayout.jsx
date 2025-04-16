// src/components/AdminLayout.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar fijo */}
            <aside className="w-64 bg-white shadow-lg z-10">
                <Sidebar />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                {/* Header o bienvenida opcional */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-800">
                        Bienvenido, {user?.name}
                    </h1>
                    <p className="text-sm text-gray-600">Rol: {user?.role}</p>
                </div>

                {/* Aquí se renderiza la página actual */}
                <Outlet />
            </main>
        </div>
    );
}
