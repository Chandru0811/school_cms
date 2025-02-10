import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./styles/common.css";
import "./styles/custom.css";
import Admin from "./layouts/Admin";
import Auth from "./layouts/Auth";
import SuperAdmin from "./layouts/SuperAdmin";
import Student from "./layouts/Student";

function App() {
  const [schoolCMS_isAdminAuthenticated, setschoolCMS_isAdminAuthenticated] =
    useState(false);
  const [
    schoolCMS_isSuperAdminAuthenticated,
    setschoolCMS_isSuperAdminAuthenticated,
  ] = useState(false);
  const [
    schoolCMS_isStudentAuthenticated,
    setschoolCMS_isStudentAuthenticated,
  ] = useState(false);

  const loginAsAdmin = () => {
    localStorage.setItem("schoolCMS_isAdminAuthenticated", true);
    setschoolCMS_isAdminAuthenticated(true);
  };

  const loginAsSuperAdmin = () => {
    localStorage.setItem("schoolCMS_isSurperAdminAuthenticated", true);
    setschoolCMS_isSuperAdminAuthenticated(true);
  };

  const loginAsStudent = () => {
    localStorage.setItem("schoolCMS_isStudentAuthenticated", true);
    setschoolCMS_isStudentAuthenticated(true);
  };

  const logout = async () => {
    try {
      toast.success("Logged out successfully");
      setschoolCMS_isAdminAuthenticated(false);
      setschoolCMS_isSuperAdminAuthenticated(false);
      setschoolCMS_isStudentAuthenticated(false);
      localStorage.removeItem("schoolCMS_isAdminAuthenticated");
      localStorage.removeItem("schoolCMS_isSurperAdminAuthenticated");
      localStorage.removeItem("schoolCMS_isStudentAuthenticated");
      localStorage.removeItem("schoolCMS_token");
      localStorage.removeItem("schoolCMS_name");
      localStorage.removeItem("schoolCMS_id");
      localStorage.removeItem("schoolCMS_email");
      localStorage.removeItem("schoolCMS_role");
      localStorage.removeItem("schoolCMS_mobile");
    } catch (e) {
      toast.error("Logout unsuccessful", e?.response?.data?.message);
    }
  };

  useEffect(() => {
    const isAdminAuthFromStorage = localStorage.getItem(
      "schoolCMS_isAdminAuthenticated"
    );
    const isSuperAdminAuthFromStorage = localStorage.getItem(
      "schoolCMS_isSurperAdminAuthenticated"
    );
    const isStudentAuthFromStorage = localStorage.getItem(
      "schoolCMS_isStudentAuthenticated"
    );

    if (isAdminAuthFromStorage === "true") {
      setschoolCMS_isAdminAuthenticated(true);
    } else if (isSuperAdminAuthFromStorage === "true") {
      setschoolCMS_isSuperAdminAuthenticated(true);
    } else if (isStudentAuthFromStorage === "true") {
      setschoolCMS_isStudentAuthenticated(true);
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
      ) : schoolCMS_isStudentAuthenticated ? (
        <Student handleLogout={logout} />
      ) : (
        <Auth
          loginAsAdmin={loginAsAdmin}
          loginAsSuperAdmin={loginAsSuperAdmin}
          loginAsStudent={loginAsStudent}
        />
      )}
    </div>
  );
}

export default App;
