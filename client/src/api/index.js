const BASE_URL =  import.meta.env.VITE_API_URL || "http://localhost:8001/api";

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Something went wrong");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

