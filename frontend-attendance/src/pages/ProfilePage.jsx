import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function ProfilePage() {
    const { user, logout } = useContext(AuthContext);

    if (!user) {
        return (
            <div className="p-6 text-center text-red-500 text-xl font-semibold">
                ⚠️ Usuario no autenticado
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center mb-6">
                    <FiUser className="text-4xl text-blue-600 mr-3" />
                    <div>
                        <h2 className="text-2xl font-bold text-blue-800">Mi Perfil</h2>
                        <p className="text-gray-600">Información del usuario</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="text-lg font-medium text-gray-800">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Correo</p>
                        <p className="text-lg font-medium text-gray-800">{user.email || "No disponible"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Rol</p>
                        <p className="text-lg font-medium text-gray-800 capitalize">{user.role}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition shadow"
                >
                    <FiLogOut className="inline mr-2" />
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}
