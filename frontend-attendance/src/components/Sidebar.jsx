// src/components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaTachometerAlt, FaUsers, FaChartBar, FaSignOutAlt,
    FaNetworkWired, FaBars, FaTimes, FaBuilding
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const isActive = (path) =>
        location.pathname === path ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100";

    const toggleSidebar = () => setOpen(!open);

    return (
        <>
            {/* Botón para móviles */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 text-2xl text-blue-700 bg-white rounded-full p-2 shadow"
            >
                {open ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar */}
            <div className={`bg-white shadow-md p-4 fixed top-0 left-0 h-screen w-64 flex flex-col justify-between transition-transform z-40
                ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <div>
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">📊 Sistema</h2>
                    <nav className="space-y-2">
                        <Link to="/dashboard" className={`flex items-center gap-3 p-2 rounded ${isActive("/dashboard")}`}>
                            <FaTachometerAlt /> Dashboard
                        </Link>

                        {user?.role === "admin" && (
                            <>
                                <Link to="/admin" className={`flex items-center gap-3 p-2 rounded ${isActive("/admin")}`}>
                                    <FaChartBar /> Admin
                                </Link>
                                <Link to="/usuarios" className={`flex items-center gap-3 p-2 rounded ${isActive("/usuarios")}`}>
                                    <FaUsers /> Usuarios
                                </Link>
                                <Link to="/dispositivos" className={`flex items-center gap-3 p-2 rounded ${isActive("/dispositivos")}`}>
                                    <FaNetworkWired /> Dispositivos
                                </Link>
                                <Link to="/sucursales" className={`flex items-center gap-3 p-2 rounded ${isActive("/sucursales")}`}>
                                    <FaBuilding /> Sucursales
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:text-red-700">
                    <FaSignOutAlt /> Cerrar sesión
                </button>
            </div>
        </>
    );
}
