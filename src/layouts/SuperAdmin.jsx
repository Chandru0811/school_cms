import PropTypes from "prop-types";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuperAdminSideBar from "../components/superadmin/SuperAdminSideBar";
import SuperAdminHeader from "../components/superadmin/SuperAdminHeader";
import SuperAdminFooter from "../components/superadmin/SuperAdminFooter";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import School from "../pages/superadmin/School/School";
import SchoolAdd from "../pages/superadmin/School/SchoolAdd";
import SchoolEdit from "../pages/superadmin/School/SchoolEdit";
import SchoolView from "../pages/superadmin/School/SchoolView";

function SuperAdmin({ handleLogout }) {

  return (
    <div>
      <div>
        <BrowserRouter basename="/schoolCms"> 
          <div className="d-flex flex-column flex-lg-row bg-surface-secondary">
          <SuperAdminSideBar />
            <div className="flex-grow-1 max-h-screen overflow-y-auto">
              <SuperAdminHeader handleLogout={handleLogout} />
              <main className="pt-2 bg-surface-secondary">
                <div className="px-2" style={{ minHeight: "80vh" }}>
                  <Routes>
                    <Route path="/" element={<SuperAdminDashboard />} />
                    <Route path="*" element={<SuperAdminDashboard />} />

                    {/* School  */}
                    <Route path="/school" element={<School />} />
                    <Route path="/school/add" element={<SchoolAdd />} />
                    <Route path="/school/edit/:id" element={<SchoolEdit />} />
                    <Route path="/school/view/:id" element={<SchoolView />} />
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
