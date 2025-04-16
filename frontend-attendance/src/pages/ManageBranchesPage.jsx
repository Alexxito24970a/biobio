// src/pages/ManageBranchesPage.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function ManageBranchesPage() {
    const { user, token } = useContext(AuthContext);
    const [branches, setBranches] = useState([]);
    const [form, setForm] = useState({ name: "", address: "", status: "active" });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    // ⚡ Cargar sucursales al montar (si es admin)
    useEffect(() => {
        if (user?.role === "admin") fetchBranches();
    }, [user]);

    // ❌ Acceso denegado si no es admin
    if (user?.role !== "admin") {
        return (
            <div className="p-6 text-red-600 text-center text-xl">
                🚫 Acceso denegado. Solo administradores pueden gestionar sucursales.
            </div>
        );
    }

    // 🔹 Obtener sucursales
    const fetchBranches = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/branches", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBranches(res.data);
        } catch (err) {
            console.error("Error al obtener sucursales:", err);
        }
    };

    // 🔹 Crear o actualizar sucursal
    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/branches/${editingId}`, form, config);
                setMessage("✅ Sucursal actualizada");
            } else {
                await axios.post("http://localhost:5000/api/branches", form, config);
                setMessage("✅ Sucursal registrada");
            }

            fetchBranches();
            resetForm();
        } catch (err) {
            console.error("Error al guardar sucursal:", err);
            setMessage("❌ Error al guardar sucursal");
        }
    };

    // 🔹 Editar sucursal
    const handleEdit = (branch) => {
        setForm(branch);
        setEditingId(branch.id);
        setMessage("");
    };

    // 🔹 Eliminar sucursal
    const handleDelete = async (id) => {
        if (confirm("¿Eliminar esta sucursal?")) {
            try {
                await axios.delete(`http://localhost:5000/api/branches/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchBranches();
            } catch (err) {
                console.error("Error al eliminar sucursal:", err);
            }
        }
    };

    const resetForm = () => {
        setForm({ name: "", address: "", status: "active" });
        setEditingId(null);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🏢 Gestión de Sucursales</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md mb-6">
                <h3 className="text-lg font-semibold mb-2">{editingId ? "Editar" : "Nueva"} Sucursal</h3>
                {message && <p className="mb-2 text-sm">{message}</p>}

                <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full border p-2 rounded mb-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Dirección"
                    className="w-full border p-2 rounded mb-2"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                />
                <select
                    className="w-full border p-2 rounded mb-2"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                </select>

                <div className="flex gap-2">
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        {editingId ? "Actualizar" : "Registrar"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Tabla */}
            <div className="bg-white rounded shadow p-4">
                <h3 className="text-lg font-semibold mb-2">📋 Sucursales Registradas</h3>
                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Nombre</th>
                            <th className="p-2 text-left">Dirección</th>
                            <th className="p-2 text-left">Estado</th>
                            <th className="p-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches.map((branch) => (
                            <tr key={branch.id} className="border-t">
                                <td className="p-2">{branch.name}</td>
                                <td className="p-2">{branch.address}</td>
                                <td className="p-2">{branch.status}</td>
                                <td className="p-2 space-x-2">
                                    <button onClick={() => handleEdit(branch)} className="text-yellow-600">Editar</button>
                                    <button onClick={() => handleDelete(branch.id)} className="text-red-600">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
