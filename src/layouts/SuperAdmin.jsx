import PropTypes from "prop-types";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuperAdminSideBar from "../components/superadmin/SuperAdminSideBar";
import SuperAdminHeader from "../components/superadmin/SuperAdminHeader";
import SuperAdminFooter from "../components/superadmin/SuperAdminFooter";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";

function SuperAdmin({ handleLogout }) {

  return (
    <div>
      <div>
        <BrowserRouter>
          <div className="d-flex flex-column flex-lg-row bg-surface-secondary ">
            <SuperAdminSideBar handleLogout={handleLogout} />

            <div className="flex-grow-1 h-screen overflow-y-lg-auto">
              <SuperAdminHeader />
              <main className="pt-2" style={{ backgroundColor: "#f2f2f2" }}>
                <div style={{ minHeight: "90vh" }}>
                  <Routes>
                    <Route path="/" element={<SuperAdminDashboard />} />
                    <Route path="*" element={<SuperAdminDashboard />} />
                  </Routes>
                </div>
                <SuperAdminFooter />
              </main>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

SuperAdmin.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default SuperAdmin;
