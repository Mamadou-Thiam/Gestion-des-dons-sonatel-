 import axios from "axios";

export const fetchGroupes = async (
  page: number,
  size: number,
  sort:any,
  filter?: string | null
) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort: `${sort.col},${sort.type}`,
      ...buildParams(filter),
    });
    const response = await axios.get(`/groupes?${params}`);
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
