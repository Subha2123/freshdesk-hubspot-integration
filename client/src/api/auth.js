import { apiRequest } from ".";


export const signupUser = async (form) => {
  try {
    return await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });
  } catch (error) {
    console.error("signupUser Error:", error.message);
    return { success: false };
  }
};

export const googleLogin = async (tokenId) => {
  try {
    return await apiRequest("/auth/google", {
      method: "POST",
      body: JSON.stringify({ tokenId }),
    });
  } catch (error) {
    console.error("googleLogin Error:", error.message);
    return { success: false };
  }
};


export const signinUser = async (form) => {
  try {
    return await apiRequest("/auth/signin", {
      method: "POST",
      body: JSON.stringify(form),
    });
  } catch (error) {
    console.error("signinUser Error:", error.message);
    return { success: false };
  }
};


export const getCurrentUser = async () => {
  try {
    const res= await apiRequest("/auth/getUser");
    if (!res.user) {
      return { success: false, user: null };
    }
    return res
  } catch (error) {
    console.error("getCurrentUser Error:", error.message);
    return { success: false, user: null };
  }
};

export const logoutUser = async () => {
  try {
    return await apiRequest("/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("logoutUser Error:", error.message);
    return { success: false };
  }
};
