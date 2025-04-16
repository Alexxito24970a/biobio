export default function UserTable({ users, onEdit, onDelete }) {
    return (
        <table className="w-full mt-6 bg-white rounded shadow-md">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2">ID</th>
                    <th className="p-2">Nombre</th>
                    <th className="p-2">Correo</th>
                    <th className="p-2">Rol</th>
                    <th className="p-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id} className="border-b">
                        <td className="p-2">{user.id}</td>
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.role}</td>
                        <td className="p-2">
                            <button onClick={() => onEdit(user)} className="text-blue-500 mr-2">Editar</button>
                            <button onClick={() => onDelete(user.id)} className="text-red-500">Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
