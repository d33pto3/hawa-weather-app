import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "./i18n";

import { NuqsAdapter } from "nuqs/adapters/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NuqsAdapter>
      <App />
    </NuqsAdapter>
  </React.StrictMode>
);
