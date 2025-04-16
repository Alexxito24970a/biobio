import { useState, useEffect } from "react";

export default function UserForm({ onSubmit, editingUser, onCancel }) {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "empleado" });

    useEffect(() => {
        if (editingUser) {
            setForm({ ...editingUser, password: "" }); // No mostrar contraseña
        }
    }, [editingUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
        setForm({ name: "", email: "", password: "", role: "empleado" });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold mb-2">{editingUser ? "Editar Usuario" : "Crear Usuario"}</h2>
            <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
            <input name="email" placeholder="Correo" value={form.email} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
            <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required={!editingUser} />
            <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 mb-2 border rounded">
                <option value="empleado">Empleado</option>
                <option value="admin">Admin</option>
            </select>
            <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editingUser ? "Actualizar" : "Crear"}</button>
                {editingUser && <button onClick={onCancel} className="text-red-500">Cancelar</button>}
            </div>
        </form>
    );
}
