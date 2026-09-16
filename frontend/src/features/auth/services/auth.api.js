import axios from "axios";

/**
 * Since we are repeating the base url and with credentials everywhere
 *  const api = axios.create({
 *                             baseURL: "http://localhost:3000",
 *                             withCredentials: true
 *                           })
 */

/**
 * We can simply do this now
 *  const response = await api.post("/api/auth/register", { username, email, password }) and also no need to put withCredentials: true in every request
 */

// Register user API
export async function register({username, email, password}){
  try{
    const response = await axios.post("http://localhost:3000/api/auth/register", { 
      username, email, password // data to be sent
     }, {
      withCredentials: true // to send cookies with the request
   })

    return response.data;

  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Login user API
export async function login({ email, password }){
  try{
    const response = await axios.post("http://localhost:3000/api/auth/login", { 
      email, password //data to be sent
     }, {
      withCredentials: true
     })

     return response.data;

  }
  catch(error){
    console.log(error);
    throw error;
  }
}


// Log out user APi
export async function logout(){
  try{
    const response = await axios.get("http://localhost:3000/api/auth/logout", { withCredentials: true });

    return response.data;

  }
  catch(error){
    return console.log(error);
    throw error;
  }
}

//Get me user APi
export async function getMe(){
  try{
    const response = await axios.get("http://localhost:3000/api/auth/get-me", { withCredentials: true });

    return response.data;

  }
  catch(error){
    return console.log(error);
    throw error;
  }
}