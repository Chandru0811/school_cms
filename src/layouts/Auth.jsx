import PropTypes from "prop-types";
import Home from "../pages/client/Home";
import Login from "../components/auth/Login";

function Auth({ loginAsAdmin }) {
  return (
    <div>
      {/* <button className="btn btn-primary" onClick={loginAsAdmin}>
        Login
      </button> */}
      <Login />
      {/* <Home /> */}
    </div>
  );
}

Auth.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired,
};

export default Auth;
