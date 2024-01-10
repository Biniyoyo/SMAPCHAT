import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

import { createContext, useState } from "react";
import { StoreProvider } from "./contexts/GlobalStoreContext";

// Popup is much the same idea.
export const popContext = createContext();

function App() {
  const [popup, setPopup] = useState(null);

  const fullPopup =
    popup == null ? <></> : <div className="popupContainer">{popup}</div>;

  return (
    <AuthProvider>
      <StoreProvider>
        <popContext.Provider value={setPopup}>
          <RouterProvider router={router} />
          {fullPopup}
        </popContext.Provider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
