import { useState } from "react";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom"; 
import headerlogo from "../../assets/images/logo.webp";

const Login = ({ loginAsAdmin, loginAsSuperAdmin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoadIndicator(true);
  
      if (values.email === "admin@gmail.com") {
        loginAsAdmin();
      } else if (values.email === "superadmin@gmail.com") {
        navigate("/");
        loginAsSuperAdmin();
      } else {
        alert("Invalid email! Please use admin@gmail.com or superadmin@gmail.com");
      }
  
      setTimeout(() => setLoadIndicator(false), 2000);
    },
  });

  return (
    <div className="container-fluid m-0 vh-100" style={{ minHeight: "100vh", backgroundColor: "#f2f2f2" }}>
      <div className="d-flex justify-content-center align-items-center m-0 pt-5" style={{ backgroundColor: "rgb(242, 242, 242)" }}>
        <img src={headerlogo} className="img-fluid" alt="school" />
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="card shadow-lg p-3 mb-5 mt-0 rounded" style={{ width: "100%", maxWidth: "400px" }}>
          <div className="d-flex justify-content-around">
            <h3 className="cursor-pointer py-2" style={{ borderBottom: "2px solid #1555ff", paddingBottom: "5px", width: "100%", textAlign: "center", color: "#1555ff" }}>Login</h3>
          </div>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3 pt-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...formik.getFieldProps("email")}
                isInvalid={formik.touched.email && formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center py-2">
              <Form.Label>Password</Form.Label>
              <Link to="/forgot" className="ml-auto" style={{ fontSize: "0.9em", textDecoration: "none", color: "#1555ff" }}>Forgot Password?</Link>
            </div>
            <Form.Group controlId="formPassword" className="mb-3">
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...formik.getFieldProps("password")}
                  isInvalid={formik.touched.password && formik.errors.password}
                />
                {formik.values.password && (
                  <span
                    onClick={togglePasswordVisibility}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
                <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Button type="submit" className="w-100 mt-4 common-button" disabled={loadIndicator}>
              {loadIndicator && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
              Login
            </Button>

            <div className="text-center mt-4">
              <p className="mb-3">or</p>
              <Link to="/register">
                <Button variant="light" className="border shadow-none" style={{ width: "100%" }}>
                  Register
                </Button>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired,
  loginAsSuperAdmin: PropTypes.func.isRequired,
};

export default Login;