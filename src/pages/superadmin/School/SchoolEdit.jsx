import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import api from "../../../config/URL";

function SchoolEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object({
    name: Yup.string().max(255, "*School Name must not exceed 255 characters").required("*School Name is required"),
    location: Yup.string()
      .max(255, "Location must be at most 255 characters")
      .required("*School Location is required"),
    // "users[0].name": Yup.string().required("*Admin Name is required"),
    // "users[0].mobile": Yup.string()
    //   .min(8, "Mobile number must be minimum 8")
    //   .max(10, "Mobile number must be maximun 10")
    //   .required("Mobile number is required!"),
    users: Yup.array().of(
      Yup.object({
        email: Yup.string()
          .email("*Invalid email address")
          .max(255, "*Email must not exceed 255 characters")
          .required("*Admin Email is required"),

        name: Yup.string().required("*Admin Name is required"),
        mobile: Yup.string()
          .matches(/^[0-9]{8,10}$/, "Mobile number must be 8 or 10 digits")
          .required("Mobile number is required!"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      school_name: "",
      location: "",
      users: [{ name: "", email: "", mobile: "" }],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);

      const payload = {
        ...values,
        school_name: values.name,
        location: values.location,
        admin_name: values.users[0].name,
        email: values.users[0].email,
        mobile: values.users[0].mobile,
      };

      try {
        const response = await api.put(
          `superAdmin/school/update/${id}`,
          payload
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/school");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          if (errors) {
            Object.keys(errors).forEach((key) => {
              errors[key].forEach((errorMsg) => {
                toast(errorMsg, {
                  icon: <FiAlertTriangle className="text-warning" />,
                });
              });
            });
          }
        } else {
          toast.error("An error occurred while deleting the record.");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`superAdmin/school/${id}`);
      if (response.data.data) {
        formik.setValues({
          name: response.data.data.name || "",
          location: response.data.data.location || "",
          users: response.data.data.users.length
            ? [
                {
                  name: response.data.data.users[0].name,
                  email: response.data.data.users[0].email,
                  mobile: response.data.data.users[0].mobile,
                },
              ]
            : [{ name: "", email: "" }],
        });
      }
    } catch (error) {
      toast.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <button
                type="submit"
                className="btn btn-sm btn-button"
                disabled={loadIndicator}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                Update
              </button>
            </div>
          </div>
          {loading ? (
            <div className="loader-container">
              <div className="loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <div className="container-fluid px-4">
              <div className="row py-4">
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    School Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.name && formik.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
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
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Admin Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.users?.[0]?.name &&
                      formik.errors.users?.[0]?.name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("users[0].name")}
                  />
                  {formik.touched.users?.[0]?.name &&
                    formik.errors.users?.[0]?.name && (
                      <div className="invalid-feedback">
                        {formik.errors.users[0].name}
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
                      formik.touched.users?.[0]?.email &&
                      formik.errors.users?.[0]?.email
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("users[0].email")}
                  />
                  {formik.touched.users?.[0]?.email &&
                    formik.errors.users?.[0]?.email && (
                      <div className="invalid-feedback">
                        {formik.errors.users?.[0]?.email}
                      </div>
                    )}
                </div>
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Admin Mobile<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.users?.[0]?.mobile &&
                      formik.errors.users?.[0]?.mobile
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("users[0].mobile")}
                  />
                  {formik.touched.users?.[0]?.mobile &&
                    formik.errors.users?.[0]?.mobile && (
                      <div className="invalid-feedback">
                        {formik.errors.users?.[0]?.mobile}
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default SchoolEdit;
