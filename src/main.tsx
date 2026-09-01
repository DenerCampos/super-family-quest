import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AiErrorToastListener } from "./components/AiErrorToastListener";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import i18n from "./i18n/config";
import theme, { TOAST_BOTTOM_OFFSET } from "./theme/theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <ThemeProvider>
              <ChakraProvider
                theme={theme}
                toastOptions={{
                  defaultOptions: {
                    position: "bottom",
                    containerStyle: {
                      marginBottom: TOAST_BOTTOM_OFFSET,
                    },
                  },
                }}
              >
                <AiErrorToastListener />
                <App />
              </ChakraProvider>
            </ThemeProvider>
          </AuthProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
