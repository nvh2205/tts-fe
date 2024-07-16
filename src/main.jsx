import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { UserControllerProvider } from "@/context/user";
import "../public/css/tailwind.css";
import { AudioControllerProvider } from "./context/audio";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GlobalControllerProvider } from "./context/global";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="348416483646-4j26sdaei9de4nh3vlk2kj4jv8d7acel.apps.googleusercontent.com">
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <GlobalControllerProvider>
            <UserControllerProvider>
              <AudioControllerProvider>
                <App />
              </AudioControllerProvider>
            </UserControllerProvider>
          </GlobalControllerProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
