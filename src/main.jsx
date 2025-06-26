import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import EmbedBot from "./pages/EmbedBot";
import "./index.css"; // Optional: Tailwind or global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/embed" element={<EmbedBot />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
