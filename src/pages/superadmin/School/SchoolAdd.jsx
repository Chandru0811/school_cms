import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../../../config/URL";

function SchoolAdd() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowCPassword] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    school_name: Yup.string()
      .max(255, "*School Name must not exceed 255 characters")
      .required("*School Name is required"),
    center_name: Yup.string()
      .max(255, "*Center Name must not exceed 255 characters")
      .required("*Center Name is required"),
    location: Yup.string()
      .max(255, "*Location must be at most 255 characters")
      .required("*School Location is required"),
    admin_name: Yup.string()
      .max(255, "*Admin Name must be at most 255 characters")
      .required("*Admin Name is required"),
    mobile: Yup.string()
      .matches(
        /^(?:\d{8}|\d{10})$/,
        "*Mobile number must be either 8 or 10 digits"
      )
      .required("*Mobile number is required!"),
    email: Yup.string()
      .email("*Invalid email address")
      .max(255, "*Email must not exceed 255 characters")
      .required("*Admin Email is required"),

    password: Yup.string()
      .required("*Admin Password is required")
      .min(8, "*Password must be at least 8 characters"),
    password_confirmation: Yup.string()
      .required("*Admin Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    gender: Yup.string().required("*Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      school_name: "",
      center_name: "",
      location: "",
      admin_name: "",
      email: "",
      mobile: "",
      password: "",
      gender: "",
      password_confirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("superAdmin/school", values);

        if (response.status === 200 && response.data.success) {
          toast.success(
            response.data.message || "School created successfully!"
          );
          formik.resetForm();
          navigate("/school");
        } else {
          toast.error(response.data.message || "An unexpected error occurred.");
        }
      } catch (e) {
        console.error("Error Fetching Data:", e);

        const errorData = e?.response?.data;

        if (errorData?.errors) {
          Object.values(errorData.errors).forEach((errorMessages) => {
            errorMessages.forEach((message) => toast.error(message));
          });
        } else {
          toast.error(errorData?.message || "An unexpected error occurred.");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
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
        className="breadcrumb my-3 d-flex align-items-center"
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
          &nbsp;School Add
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
              <span className="me-2 text-muted text-sm">Add School</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/school">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-sm btn-button"
                disabled={loadIndicator}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2 text-light"
                    aria-hidden="true"
                  ></span>
                )}
                Save
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
                  Center Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.center_name && formik.errors.center_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("center_name")}
                />
                {formik.touched.center_name && formik.errors.center_name && (
                  <div className="invalid-feedback">
                    {formik.errors.center_name}
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
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-6">
                    <label className="form-label view-label-text">Gender</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="male"
                          name="users[0].gender"
                          value="Male"
                          checked={formik.values.gender === "Male"}
                          onChange={formik.handleChange}
                        />
                        <label className="form-check-label" htmlFor="Male">
                          Male
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="Female"
                          name="users[0].gender"
                          value="Female"
                          checked={formik.values.gender === "Female"}
                          onChange={formik.handleChange}
                        />
                        <label className="form-check-label" htmlFor="Female">
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Admin Email<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Mobile<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onInput={(event) => {
                    event.target.value = event.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                  }}
                  className={`form-control ${
                    formik.touched.mobile && formik.errors.mobile
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("mobile")}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <div className="invalid-feedback">{formik.errors.mobile}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Password<span className="text-danger">*</span>
                  </label>
                  <div
                    className={`input-group mb-3`}
                    style={{ outline: "none", boxShadow: "none" }}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`form-control ${
                        formik.touched.password && formik.errors.password
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        borderRadius: "3px",
                        borderRight: "none",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      name="password"
                      {...formik.getFieldProps("password")}
                    />
                    <span
                      className={`input-group-text iconInputBackground`}
                      id="basic-addon1"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer", borderRadius: "3px" }}
                    >
                      {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </span>
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Confirm Password<span className="text-danger">*</span>
                  </label>
                  <div
                    className={`input-group mb-3`}
                    style={{ outline: "none", boxShadow: "none" }}
                  >
                    <input
                      type={showcPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`form-control ${
                        formik.touched.password_confirmation &&
                        formik.errors.password_confirmation
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        borderRadius: "3px",
                        borderRight: "none",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      name="password_confirmation"
                      {...formik.getFieldProps("password_confirmation")}
                    />
                    <span
                      className={`input-group-text iconInputBackground`}
                      id="basic-addon1"
                      onClick={toggleconfirmPasswordVisibility}
                      style={{ cursor: "pointer", borderRadius: "3px" }}
                    >
                      {showcPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </span>
                    {formik.touched.password_confirmation &&
                      formik.errors.password_confirmation && (
                        <div className="invalid-feedback">
                          {formik.errors.password_confirmation}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  School Address<span className="text-danger">*</span>
                </label>
                <textarea
                  rows={3}
                  className={`form-control ${
                    formik.touched.location && formik.errors.location
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("location")}
                  maxLength={825}
                />
                {formik.touched.location && formik.errors.location && (
                  <div className="invalid-feedback">
                    {formik.errors.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SchoolAdd;
