import axios from "axios";
const baseUrl =
  "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com";
export const fetchActiveCampagnes = async (
    page: number,
    size: number,
    sort: any,
    filter?: string | null
  ) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sort: `${sort.col},${sort.type}`,
        ...buildParams(filter),
        'active.equals': 'true'
      });
  
      const response = await axios.get(`${baseUrl}/api/campagnes?${params}`);
      const total = response.headers["x-total-count"] || response.data.length;
      return { data: response.data, total };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  
const buildParams = (filter: string | null) => {
    const all: { [key: string]: any } = {};
    all["supprime.equals"] = false;
    if (filter && filter.trim().length > 0) {
      all["reference.contains"] = filter;
    }
    return all;
  };