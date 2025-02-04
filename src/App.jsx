import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./styles/common.css";
import "./styles/custom.css";
import Admin from "./layouts/Admin";
import Auth from "./layouts/Auth";
import SuperAdmin from "./layouts/SuperAdmin";

function App() {
  const [schoolCMS_isAdminAuthenticated, setschoolCMS_isAdminAuthenticated] =
    useState(false);
  const [
    schoolCMS_isSuperAdminAuthenticated,
    setschoolCMS_isSuperAdminAuthenticated,
  ] = useState(false);

  const loginAsAdmin = () => {
    localStorage.setItem("schoolCMS_isAdminAuthenticated", true);
    setschoolCMS_isAdminAuthenticated(true);
  };

  const loginAsSuperAdmin = () => {
    localStorage.setItem("schoolCMS_isSurperAdminAuthenticated", true);
    setschoolCMS_isSuperAdminAuthenticated(true);
  };

  const logout = async () => {
    try {
      toast.success("Logged out successfully");
      setschoolCMS_isAdminAuthenticated(false);
      localStorage.removeItem("schoolCMS_isAdminAuthenticated");
    } catch (e) {
      toast.error("Logout unsuccessful", e?.response?.data?.message);
    }
  };

  useEffect(() => {
    const isAdminAuthFromStorage = localStorage.getItem(
      "schoolCMS_isAdminAuthenticated"
    );

    if (isAdminAuthFromStorage === "true") {
      setschoolCMS_isAdminAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <Toaster
        toastOptions={{
          style: {
            background: "rgb(51 65 85)",
            color: "#fff",
          },
        }}
      />
      {schoolCMS_isAdminAuthenticated ? (
        <Admin handleLogout={logout} />
      ) : schoolCMS_isSuperAdminAuthenticated ? (
        <SuperAdmin handleLogout={logout} />
      ) : (
        <Auth
          loginAsAdmin={loginAsAdmin}
          loginAsSuperAdmin={loginAsSuperAdmin}
        />
      )}
    </div>
  );
}

export default App;
