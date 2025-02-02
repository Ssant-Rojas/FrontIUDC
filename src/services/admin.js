import axios from "axios";

const API_URL = "https://tu-api.com/api/admin";

export const getUsers = async () => axios.get(`${API_URL}/users`);
export const getReports = async () => axios.get(`${API_URL}/reports`);
export const updateSettings = async (data) => axios.put(`${API_URL}/settings`, data);
