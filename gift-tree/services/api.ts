export const API_CONFIG = {
    CATAAS_URL: process.env.EXPO_PUBLIC_CATAAS_API_URL || "http://localhost:3000",
    headers: {
      accept: "application/json",
    },
  };
  
  export const fetchCatGif = async () => {
    const endpoint = `${API_CONFIG.CATAAS_URL}`

    const response = await fetch(endpoint, {
      method: "GET",
      headers: API_CONFIG.headers,
    });
  
    if (!response.ok) {
      // @ts-ignore
      throw new Error("Network response was not ok", response.statusText);
    }
  
    const data = await response.json();
    return data;
  };
  