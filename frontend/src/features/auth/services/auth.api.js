import api from "../../../services/api";

// Register user API
export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
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

// Login user API
export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
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

// Logout user API
export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");

    return response.data;
  } catch (error) {
    console.error(
      "Error logging out:",
      error.response?.data || error.message
    );

    throw error;
  }
}

// Get current logged-in user API
export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");

    return response.data;
  } catch (error) {
    console.error(
      "Error getting current user:",
      error.response?.data || error.message
    );

    throw error;
  }
}