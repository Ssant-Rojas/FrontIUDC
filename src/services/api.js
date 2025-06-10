const API_URLS = {
  tickets: "http://localhost:8080/api",
  categories: "http://localhost:8080/api"
};

const defaultConfig = {
  headers: {
    "Content-Type": "application/json"
  }
};

const addAuthHeader = (config) => {
  const userJson = localStorage.getItem('user');
  const userObj = userJson ? JSON.parse(userJson) : null;
  const token = userObj?.token;
  if (token) {
    const cleanToken = token.replace(/^"|"$/g, '');
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${cleanToken}`
      }
    };
  }
  return config;
};

// Manejador de respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Métodos HTTP principales
const apiService = {
  get: async (endpoint, service = 'tickets', customConfig = {}) => {
    const config = addAuthHeader({ ...defaultConfig, ...customConfig });
    try {
      const response = await fetch(`${API_URLS[service]}${endpoint}`, config);
      return handleResponse(response);
    } catch (error) {
      console.error('Error en petición GET:', error);
      throw error;
    }
  },

  post: async (endpoint, data, service = 'tickets', customConfig = {}) => {
    const config = addAuthHeader({
      ...defaultConfig,
      ...customConfig,
      method: 'POST',
      body: JSON.stringify(data)
    });
    try {
      const response = await fetch(`${API_URLS[service]}${endpoint}`, config);
      return handleResponse(response);
    } catch (error) {
      console.error('Error en petición POST:', error);
      throw error;
    }
  },

};

export default apiService;
