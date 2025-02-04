import PropTypes from "prop-types";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminSideBar from "../components/admin/AdminSideBar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";
import Topic from "../pages/admin/Topic/Topic";

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
                <div style={{ minHeight: "90vh" }} className="px-2">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="*" element={<AdminDashboard />} />

                    {/* Topic  */}
                    <Route path="/topic" element={<Topic />} />
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
