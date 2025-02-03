import { useState } from "react";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import headerlogo from "../../assets/images/logo.webp";
import { IoMdArrowBack } from "react-icons/io";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
    cpassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoadIndicator(true);
      console.log(values);
      setTimeout(() => setLoadIndicator(false), 2000);
    },
  });

  return (
    <div className="container-fluid m-0 vh-100" style={{ minHeight: "100vh", backgroundColor: "#f2f2f2" }}>
      <div className="d-flex justify-content-center align-items-center pt-5" style={{ backgroundColor: "#f2f2f2" }}>
        <img src={headerlogo} className="img-fluid" alt="img" />
      </div>
      <div className="d-flex justify-content-center align-items-center mt-3">
        <div className="card shadow-lg p-3 my-5 rounded" style={{ width: "100%", maxWidth: "400px" }}>
          <Link to="/">
            <button className="btn btn-link text-start shadow-none">
              <IoMdArrowBack style={{ color: "#1555ff" }} />
            </button>
          </Link>
          <div className="d-flex justify-content-around">
            <h3 className="py-2" style={{ borderBottom: "2px solid #1555ff", paddingBottom: "5px", width: "100%", textAlign: "center", color: "#1555ff" }}>
              Register
            </h3>
          </div>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="name" className="mb-3 pt-4">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                {...formik.getFieldProps("name")}
                isInvalid={formik.touched.name && !!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3 pt-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...formik.getFieldProps("email")}
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
            </Form.Group>

            {/* Password Field */}
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
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
                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </span>
                )}
                <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
              </div>
            </Form.Group>

            {/* Confirm Password Field */}
            <Form.Group controlId="cpassowrd" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter confrim password"
                  {...formik.getFieldProps("cpassword")}
                  isInvalid={formik.touched.cpassword && formik.errors.cpassword}
                />
                {formik.values.cpassword && (
                  <span
                    onClick={togglePasswordVisibility}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                  >
                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </span>
                )}
                <Form.Control.Feedback type="invalid">{formik.errors.cpassword}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Button type="submit" className="w-100 mt-4 common-button" disabled={loadIndicator}>
              {loadIndicator && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
              Register
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired,
};

export default Register;
