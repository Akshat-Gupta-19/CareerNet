import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AuthContext from "./context/AuthContext.jsx";
import UserContext from "./context/UserContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <UserContext>
        <App />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "14px",
              background: "#ffffff",
              color: "#1f2937",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 35px rgba(0, 0, 0, 0.10)",
            },

            success: {
              iconTheme: {
                primary: "#0a9ccf",
                secondary: "#ffffff",
              },
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </UserContext>
    </AuthContext>
  </BrowserRouter>,
);
