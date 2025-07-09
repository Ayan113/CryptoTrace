import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/useAuth.tsx";
import { StoreProvider } from "easy-peasy";
import store from "./store/index.ts";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider store={store}> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </StoreProvider>
  </StrictMode>,
);
