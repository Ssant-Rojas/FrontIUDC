import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiService from "../../services/api";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from "recharts";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [ticketStats, setTicketStats] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🎨 Colores centralizados
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

    // 🔄 Fetch general
    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);

                const [general, ticketsByMonth, categories] = await Promise.all([
                    apiService.get("/informe/stats"),
                    apiService.get("/informe/tickets-por-mes"),
                    apiService.get("/informe/stats/categories"),
                ]);

                setStats(general);
                setTicketStats(ticketsByMonth);
                setCategoryStats(categories.categoryStats);
            } catch (err) {
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (loading) return <div className="text-center py-10">⏳ Cargando datos del dashboard...</div>;
    if (error) return <p className="text-red-500 text-center">❌ {error}</p>;

    // 📊 Filtrado tickets por mes según rol
    const filteredTicketStats = ticketStats.map((item) => {
        if (user.role === "admin") return item;

        const userRoles = ["Soporte a equipos", "Correo institucional", user.role];
        const filteredItem = { month: item.month, id: item.id };

        Object.keys(item).forEach((key) => {
            if (userRoles.includes(key) || key === "month" || key === "id") {
                filteredItem[key] = item[key];
            }
        });
        return filteredItem;
    });

    // 📊 Filtrado categorías según rol
    const filteredCategoryStats = categoryStats.filter((category) => {
        if (user.role === "matriculas") return category.category === "Matriculas";
        if (user.role === "pagos") return category.category === "Pagos";
        if (user.role === "certificados") return category.category === "Certificados";
        return true;
    });

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">📊 Dashboard Administrativo</h1>

            {/* 📌 Resumen General */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-lg font-semibold">Usuarios Registrados</h2>
                    <p className="text-2xl font-bold text-primary">{stats.totalUsers ?? 0}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-lg font-semibold">Tickets Abiertos</h2>
                    <p className="text-2xl font-bold text-red-500">{stats.openTickets ?? 0}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-lg font-semibold">Tickets Resueltos</h2>
                    <p className="text-2xl font-bold text-green-500">{stats.resolvedTickets ?? 0}</p>
                </div>
            </div>

            {/* 📊 Gráficas en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tickets por Mes */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Tickets por Mes</h2>
                    {filteredTicketStats.length > 0 ? (
                        <BarChart width={500} height={300} data={filteredTicketStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {Object.keys(filteredTicketStats[0])
                                .filter((key) => key !== "month" && key !== "id")
                                .map((category, index) => (
                                    <Bar
                                        key={category}
                                        dataKey={category}
                                        fill={colors[index % colors.length]}
                                        name={category}
                                    />
                                ))}
                        </BarChart>
                    ) : (
                        <p className="text-gray-500">No hay datos disponibles</p>
                    )}
                </div>

                {/* Tickets Resueltos vs Abiertos */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Tickets Resueltos vs Abiertos</h2>
                    <BarChart width={500} height={300} data={filteredCategoryStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="resolved" fill="#82ca9d" name="Resueltos" />
                        <Bar dataKey="open" fill="#8884d8" name="Abiertos" />
                    </BarChart>
                </div>

                {/* Distribución por Estado */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Distribución por Estado</h2>
                    <PieChart width={600} height={350}>
                        <Pie
                            data={filteredCategoryStats}
                            cx={300}
                            cy={175}
                            outerRadius={120}
                            dataKey="resolved"
                            nameKey="category"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {filteredCategoryStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} tickets resueltos`, name]} />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
