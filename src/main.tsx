import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { IconX } from "@tabler/icons-react";

const root = document.getElementById("root");
root &&
  ReactDOM.createRoot(root).render(
    <React.Suspense>
      <BrowserRouter>
        <LanguageProvider>
          <App />
          <ToastContainer
            closeButton={
              <div
                style={{ paddingLeft: "16px" }}
                className="align-center flex justify-center"
              >
                <IconX />
              </div>
            }
            position="top-right"
            hideProgressBar={true}
            autoClose={3000}
            style={{
              width: "auto",
            }}
          />
        </LanguageProvider>
      </BrowserRouter>
    </React.Suspense>,
  );
