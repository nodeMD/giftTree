import { CatGifResponse, TreesApiResponse } from "@/types/api";

export const API_CONFIG = {
  CATAAS_URL: process.env.EXPO_PUBLIC_CATAAS_API_URL!,
  TREFLE_URL: process.env.EXPO_PUBLIC_TREFLE_API_URL!,
  headers: {
    accept: "application/json",
  },
};

export const fetchCatGif = async (): Promise<CatGifResponse> => {
  const endpoint = `${API_CONFIG.CATAAS_URL}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: API_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const fetchTreeData = async (
  query: string,
  limit: number,
): Promise<TreesApiResponse> => {
  const endpoint = `${API_CONFIG.TREFLE_URL}/plants/search?token=${process.env.EXPO_PUBLIC_TREFLE_TOKEN}&q=${query}&limit=${limit}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: API_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
