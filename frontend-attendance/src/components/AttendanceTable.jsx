import React from "react";

const AttendanceTable = ({ data }) => {
    // Validar si data es un arreglo
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="bg-white mt-6 p-4 rounded-lg shadow-md text-center text-gray-600">
                No hay registros de asistencia para mostrar.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-3 border-b">Usuario</th>
                        <th className="p-3 border-b">Fecha y Hora</th>
                        <th className="p-3 border-b">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50 border-t">
                            <td className="p-3">{record.user_id}</td>
                            <td className="p-3">
                                {new Date(record.timestamp).toLocaleString("es-MX", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </td>
                            <td className="p-3 capitalize">{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
