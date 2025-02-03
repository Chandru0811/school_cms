import PropTypes from "prop-types";
import Home from "../pages/client/Home";

function Auth({ loginAsAdmin }) {
  return (
    <div>
      Auth
      <button className="btn btn-primary" onClick={loginAsAdmin}>
        Login
      </button>
      <Home />
    </div>
  );
}

Auth.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired,
};

export default Auth;
