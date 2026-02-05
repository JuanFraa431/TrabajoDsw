import React from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./public/global.css";
import App from "./App";

axios.defaults.baseURL = process.env.API_BASE_URL || "";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
