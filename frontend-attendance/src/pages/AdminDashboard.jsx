import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaFileExcel, FaFilePdf, FaHistory, FaBell, FaTimes } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import socket from "../socket";
import { toast } from "react-toastify";

export default function AdminDashboard() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [stats, setStats] = useState({ entradas: 0, salidas: 0, totalUsuarios: 0 });
    const [actividadReciente, setActividadReciente] = useState([]);
    const [dispositivos, setDispositivos] = useState([]);
    const [actividadEnTiempoReal, setActividadEnTiempoReal] = useState([]);
    const [mostrarWidget, setMostrarWidget] = useState(true);
    const [chartData, setChartData] = useState(null);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");

    useEffect(() => {
        if (user?.role === "admin" && token) {
          fetchStats();
          fetchActividad();
          fetchDispositivos();
          fetchChartData();
          fetchBranches();
        } else if (user && user.role !== "admin") {
            navigate("/dashboard");
        }
    }, [user, token]);

    useEffect(() => {
        if (user?.role !== "admin") return navigate("/dashboard");

        socket.on("newAttendance", (data) => {
            toast.info(`🕎️ Nueva asistencia: Usuario ${data.userId} - ${data.status}`, {
                position: "bottom-left",
            });

            setActividadEnTiempoReal(prev => {
                const nuevaActividad = [{ ...data, timestamp: new Date().toISOString() }, ...prev];
                return nuevaActividad.slice(0, 5);
            });

            fetchActividad();
        });

        return () => {
            socket.off("newAttendance");
        };
    }, [user]);
    const fetchBranches = async () => {
      try {
          const { data } = await axios.get("http://localhost:5000/api/branches", {
              headers: { Authorization: `Bearer ${token}` },
          });
          setBranches(data);
      } catch (err) {
          console.error("❌ Error cargando sucursales:", err);
      }
  };
    const fetchStats = async () => {
        try {
            const [asistenciaRes, usuariosRes] = await Promise.all([
                axios.get("http://localhost:5000/api/reports/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:5000/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const entradas = asistenciaRes.data.find(s => s.status === "entrada")?.total || 0;
            const salidas = asistenciaRes.data.find(s => s.status === "salida")?.total || 0;

            setStats({
                entradas,
                salidas,
                totalUsuarios: usuariosRes.data.length,
            });
        } catch (err) {
            console.error("❌ Error cargando estadísticas:", err);
        }
    };

    const fetchActividad = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/attendance/recent", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setActividadReciente(data.slice(-5).reverse());
        } catch (error) {
            console.error("❌ Error cargando actividad:", error);
        }
    };

    const fetchDispositivos = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/devices", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDispositivos(data);
        } catch (error) {
            console.error("❌ Error al cargar dispositivos:", error);
            toast.error("Error al cargar dispositivos");
        }
    };

    const fetchChartData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/reports/chart/attendance", {
                headers: { Authorization: `Bearer ${token}` },
                params: { range: "week" },
            });

            const labels = res.data.map(item => item.date);
            const entradas = res.data.map(item => item.entradas);
            const salidas = res.data.map(item => item.salidas);

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Entradas",
                        data: entradas,
                        backgroundColor: "#3b82f6",
                    },
                    {
                        label: "Salidas",
                        data: salidas,
                        backgroundColor: "#ef4444",
                    },
                ],
            });
        } catch (error) {
            console.error("❌ Error cargando datos del gráfico:", error);
        }
    };

    const syncAllDevices = async () => {
      try {
          const res = await axios.post("http://localhost:5000/api/devices/sync-all", {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          toast.success(res.data.message || "Sincronización completada");
      } catch (err) {
          console.error("❌ Error al sincronizar todos los dispositivos:", err);
          toast.error("Error al sincronizar dispositivos");
      }
  };

  const handleDownload = (type) => {
      let url = `http://localhost:5000/api/reports/export/${type}`;
      if (selectedBranch) url += `?branchId=${selectedBranch}`;
      window.open(url);
  };


    return (
        <div className="min-h-screen bg-gray-100 p-6 ml-64">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">👑 Panel de Administración</h1>

            <div className="my-6">
                <button
                    onClick={syncAllDevices}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded shadow"
                >
                    🚀 Ejecutar sincronización global
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

    {/* 🔍 Filtro por sucursal */}
    <div className="mb-4 col-span-full">
        <label className="text-sm text-gray-700 mr-2">Filtrar por sucursal:</label>
        <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="p-2 border rounded"
        >
            <option value="">Todas</option>
            {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
        </select>
    </div>

    {/* 👤 Usuarios */}
    <div className="bg-white shadow p-4 rounded flex items-center gap-4">
        <FaUsers className="text-3xl text-blue-600" />
        <div>
            <p className="text-gray-500 text-sm">Usuarios registrados</p>
            <p className="text-xl font-bold">{stats.totalUsuarios}</p>
        </div>
    </div>

    {/* 📄 PDF */}
    <div className="bg-white shadow p-4 rounded flex items-center gap-4">
        <FaFilePdf className="text-3xl text-red-500" />
        <div>
            <p className="text-gray-500 text-sm">Exportar PDF</p>
            <button onClick={() => handleDownload("pdf")} className="text-blue-600 underline text-sm">
                Descargar
            </button>
        </div>
    </div>

    {/* 📊 Excel */}
    <div className="bg-white shadow p-4 rounded flex items-center gap-4">
        <FaFileExcel className="text-3xl text-green-500" />
        <div>
            <p className="text-gray-500 text-sm">Exportar Excel</p>
            <button onClick={() => handleDownload("excel")} className="text-blue-600 underline text-sm">
                Descargar
            </button>
        </div>
    </div>
</div>

            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">📊 Gráfico de Asistencia</h2>
                {chartData ? (
                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
                ) : (
                    <p className="text-gray-500">Cargando gráfico...</p>
                )}
            </div>

            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">🖥️ Dispositivos conectados</h2>
                <ul className="space-y-2">
                    {dispositivos.map((d, idx) => (
                        <li key={idx} className="flex justify-between items-center border p-3 rounded">
                            <div>
                                <p className="font-semibold">{d.name}</p>
                                <p className="text-sm text-gray-600">IP: {d.ip_address}</p>
                                <p className="text-sm text-gray-500">Sucursal: {d.branch_name || "Sin sucursal"}</p>
                            </div>
                            <span className={`text-sm font-semibold px-2 py-1 rounded ${d.status === "activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {d.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaHistory /> Actividad reciente
                </h2>
                {actividadReciente.length > 0 ? (
                    <ul className="divide-y">
                        {actividadReciente.map((a, i) => (
                            <li key={i} className="py-2 flex justify-between text-sm text-gray-700">
                                <span>👤 Usuario {a.user_id}</span>
                                <span>📅 {new Date(a.timestamp).toLocaleString()}</span>
                                <span className={`font-bold ${a.status === "entrada" ? "text-green-600" : "text-red-500"}`}>
                                    {a.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No hay actividad reciente.</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => navigate("/usuarios")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Gestionar usuarios
                </button>
                <button onClick={() => navigate("/dashboard")} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                    Ver dashboard general
                </button>
            </div>

            {actividadEnTiempoReal.length > 0 && mostrarWidget && (
                <div className="fixed bottom-4 right-4 w-80 max-h-96 overflow-y-auto bg-white shadow-xl rounded-lg border border-blue-200 z-50">
                    <div className="p-3 border-b flex justify-between items-center bg-blue-100 rounded-t">
                        <h2 className="text-blue-700 font-semibold">🕒 En tiempo real</h2>
                        <button onClick={() => setMostrarWidget(false)} className="text-red-500 hover:text-red-700">
                            <FaTimes />
                        </button>
                    </div>
                    <ul className="p-2 space-y-2 text-sm text-gray-700">
                        {actividadEnTiempoReal.map((item, i) => (
                            <li key={i} className="flex justify-between items-center border-b pb-1">
                                <span>👤 Usuario {item.userId}</span>
                                <span className={item.status === "entrada" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{item.status}</span>
                                <span className="text-gray-400 text-xs">{new Date(item.timestamp).toLocaleTimeString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!mostrarWidget && (
                <button onClick={() => setMostrarWidget(true)} className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
                    <FaBell />
                </button>
            )}
        </div>
    );
}
