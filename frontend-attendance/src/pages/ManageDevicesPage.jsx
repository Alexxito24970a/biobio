// src/pages/ManageDevicesPage.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function ManageDevicesPage() {
    const { user, token } = useContext(AuthContext);
    const [devices, setDevices] = useState([]);
    const [branches, setBranches] = useState([]);
    const [form, setForm] = useState({
        name: "",
        ip_address: "",
        port: 4370,
        connection_type: "tcpip",
        status: "active",
        branch_id: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user?.role === "admin" && token) {
            fetchDevices();
            fetchBranches();
        }
    }, [user, token]);

    const fetchDevices = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/devices", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDevices(res.data);
        } catch (err) {
            console.error("Error al obtener dispositivos:", err);
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/branches", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBranches(res.data);
        } catch (err) {
            console.error("Error al obtener sucursales:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (editingId) {
                await axios.put(`http://localhost:5000/api/devices/${editingId}`, form, config);
                setMessage("✅ Dispositivo actualizado correctamente");
            } else {
                await axios.post("http://localhost:5000/api/devices", form, config);
                setMessage("✅ Dispositivo registrado correctamente");
            }
            fetchDevices();
            resetForm();
        } catch (err) {
            console.error("Error al guardar dispositivo:", err);
            setMessage("❌ Error al guardar dispositivo");
        }
    };

    const handleEdit = (device) => {
        setForm({
            ...device,
            branch_id: device.branch_id || "",
        });
        setEditingId(device.id);
        setMessage("");
    };

    const handleDelete = async (id) => {
        if (confirm("¿Eliminar este dispositivo?")) {
            try {
                await axios.delete(`http://localhost:5000/api/devices/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                fetchDevices();
            } catch (err) {
                console.error("Error al eliminar dispositivo:", err);
            }
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            ip_address: "",
            port: 4370,
            connection_type: "tcpip",
            status: "active",
            branch_id: "",
        });
        setEditingId(null);
    };

    if (user?.role !== "admin") {
        return (
            <div className="p-6 text-red-600 text-center text-xl">
                🚫 Acceso denegado. Solo administradores pueden gestionar dispositivos.
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🔌 Gestión de Dispositivos</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md mb-6">
                <h3 className="text-lg font-semibold mb-2">{editingId ? "Editar" : "Nuevo"} Dispositivo</h3>
                {message && <p className="mb-2 text-sm">{message}</p>}

                <input type="text" placeholder="Nombre" className="w-full border p-2 rounded mb-2"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input type="text" placeholder="Dirección IP" className="w-full border p-2 rounded mb-2"
                    value={form.ip_address} onChange={(e) => setForm({ ...form, ip_address: e.target.value })} required />
                <input type="number" placeholder="Puerto" className="w-full border p-2 rounded mb-2"
                    value={form.port} onChange={(e) => setForm({ ...form, port: parseInt(e.target.value) })} />

                <select className="w-full border p-2 rounded mb-2"
                    value={form.connection_type} onChange={(e) => setForm({ ...form, connection_type: e.target.value })}>
                    <option value="tcpip">TCP/IP</option>
                    <option value="sdk">SDK</option>
                    <option value="webapi">Web API</option>
                </select>

                <select className="w-full border p-2 rounded mb-2"
                    value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                </select>

                {/* Selección de sucursal */}
                <select className="w-full border p-2 rounded mb-2"
                    value={form.branch_id}
                    onChange={(e) => setForm({ ...form, branch_id: e.target.value })}>
                    <option value="">Seleccionar sucursal</option>
                    {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        {editingId ? "Actualizar" : "Registrar"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm}
                            className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Tabla de dispositivos */}
            <div className="bg-white rounded shadow p-4">
                <h3 className="text-lg font-semibold mb-2">📋 Dispositivos Registrados</h3>
                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Nombre</th>
                            <th className="p-2 text-left">IP</th>
                            <th className="p-2 text-left">Puerto</th>
                            <th className="p-2 text-left">Conexión</th>
                            <th className="p-2 text-left">Sucursal</th>
                            <th className="p-2 text-left">Estado</th>
                            <th className="p-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                            <tr key={device.id} className="border-t">
                                <td className="p-2">{device.name}</td>
                                <td className="p-2">{device.ip_address}</td>
                                <td className="p-2">{device.port}</td>
                                <td className="p-2">{device.connection_type}</td>
                                <td className="p-2">
                                    {branches.find(b => b.id === device.branch_id)?.name || "Sin asignar"}
                                </td>
                                <td className="p-2">{device.status}</td>
                                <td className="p-2 space-x-2">
                                    <button onClick={() => handleEdit(device)} className="text-yellow-600">Editar</button>
                                    <button onClick={() => handleDelete(device.id)} className="text-red-600">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
