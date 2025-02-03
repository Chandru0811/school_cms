import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import headerlogo from "../../assets/images/logo.webp";

const Forgot = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("*Invalid email address")
      .required("*Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      navigate("/reset");
    },
  });

  return (
    <section>
      <div
        className="container-fluid m-0 vh-100"
        style={{ minHeight: "100vh", backgroundColor: "#f2f2f2" }}
      >
        <div
          className="d-flex justify-content-center align-items-center m-0 pt-5"
          style={{ backgroundColor: "rgb(242, 242, 242)" }}
        >
          <img src={headerlogo} className="img-fluid" alt="img" />
        </div>
        <div className=" d-flex  justify-content-center align-items-center mt-3">
          <div className="row mt-5">
            <div
              className="card shadow-lg p-3 mb-5 rounded"
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <h3
                className="cursor-pointer py-2 mb-3"
                style={{
                  borderBottom: "2px solid #1555ff",
                  paddingBottom: "5px",
                  width: "100%",
                  textAlign: "center",
                  color: "#1555ff",
                }}
              >
                Forgot Password
              </h3>
              <p
                className="text-center text-muted mb-4"
                style={{ fontSize: "0.9rem" }}
              >
                Enter the email address or mobile phone number associated with
                your account.
              </p>

              <form onSubmit={formik.handleSubmit}>
                <div className="form-group mb-4 mt-2">
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control rounded-0 ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : formik.touched.email && !formik.errors.email
                        ? "is-valid"
                        : ""
                    }`}
                    placeholder="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="invalid-feedback mt-0">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>

                {/* <Link to="/"> */}
                <button
                  type="submit"
                  className="btn btn-primary common-button btn-block mt-3 rounded-0 w-100"
                  style={{ backgroundColor: "#1555ff", borderColor: "#1555ff" }}
                >
                  RESET PASSWORD
                </button>
                {/* </Link> */}
              </form>

              <div className="text-center mt-3 mb-4">
                <Link to="/">
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Go Back to &nbsp;
                    <span style={{ color: "#1555ff" }}>Login</span>
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forgot;
