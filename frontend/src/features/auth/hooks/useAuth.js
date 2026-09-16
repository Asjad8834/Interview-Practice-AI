import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";

import { login, register, logout, getMe } from "../services/auth.api";


export const useAuth = () =>{

  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context

  //Login user function
  const handleLogin = async ({ email, password }) => {
    setLoading(true)
    try{
      const data = await login({ email, password });

      setUser(data.user); // because in the backend we are sending the user data in the response as {user: userData}
    }
    catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }

  }

  //Register user function
  const handleRegister = async ({ username, email, password }) => {
    setLoading(true)
    try{
      const data = await register({ username, email, password });

      setUser(data.user); // because in the backend we are sending the user data in the response as {user: userData}
    }
    catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }


  }

  //Logout user function
  const handleLogout = async () => {
    setLoading(true)
    try{
      const data = await logout();
      setUser(null);
    }
    catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  //Get current user function
  const handleGetMe = async () => {
    setLoading(true)
    try{
      const data = await getMe();
      setUser(data.user);
    }
    catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  // when the user refresh the page the user is directed back to the ogin oage to stop taht we will use the below code to get the user data from the backend and set it in the context so that the user is not logged out when the page is refreshed

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);




  return {user, loading, handleLogin, handleRegister, handleLogout, handleGetMe};
}