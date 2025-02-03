import PropTypes from "prop-types";
// import Home from "../pages/client/Home";
import Login from "../components/auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "../components/auth/Register";
import Forgot from "../components/auth/Forgot";
import Reset from "../components/auth/Reset";

function Auth({ loginAsAdmin }) {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login loginAsAdmin={loginAsAdmin} />} />
          <Route path="*" element={<Login loginAsAdmin={loginAsAdmin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

Auth.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired,
};

export default Auth;
