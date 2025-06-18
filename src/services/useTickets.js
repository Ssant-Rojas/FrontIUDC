// import { useState } from "react";
// import { useFetch } from "./useFetch";

// export const useTickets = (serverUrl) => {
//   const [tickets, setTickets] = useState([]);
//   const { data, error, loading } = useFetch(`${serverUrl}/tickets`);

//   const createTicket = async (ticketData) => {
//     const response = await fetch(`${serverUrl}/tickets`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(ticketData),
//     });
//     if (response.ok) {
//       const newTicket = await response.json();
//       setTickets((prev) => [...prev, newTicket]);
//     }
//   };

//   return { tickets: data || [], error, loading, createTicket };
// };
