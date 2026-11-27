import React from "react";
import ReactDOM from "react-dom/client";
import ManualPaymentPreview from "./ManualPaymentPreview";
import "./payments-preview.css";

ReactDOM.createRoot(document.getElementById("payments-preview-root")!).render(
  <React.StrictMode><ManualPaymentPreview /></React.StrictMode>,
);