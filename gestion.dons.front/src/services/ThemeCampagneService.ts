import axios from "axios";

const baseUrl =
  "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/theme-campagnes";

const ThemeCampagneService = {
  fetchThemeCampagnes: async (page, size, sort, filter) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sort: `${sort.col},${sort.type}`,
        ...buildParams(filter),
      });
      const response = await axios.get(`${baseUrl}?${params}`);
      const total = response.headers["x-total-count"] || response.data.length;
      return { data: response.data, total };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getThemeCampagneById: async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  },

  createThemeCampagne: async (patientData) => {
    try {
      const response = await axios.post(baseUrl, patientData);
      return response.data;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  },

  updateThemeCampagne: async (id, patientData) => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, patientData);
      return response.data;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  },

  deleteThemeCampagne: async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  },
};



const buildParams = (filter) => {
  const all = {};
  all["supprime.equals"] = false;
  if (filter && filter.trim().length > 0) {
    all["libelle.contains"] = filter;
  }
  return all;
};



export default ThemeCampagneService;
