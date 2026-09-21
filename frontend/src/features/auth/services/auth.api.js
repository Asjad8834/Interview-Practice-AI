import api from "../../../services/api";

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error registering user:",
      error.response?.data || error.message
    );

    throw error;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error logging in:",
      error.response?.data || error.message
    );

    throw error;
  }
}

export async function logout() {
  try {
    const response = await api.get("/auth/logout");

    return response.data;
  } catch (error) {
    console.error(
      "Error logging out:",
      error.response?.data || error.message
    );

    throw error;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/auth/get-me");

    return response.data;
  } catch (error) {
    console.error(
      "Error getting current user:",
      error.response?.data || error.message
    );

    throw error;
  }
}