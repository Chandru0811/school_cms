import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiSave } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import api from "../../../config/URL";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GoTrash } from "react-icons/go";

function SchoolEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object({
    name: Yup.string()
      .max(255, "*School Name must not exceed 255 characters")
      .required("*School Name is required"),
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
        gender: Yup.string().required("*Gender is required"),
        name: Yup.string()
          .max(255, "*Admin Name must be at most 255 characters")
          .required("*Admin Name is required"),
        mobile: Yup.string()
          .matches(
            /^(?:\d{8}|\d{10})$/,
            "*Mobile number must be either 8 or 10 digits"
          )
          .required("*Mobile number is required!"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      school_name: "",
      location: "",
      users: [{ name: "", email: "", mobile: "", gender: "" }],
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
        gender: values.users[0].gender,
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
                  gender: response.data.data.users[0].gender,
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
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <div className="d-flex justify-content-between align-items-center  p-1 mb-4">
          <div className="d-flex align-items-center">
            <div>
              <Link to="/school">
                <button type="button" className="btn btn-sm add-btn p-1">
                  <MdKeyboardArrowLeft size={25} />
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
            <span className="mx-3 table-heading">
              Update School -&nbsp;
              <span className="table-subheading">Update a School</span>
            </span>
          </div>
          <div className="my-2 d-flex align-items-center justify-content-between gap-5">
            <button
              type="button"
              className="btn view-delete-btn"
              onClick={() => {
                formik.resetForm();
                formik.setErrors({});
                formik.setTouched({}, false);
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Discard Changes
            </button>
            <button
              type="submit"
              className="btn add-btn"
              disabled={loadIndicator}
            >
              {loadIndicator && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}
              <FiSave className="trash-icon" /> &nbsp;&nbsp; Save School
            </button>
          </div>
        </div>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex justify-content-between px-5 my-2">
            <p className="view-header">School Info</p>
          </div>
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "500px" }}
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="container-fluid px-4">
              <div className="row py-4">
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text"> School Name</p>
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">School Address</p>
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text"> Admin Name</p>
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Admin Email</p>
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Admin Mobile</p>
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Gender</p>
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="male"
                            name="users[0].gender"
                            value="Male"
                            checked={formik.values.users[0].gender === "Male"}
                            onChange={formik.handleChange}
                          />
                          <label className="form-check-label" htmlFor="male">
                            Male
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="female"
                            name="users[0].gender"
                            value="Female"
                            checked={formik.values.users[0].gender === "Female"}
                            onChange={formik.handleChange}
                          />
                          <label className="form-check-label" htmlFor="female">
                            Female
                          </label>
                        </div>
                      </div>
                      {formik.touched.users?.[0]?.gender &&
                        formik.errors.users?.[0]?.gender && (
                          <div className="text-danger">
                            {formik.errors.users[0].gender}
                          </div>
                        )}
                    </div>
                  </div>
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
