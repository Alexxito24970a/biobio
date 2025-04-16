import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceChart from "../components/AttendanceChart";
import axios from "axios";
import { FaUserClock, FaCalendarAlt } from "react-icons/fa";

export default function Dashboard() {
    const { user, token } = useContext(AuthContext);
    const [attendanceData, setAttendanceData] = useState([]);
    const [resumen, setResumen] = useState({ entradas: 0, salidas: 0 });
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && token) {
            fetchAttendance();
            fetchResumen();
        }
    }, [fechaInicio, fechaFin, user]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/attendance/all", {
                headers: { Authorization: `Bearer ${token}` },
                params: { fechaInicio, fechaFin, userId: user.id },
            });
            setAttendanceData(response.data.data || []);
        } catch (error) {
            console.error("❌ Error cargando la asistencia:", error);
        }
        setLoading(false);
    };

    const fetchResumen = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/reports/stats", {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId: user?.id },
            });

            const entradas = res.data.find(item => item.status === "entrada")?.total || 0;
            const salidas = res.data.find(item => item.status === "salida")?.total || 0;

            setResumen({ entradas, salidas });
        } catch (error) {
            console.error("❌ Error al obtener resumen:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
            <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
                <div>
                    <h1 className="text-2xl font-bold text-blue-800">👋 Bienvenido, {user?.name}</h1>
                    <p className="text-blue-600">Rol: {user?.role}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <FaUserClock className="text-blue-500 text-3xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Resumen de Asistencia</h2>
                        <p className="text-gray-600">Total Entradas: {resumen.entradas}</p>
                        <p className="text-gray-600">Total Salidas: {resumen.salidas}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                    <FaCalendarAlt className="text-green-500 text-3xl mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Última Semana</h2>
                        <p className="text-gray-600">Datos por usuario</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Filtros de Búsqueda</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Fecha Inicio:</label>
                        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="p-2 border rounded-md w-40" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Fecha Fin:</label>
                        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="p-2 border rounded-md w-40" />
                    </div>
                    <button onClick={fetchAttendance} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition">
                        🔍 Filtrar
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center mt-6">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <AttendanceTable data={attendanceData} />
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                        <AttendanceChart userId={user?.id} range="week" />
                    </div>
                </>
            )}
        </div>
    );
}
