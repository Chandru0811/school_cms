import PropTypes from "prop-types";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminSideBar from "../components/admin/AdminSideBar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";

function Admin({ handleLogout }) {
  return (
    <div>
      <div>
        <BrowserRouter>
          <div className="d-flex flex-column flex-lg-row bg-surface-secondary ">
            <AdminSideBar handleLogout={handleLogout} />

            <div className="flex-grow-1 h-screen overflow-y-lg-auto">
              <AdminHeader />
              <main className="pt-2" style={{ backgroundColor: "#f2f2f2" }}>
                <div style={{ minHeight: "90vh" }}>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="*" element={<AdminDashboard />} />
                  </Routes>
                </div>
                <AdminFooter />
              </main>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

Admin.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Admin;
