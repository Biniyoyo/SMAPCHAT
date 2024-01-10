import React, { createContext, useState } from "react";
import { getUsers } from "../util/userUtil";

export const GlobalStoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState({
    // The currently loaded GeoJSON data (after conversion). Used by the editors
    // to carry the data over after upload.
    currentMap: null,
    currentGeoJson: null,
    currentMapGraphic: null,
    currentMapComments: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  // call all of the functions here
  const handleFetchUsers = async () => {
    // while loading we set isLoading to true so that we can show
    // loading progress bar or icon
    setIsLoading(true);

    const { success, data, error } = await getUsers();
    if (success) {
      // here we need to set needed (global) store data
      console.log("fetched:", data);
    } else {
      // on error, we need 1 general popup for errors handling
      console.error("Error in fetching users:", error);
    }

    // when loading is complete setting isLoading to false and removing progress bar or icon
    setIsLoading(false);
  };

  const contextData = {
    store,
    setStore,
    isLoading,
    handleFetchUsers,
  };

  return (
    <GlobalStoreContext.Provider value={contextData}>
      {children}
    </GlobalStoreContext.Provider>
  );
};
