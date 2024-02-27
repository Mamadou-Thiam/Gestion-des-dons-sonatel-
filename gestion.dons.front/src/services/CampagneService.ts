import axios from "axios";

const baseUrl =
  "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com";

export const fetchCampagnes= async (
  page: number,
  size: number,
  filter?: string | null
) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      ...buildParams(filter),
    });
    const response = await axios.get(`${baseUrl}/api/campagnes?${params}`);
    const total = response.headers["x-total-count"] || response.data.length;
    return { data: response.data, total };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const buildParams = (filter?: string | null) => {
  const all = {};
  all["supprime.equals"] = false;
  if (filter && filter?.trim().length > 0) {
    all["libelle.contains"] = filter;
  }
  return all;
};
