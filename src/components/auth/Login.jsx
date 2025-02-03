import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";

const Login = ({ loginAsAdmin }) => {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      loginAsAdmin();
    },
  });

  return (
    <div
      className="container vh-100"
      style={{ minHeight: "100vh", backgroundColor: "#f2f2f2" }}
    >
      <div className="card bg-secondary col-md-6 offset-md-3 mt-5 p-3">
        <div style={{ marginTop: "100px" }}>
          <h2 className="text-center">Login</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${
                  formik.touched.email && formik.errors.email
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>
            <div className="my-3 d-flex justify-content-between">
              <a href="/register">Register</a>
              <a href="/forgot-password">Forgot Password</a>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary mt-3 w-100">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  loginAsAdmin: PropTypes.func.isRequired,
};

export default Login;
