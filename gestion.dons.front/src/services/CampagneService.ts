import axios from "axios";

const baseUrl =
  "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/campagnes";

const CampagneService = {
  fetchCampagnes: async (page: number, size: number, sort: any, filter: string | null) => {
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

  getCampagneById: async (id: number) => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching campagne:", error);
      throw error;
    }
  },

  createCampagne: async (campagneData: any) => {
    try {
      const response = await axios.post(baseUrl, campagneData);
      return response.data;
    } catch (error) {
      console.error("Error creating campagne:", error);
      throw error;
    }
  },

  updateCampagne: async (id: number, campagneData: any) => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, campagneData);
      return response.data;
    } catch (error) {
      console.error("Error updating campagne:", error);
      throw error;
    }
  },

  deleteCampagne: async (id: number) => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting campagne:", error);
      throw error;
    }
  },

  activateCampagne: async (id: number) => {
    try {
      const response = await axios.get(`${baseUrl}/activate/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error activating campagne:", error);
      throw error;
    }
  },

  deactivateCampagne: async (id: number) => {
    try {
      const response = await axios.get(`${baseUrl}/deactivate/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deactivating campagne:", error);
      throw error;
    }
  },
};

const buildParams = (filter: string | null) => {
  const all: { [key: string]: any } = {};
  all["supprime.equals"] = false;
  if (filter && filter.trim().length > 0) {
    all["libelle.contains"] = filter;
  }
  return all;
};



export default CampagneService;
