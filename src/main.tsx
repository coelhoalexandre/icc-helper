import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ControllerProvider } from "./context/ControllerContext/ControllerProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ControllerProvider>
      <App />
    </ControllerProvider>
  </StrictMode>
);
