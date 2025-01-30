import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Lunes", Tickets: 40 },
  { name: "Martes", Tickets: 30 },
  { name: "Miércoles", Tickets: 20 },
  { name: "Jueves", Tickets: 27 },
  { name: "Viernes", Tickets: 18 },
];

function Charts() {
  return (
    <div className="charts-container">
      <h3>Tickets Resueltos por Día</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="6 6" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type={"monotone"} dataKey="Tickets" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;
