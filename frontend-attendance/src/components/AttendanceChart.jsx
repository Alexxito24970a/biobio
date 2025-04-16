// src/components/AttendanceChart.jsx
import { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// ✅ Registrar los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AttendanceChart({ userId, range = "week" }) {
  const { token } = useContext(AuthContext);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports/chart/attendance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { range, userId },
        });

        const labels = response.data.map(item => item.date);
        const entradas = response.data.map(item => parseInt(item.entradas));
        const salidas = response.data.map(item => parseInt(item.salidas));

        setChartData({
          labels,
          datasets: [
            {
              label: "Entradas",
              data: entradas,
              backgroundColor: "#3b82f6",
              borderRadius: 6,
            },
            {
              label: "Salidas",
              data: salidas,
              backgroundColor: "#ef4444",
              borderRadius: 6,
            }
          ],
        });
      } catch (err) {
        console.error("❌ Error al cargar el gráfico:", err);
        setChartData(null);
      }
    };

    if (token) {
      fetchChartData();
    }
  }, [userId, range, token]);

  if (!chartData) {
    return <p className="text-center text-gray-500">Cargando gráfico...</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Gráfico de Asistencia</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        }}
      />
    </div>
  );
}
