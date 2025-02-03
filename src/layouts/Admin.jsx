import PropTypes from "prop-types";
import AdminDashboard from "../pages/admin/AdminDashboard";

function Admin({ handleLogout }) {
  return (
    <div>
      Admin
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      <AdminDashboard />
    </div>
  );
}

Admin.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Admin;
