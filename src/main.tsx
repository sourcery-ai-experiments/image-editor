import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { CanvasContextProvider } from "./context/CanvasContext.tsx";
import { BrowserRouter } from "react-router-dom";
import Auth0ProviderWithNavigate from "./auth/index.tsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme/theme";
import { PaginationProvider } from "./context/MultiCanvasPaginationContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <ThemeProvider theme={theme}>
        <CanvasContextProvider>
          <PaginationProvider>
            <App />
          </PaginationProvider>
          <Toaster position="top-right" />
        </CanvasContextProvider>
      </ThemeProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
);
