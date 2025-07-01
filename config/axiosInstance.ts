import axios from "axios";

// Determinar si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV === "development";

// Crear instancia de axios
const api = axios.create({
  baseURL: process.env.SERVER_API || "https://api.consagradosajesus.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // En desarrollo, si hay error de conexión, devolver datos de muestra
    if (isDevelopment && (error.code === "ERR_NETWORK" || error.message === "Network Error")) {
      console.warn("[MODO DESARROLLO] API no disponible. Usando datos de muestra.");
      
      // Extraer la ruta de la URL solicitada
      const url = error.config?.url || "";
      
      // Devolver datos ficticios según la ruta
      if (url.includes("/combos")) {
        return Promise.resolve({
          data: [
            { id: "1", name: "Combo Básico", minPersons: 1, maxPersons: 2, price: 500 },
            { id: "2", name: "Combo Familiar", minPersons: 2, maxPersons: 5, price: 1200 },
            { id: "3", name: "Combo Grupo", minPersons: 5, maxPersons: 10, price: 2000 },
          ]
        });
      }
      
      if (url.includes("/events/current")) {
        return Promise.resolve({
          data: {
            id: "event-2025",
            name: "Consagrados a Jesús 2025",
            startDate: "2025-09-19T09:00:00",
            endDate: "2025-09-20T21:00:00",
            isActive: true,
            venue: "Centro de Convenciones Bahía Blanca"
          }
        });
      }
      
      // Para otras rutas
      return Promise.resolve({ data: [] });
    }
    
    return Promise.reject(error);
  }
);

export default api;