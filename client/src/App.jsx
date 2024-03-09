import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./pages/Layout";
import { useTheme } from "./contexts/ThemeContext";
import "../theme-config.css";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Toaster } from "sonner";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PassswordReset";

function App() {
  const { theme } = useTheme();

  return (
    <Theme
      accentColor="red"
      radius="medium"
      grayColor="gray"
      panelBackground="solid"
      appearance={theme}
    >
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoutes>
                <Layout />
              </ProtectedRoutes>
            }
          >
            <Route path="/" element={<Layout />} />
          </Route>
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<PasswordReset />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" expand={true} richColors />
    </Theme>
  );
}

export default App;
