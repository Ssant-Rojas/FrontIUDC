import {useFetch} from "../../hooks/useFetch";
import apiService from "../../services/api";
import {Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, Tooltip, XAxis, YAxis} from "recharts";
import "../../styles/Dashboard/Dashboard.css";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";

const Dashboard = () => {
    const {user} = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ticketStats, setTicketStats] = useState(null);
    const [categoryStats, setCategoryStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await apiService.get("/informe/stats");
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const fetchTicketStats = async () => {
            try {
                const data = await apiService.get("/informe/tickets-por-mes");
                setTicketStats(data);
            } catch (err) {
                console.error("Error al cargar estadísticas de tickets:", err);
            }
        };

        fetchTicketStats();
    }, []);

    useEffect(() => {
        const fetchCategoryStats = async () => {
            try {
                const data = await apiService.get("/informe/stats/categories");
                setCategoryStats(data.categoryStats);
            } catch (err) {
                console.error("Error al cargar estadísticas de categorías:", err);
            }
        };

        fetchCategoryStats();
    }, []);


    if (loading) return <p>Cargando...</p>;

    const filteredTicketStats = ticketStats
        ? ticketStats.map((item) => {
            if (user.role === "admin") {
                return {...item};
            } else {
                const userRoles = ["Soporte a equipos", "Correo institucional", user.role];
                const filteredItem = { month: item.month, id: item.id };

                Object.keys(item).forEach(key => {
                    if (userRoles.includes(key) || key === "month" || key === "id") {
                        filteredItem[key] = item[key];
                    }
                });
                return filteredItem;
            }
        })
        : [];

    const filteredCategoryStats = categoryStats
        ? categoryStats.filter((category) => {
            if (user.role === "matriculas") return category.category === "Matriculas";
            if (user.role === "pagos") return category.category === "Pagos";
            if (user.role === "certificados") return category.category === "Certificados";
            return true;
        })
        : [];

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar datos</p>;


    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">📊 Dashboard Administrativo</h1>

            <div className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h2>Usuarios Registrados</h2>
                        <p className="stat-value">{stats.totalUsers}</p>
                    </div>
                    <div className="stat-card">
                        <h2>Tickets Abiertos</h2>
                        <p className="stat-value">{stats.openTickets}</p>
                    </div>
                    <div className="stat-card">
                        <h2>Tickets Resueltos</h2>
                        <p className="stat-value">{stats.resolvedTickets}</p>
                    </div>
                </div>
            </div>

            <div className="chart-section">
                <h2 className="chart-title">Tickets por Mes</h2>
                {console.log("Datos originales API:", ticketStats)}
                {console.log("Datos filtrados:", filteredTicketStats)}
                {console.log("Usuario actual:", user)}
                {filteredTicketStats && filteredTicketStats.length > 0 ? (
                    <BarChart width={600} height={300} data={filteredTicketStats} className="chart">
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="month"/>
                        <YAxis/>
                        <Tooltip/>
                        {Object.keys(filteredTicketStats[0])
                            .filter(key => key !== "month" && key !== "id")
                            .map((category, index) => (
                                <Bar
                                    key={category}
                                    dataKey={category}
                                    fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"][index % 5]}
                                    name={category}
                                />
                            ))
                        }
                    </BarChart>
                ) : (
                    <p>No hay datos disponibles para mostrar en el gráfico</p>
                )}
            </div>

            <div className="chart-section">
                <h2 className="chart-title">Distribución de Tickets por Categoría</h2>
                <div className="chart-container">
                    <div className="chart-info">
                        <h3>Tickets Resueltos vs Abiertos</h3>
                        <BarChart width={600} height={300} data={filteredCategoryStats} className="chart">
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="category"/>
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="resolved" fill="#82ca9d" name="Resueltos" />
                            <Bar dataKey="open" fill="#8884d8" name="Abiertos" />
                        </BarChart>
                    </div>
                    <div className="chart-info">
                        <h3>Distribución por Estado</h3>
                        <PieChart width={400} height={300} className="chart">
                            <Pie
                                data={filteredCategoryStats}
                                cx={200}
                                cy={150}
                                outerRadius={80}
                                dataKey="resolved"
                                nameKey="category"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {filteredCategoryStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={["#82ca9d", "#ffc658", "#ff8042", "#a4de6c"][index % 4]}/>
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} tickets resueltos`, name]} />
                        </PieChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
