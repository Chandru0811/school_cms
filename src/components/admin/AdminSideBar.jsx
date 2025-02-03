import PropTypes from "prop-types";

function AdminSideBar({ handleLogout }) {
  return (
    <div>
      AdminSideBar{" "}
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
AdminSideBar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default AdminSideBar;
