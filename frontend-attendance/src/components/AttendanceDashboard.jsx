import { useEffect, useState } from 'react';
import { fetchAttendance } from '../api/attendanceApi';

export default function AttendanceDashboard() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchUser, setSearchUser] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchAttendance().then(data => {
            setAttendance(data);
            setLoading(false);
        });
    }, []);

    const filteredAttendance = attendance.filter(record => {
        const recordDate = new Date(record.timestamp);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        return (
            (searchUser === '' || record.user_id.toString().includes(searchUser)) &&
            (!start || recordDate >= start) &&
            (!end || recordDate <= end)
        );
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Registro de Asistencia</h1>

            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Buscar por ID de usuario"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Usuario</th>
                            <th className="p-2 border">Fecha y Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttendance.length > 0 ? (
                            filteredAttendance.map((record) => (
                                <tr key={record.id} className="border">
                                    <td className="p-2 border">{record.id}</td>
                                    <td className="p-2 border">{record.user_id}</td>
                                    <td className="p-2 border">{new Date(record.timestamp).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center p-4">No hay registros disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
