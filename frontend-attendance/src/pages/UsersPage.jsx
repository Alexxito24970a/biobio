import { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import { AuthContext } from "../context/AuthContext";

export default function UsersPage() {
    const { user, token } = useContext(AuthContext);

    // 🔒 Restringir acceso si no es admin
    if (user?.role !== "admin") {
        return (
            <div className="p-6 text-center text-red-600 text-xl font-bold">
                🚫 Acceso denegado: Solo administradores pueden gestionar usuarios.
            </div>
        );
    }

    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "empleado"
    });
    const [editingUserId, setEditingUserId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("❌ Error al obtener usuarios:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (editingUserId) {
                await axios.put(`http://localhost:5000/api/users/${editingUserId}`, form, config);
                setSuccess("✅ Usuario actualizado correctamente");
            } else {
                await axios.post("http://localhost:5000/api/users", form, config);
                setSuccess("✅ Usuario creado correctamente");
            }

            fetchUsers();
            setForm({ name: "", email: "", password: "", role: "empleado" });
            setEditingUserId(null);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "❌ Error al guardar usuario");
        }
    };

    const handleEdit = (user) => {
        setForm({ ...user, password: "" });
        setEditingUserId(user.id);
        setSuccess("");
        setError("");
    };

    const handleDelete = async (id) => {
        if (confirm("¿Eliminar este usuario?")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchUsers();
            } catch (err) {
                console.error("❌ Error al eliminar usuario:", err);
            }
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">👥 Gestión de Usuarios</h2>

            {/* 🧾 Formulario */}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 max-w-md">
                <h3 className="text-lg font-semibold mb-3">
                    {editingUserId ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
                </h3>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && <p className="text-green-600 mb-2">{success}</p>}

                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                {!editingUserId && (
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                )}
                <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                >
                    <option value="admin">Admin</option>
                    <option value="empleado">Empleado</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition">
                    {editingUserId ? "Actualizar" : "Crear"}
                </button>
            </form>

            {/* 🧩 Lista de Usuarios en Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {users.map((user) => (
                  <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  token={token}
              />
              
                ))}
            </div>
        </div>
    );
}
