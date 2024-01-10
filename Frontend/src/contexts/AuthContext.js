import React, { createContext, useState, useCallback, useEffect } from "react";
import {
  session,
  createUser,
  loginUserApi,
  resetPasswordApi,
  logout,
  deleteUser as deleteUserAPI,
  credentials,
} from "../util/userUtil";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loggedIn: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    session().then((val) => {
      auth.user = val.user;
      auth.loggedIn = val.loggedIn;
      setAuth(auth);
      setIsLoading(false);
    });
  }, [auth]);

  const getLoggedIn = useCallback(async () => {}, []);

  const loginUser = async ({ email, password }) => {
    setIsLoading(true);

    const { success, data, error } = await loginUserApi(email, password);
    if (success) {
      console.log(data);
      const newAuth = {
        user: data.user,
        loggedIn: data.loggedIn,
      };
      setAuth(newAuth);
    } else {
      console.error("Error in logging in:", error);
    }

    setIsLoading(false);
    return { success, error };
  };

  const logoutUser = async () => {
    await logout();
    setAuth({ user: null, loggedIn: false });
    document.cookie = "authentication=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  };

  const deleteUser = async (userData) => {
    try {
      await credentials(userData.email, userData.password);
      await deleteUserAPI(userData._id);
      setAuth({ user: null, loggedIn: false });
      document.cookie = "authentication=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const registerUser = async ({ email, username, password }) => {
    // while loading we set isLoading to true so that we can show
    // loading progress bar or icon
    setIsLoading(true);

    const { success, data, error } = await createUser(
      email,
      username,
      password
    );

    if (success && data) {
      const newAuthState = {
        user: data.user,
        loggedIn: data.loggedIn,
      };

      setAuth(newAuthState);

    } else {
      // on error, we need 1 general popup for errors handling
      console.error("Error in fetching users:", error);
    }
    // when loading is complete setting isLoading to false and removing progress bar or icon
    setIsLoading(false);
    return { success, error };
  };

  const resetPassword = async (email) => {
    setIsLoading(true);

    const { success, error } = await resetPasswordApi(email);
    if (!success) {
      console.error("Error in resetting password:", error);
    }

    setIsLoading(false);
    return { success, error };
  };

  const getUserName = useCallback(() => {}, []);

  const updateUserName = useCallback(async () => {}, []);

  const updateEmail = useCallback(async () => {}, []);

  const updatePassword = useCallback(async () => {}, []);

  const updateAvatar = useCallback(async () => {}, []);

  const updateToken = useCallback(async () => {}, []);

  // Auth context value that will be provided to components
  const authContextValue = {
    auth,
    setAuth,
    isLoading,
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser,
    getUserName,
    resetPassword,
    updateUserName,
    updateEmail,
    updatePassword,
    deleteUser,
    updateAvatar,
    updateToken,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
