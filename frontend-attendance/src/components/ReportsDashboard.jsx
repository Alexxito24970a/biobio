import { downloadExcel, downloadPDF, getAttendanceStats } from "../api/reportsApi";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import AttendanceChart from "../components/AttendanceChart";



export default function ReportsDashboard() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getAttendanceStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: stats.map((s) => s.status),
        datasets: [
            {
                label: "Cantidad de Registros",
                data: stats.map((s) => s.total),
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Reportes de Asistencia</h2>

            <div className="flex gap-4">
                <button onClick={downloadExcel} className="bg-green-500 text-white px-4 py-2 rounded">Exportar Excel</button>
                <button onClick={downloadPDF} className="bg-red-500 text-white px-4 py-2 rounded">Exportar PDF</button>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-bold">Estadísticas</h3>
                <Bar data={chartData} />
            </div>
        </div>
    );
}
