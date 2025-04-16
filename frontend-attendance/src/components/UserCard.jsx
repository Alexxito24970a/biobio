import { useState } from "react";
import { FiEdit, FiTrash2, FiKey } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserCard({ user, onEdit, onDelete, token }) {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = async () => {
        if (!newPassword) return toast.error("La contraseña no puede estar vacía");

        try {
            setLoading(true);
            await axios.put(`http://localhost:5000/api/users/${user.id}/password`, {
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Contraseña actualizada");
            setShowPasswordModal(false);
            setNewPassword("");
        } catch (err) {
            console.error("❌ Error al cambiar contraseña:", err);
            toast.error("Error al cambiar contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
                <h3 className="text-xl font-semibold text-blue-700">{user.name}</h3>
                <p className="text-gray-600">📧 {user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Rol: {user.role}</p>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
                <button
                    onClick={() => onEdit(user)}
                    className="flex items-center px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
                >
                    <FiEdit className="mr-1" /> Editar
                </button>
                <button
                    onClick={() => onDelete(user.id)}
                    className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow"
                >
                    <FiTrash2 className="mr-1" /> Eliminar
                </button>
                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
                >
                    <FiKey className="mr-1" /> Cambiar clave
                </button>
            </div>

            {/* Modal de contraseña */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">🔐 Cambiar contraseña de {user.name}</h2>
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            className="border w-full p-2 rounded mb-4"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setNewPassword("");
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                onClick={handlePasswordUpdate}
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Actualizar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
