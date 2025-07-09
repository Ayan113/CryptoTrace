import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { SidebarProvider } from "./contexts/useSidebar";
import { ThemeProvider } from "./contexts/useTheme";
import { MainContent } from "./pages/MainContent";
import { AuthPage } from "./pages/Auth";
import { Settings } from "./pages/Settings";
import { useAuth } from "./contexts/useAuth";
import { LandingPage } from "./pages/Landing";
import { RequestAccess } from "./pages/RequestAccess";
import { Shield } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { useStoreState } from "./store/hooks";
import { useToast } from "./hooks/use-toast";
import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
// @ts-ignore
import SSE from './sse.js';

EventSource = SSE;

function App() {
  const toast = useStoreState((state) => state.toastModel.toast);
  const uiToast = useToast();
  const { isAuthenticated } = useAuth();

  console.log("isAuthenticated", isAuthenticated);

  const setFavicon = (url: string) => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = url;
    document.head.appendChild(link);
  };

  useEffect(() => {
    if (toast) {
      uiToast.toast({
        description: toast.message,
        variant: toast.type === "error" ? "destructive" : "default",
      });
    }
  }, [toast]);

  const shieldIcon = `data:image/svg+xml,${encodeURIComponent(
    renderToStaticMarkup(<Shield />),
  )}`;
  setFavicon(shieldIcon);

  return (
    <ThemeProvider defaultTheme="dark">
      <SidebarProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route
              path="/auth"
              element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />}
            />
            <Route
              path="/*"
              element={
                <MainContent />
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated ? <Settings /> : <Navigate to="/landing" />
              }
            />
            <Route path="/request-access" element={<RequestAccess />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
