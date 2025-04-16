import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import ReportsDashboard from "./components/ReportsDashboard";
import UsersPage from "./pages/UsersPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import ManageDevicesPage from "./pages/ManageDevicesPage";
import ManageBranchesPage from "./pages/ManageBranchesPage";
import MainLayout from "./layouts/MainLayout";
import "./index.css";

// 🔒 Rutas privadas para usuarios autenticados
const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
};

// 🔒 Rutas privadas solo para administradores
const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user?.role === "admin" ? children : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* 🟢 Login */}
                    <Route path="/login" element={<LoginForm />} />

                    {/* 🔵 Layout principal para usuarios autenticados */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <MainLayout />
                            </PrivateRoute>
                        }
                    >
                        {/* 📌 Rutas accesibles para todos los usuarios autenticados */}
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="reportes" element={<ReportsDashboard />} />
                        <Route path="perfil" element={<ProfilePage />} />

                        {/* 🔴 Rutas solo para administradores */}
                        <Route
                            path="admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="usuarios"
                            element={
                                <AdminRoute>
                                    <UsersPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="dispositivos"
                            element={
                                <AdminRoute>
                                    <ManageDevicesPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="sucursales"
                            element={
                                <AdminRoute>
                                    <ManageBranchesPage />
                                </AdminRoute>
                            }
                        />
                    </Route>

                    {/* 🔁 Ruta por defecto */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
