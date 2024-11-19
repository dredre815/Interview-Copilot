import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css";
import "./styles/global.css";
import "./styles/components.css";
import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find root element");
}

try {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Rendering error:", error);
  container.innerHTML = `
    <div style="color: red; padding: 20px;">
      Failed to load application. Please check console for details.
    </div>
  `;
}
