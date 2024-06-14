import axios from "axios";

const baseUrl =
  "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/groupes";

const GroupeService = {
  fetchGroupes: async (page, size, sort, filter) => {
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

  getGroupeById: async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching groupe:", error);
      throw error;
    }
  },

  createGroupe: async (groupeData) => {
    try {
      const response = await axios.post(baseUrl, groupeData);
      return response.data;
    } catch (error) {
      console.error("Error creating groupe:", error);
      throw error;
    }
  },

  updateGroupe: async (id, groupeData) => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, groupeData);
      return response.data;
    } catch (error) {
      console.error("Error updating groupe:", error);
      throw error;
    }
  },

  deleteGroupe: async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting groupe:", error);
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



export default GroupeService;
