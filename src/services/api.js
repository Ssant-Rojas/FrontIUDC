import axios from "axios";

const API_URL = "https://tu-api.com/api/admin";

export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos del dashboard:", error);
    return null;
  }
};
