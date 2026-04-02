import API from "./api";

/* ---------------- REGISTER USER ---------------- */

export const registerUser = async (data) => {
  try {

    const response = await API.post("/auth/register", data);

    return response.data;

  } catch (error) {

    console.error("Register error:", error);

    throw error.response?.data || "Registration failed";

  }
};


/* ---------------- LOGIN USER ---------------- */

export const loginUser = async (data) => {
  try {

    const response = await API.post("/auth/login", data);

    const token = response.data;

    // save token
    localStorage.setItem("token", token);

    return token;

  } catch (error) {

    console.error("Login error:", error);

    throw error.response?.data || "Login failed";

  }
};


/* ---------------- LOGOUT ---------------- */

export const logoutUser = () => {

  localStorage.removeItem("token");

};