import React from "react";
import { useFetch } from "../hooks/useFetch";

const TestFetch = () => {
  const { data, error, loading } = useFetch("http://localhost:8080/api/tickets");

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Tickets</h1>
      <ul>
        {data.map((ticket) => (
          <li key={ticket.id}>{ticket.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestFetch;
