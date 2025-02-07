import { useFormik } from "formik";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import * as Yup from "yup";

function SchoolEdit() {
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowCPassword] = useState(false);

  const validationSchema = Yup.object({
    school_name: Yup.string().required("*School Name is required"),
    school_location: Yup.string().required("*School Location is required"),
    admin_name: Yup.string().required("*Admin Name is required"),
    admin_email: Yup.string()
      .email("Invalid email address")
      .required("Admin Email is required"),
    admin_password: Yup.string()
      .required("Admin Password is required")
      .min(8, "Password must be at least 8 characters"),
    admin_cpassword: Yup.string()
      .required("Admin Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      school_name: "",
      school_location: "",
      admin_name: "",
      admin_email: "",
      admin_password: "",
      admin_cpassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async () => {},
    validateOnChange: false,
    validateOnBlur: true,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleconfirmPasswordVisibility = () => {
    setShowCPassword(!showcPassword);
  };

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-3 px-2"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/servicegroup" className="custom-breadcrumb text-sm">
            &nbsp;School
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;School Edit
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <div className="card">
          <div className="d-flex justify-content-between align-items-center card_header p-2">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted text-sm">Edit School</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/school">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button type="submit" className="btn btn-sm btn-button">
                Update
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  School Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.school_name && formik.errors.school_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("school_name")}
                />
                {formik.touched.school_name && formik.errors.school_name && (
                  <div className="invalid-feedback">
                    {formik.errors.school_name}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  School Address<span className="text-danger">*</span>
                </label>
                <textarea
                  rows={5}
                  className={`form-control ${
                    formik.touched.school_location &&
                    formik.errors.school_location
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("school_location")}
                  maxLength={825}
                />
                {formik.touched.school_location &&
                  formik.errors.school_location && (
                    <div className="invalid-feedback">
                      {formik.errors.school_location}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Admin Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.admin_name && formik.errors.admin_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("admin_name")}
                />
                {formik.touched.admin_name && formik.errors.admin_name && (
                  <div className="invalid-feedback">
                    {formik.errors.admin_name}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Admin Email<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.admin_email && formik.errors.admin_email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("admin_email")}
                />
                {formik.touched.admin_email && formik.errors.admin_email && (
                  <div className="invalid-feedback">
                    {formik.errors.admin_email}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label fw-medium">Password</label>
                  <div
                    className={`input-group mb-3`}
                    style={{ outline: "none", boxShadow: "none" }}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`form-control ${
                        formik.touched.admin_password &&
                        formik.errors.admin_password
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        borderRadius: "3px",
                        borderRight: "none",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      name="admin_password"
                      {...formik.getFieldProps("admin_password")}
                    />
                    <span
                      className={`input-group-text iconInputBackground`}
                      id="basic-addon1"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer", borderRadius: "3px" }}
                    >
                      {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </span>
                    {formik.touched.admin_password &&
                      formik.errors.admin_password && (
                        <div className="invalid-feedback">
                          {formik.errors.admin_password}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Confirm Password
                  </label>
                  <div
                    className={`input-group mb-3`}
                    style={{ outline: "none", boxShadow: "none" }}
                  >
                    <input
                      type={showcPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`form-control ${
                        formik.touched.admin_cpassword &&
                        formik.errors.admin_cpassword
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        borderRadius: "3px",
                        borderRight: "none",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      name="admin_cpassword"
                      {...formik.getFieldProps("admin_cpassword")}
                    />
                    <span
                      className={`input-group-text iconInputBackground`}
                      id="basic-addon1"
                      onClick={toggleconfirmPasswordVisibility}
                      style={{ cursor: "pointer", borderRadius: "3px" }}
                    >
                      {showcPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </span>
                    {formik.touched.admin_cpassword &&
                      formik.errors.admin_cpassword && (
                        <div className="invalid-feedback">
                          {formik.errors.admin_cpassword}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SchoolEdit;
