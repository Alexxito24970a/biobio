import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../components/RegisterModal";
export default function LoginForm() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

            if (response.data.token) {
                login(response.data.user, response.data.token);
                navigate("/dashboard");
            } else {
                setError("Error en el inicio de sesión");
            }
        } catch (err) {
            console.error("❌ Error en login:", err.response?.data?.message || err.message);
            setError("Credenciales incorrectas");
        }
    };

    return (
        
        <div
  className="min-h-screen bg-cover bg-center flex items-center justify-center"
  style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
>

          <form className="bg-white/80 p-8 rounded-lg shadow-lg max-w-md w-full" onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold text-center text-azul1 mb-4">Iniciar Sesión</h2>
      
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-azul1"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-azul1"
              required
            />
      
            <button
              type="submit"
              className="bg-azul1 hover:bg-azul2 text-white py-2 px-4 w-full rounded transition"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      );
      
}
