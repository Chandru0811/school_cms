import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiSave } from "react-icons/fi";
import { MultiSelect } from "react-multi-select-component";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GoTrash } from "react-icons/go";

function StudentAdd() {
  const [roles, setRoles] = useState([]);
  const [center, setCenters] = useState([]);
  const [grade, setGrades] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);

  const validationSchema = yup.object().shape({
    center_id: yup.string().required("*Select a center id"),
    role_id: yup.string().required("*Select a role"),
    first_name: yup
      .string()
      .max(255, "*First Name must not exceed 255 characters")
      .required("*Student first name is required"),
    student_email: yup
      .string()
      .email("*Email is Invalid")
      .required("*Student email is required"),
    student_mobile: yup
      .string()
      .matches(
        /^(?:\d{8}|\d{10})$/,
        "*Mobile number must be either 8 or 10 digits"
      )
      .required("*Student Mobile number is required!"),
    grade_id: yup.string().required("*Grader list is required"),
    roll_no: yup
      .string()
      .max(255, "*Roll No must not exceed 255 characters")
      .required("*Roll number is required"),
    admission_no: yup
      .string()
      .max(255, "*Admission No must not exceed 255 characters")
      .required("*Admission number is required"),
    student_gender: yup.string().required("*Gender is required"),
    date_of_birth: yup.date()
      .required("*Date of Birth is required")
      .max(new Date(), "*Future date is not allowed"),
    admission_date: yup
      .string()
      .max(255, "*Admission Date must not exceed 255 characters")
      .required("*Admission date is required"),
    subscription_id: yup
      .array()
      .min(1, "*Select at least one Subscription")
      .required("*Select a center id"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: "",
      role_id: "",
      subscription_id: [],
      first_name: "",
      last_name: "",
      middle_name: "",
      student_email: "",
      student_gender: "",
      student_mobile: "",
      parent_name: "",
      parent_email: "",
      parent_mobile: "",
      grade_id: "",
      roll_no: "",
      admission_no: "",
      date_of_birth: "",
      admission_date: new Date().toLocaleDateString("en-CA"),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setLoadIndicator(true);
      try {
        const response = await api.post("student", values);
        console.log(response.status);

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/student");
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
  });

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      const formattedCenters = response.data.data.map((center) => ({
        value: center.id,
        label: center.name,
      }));

      setCenters(formattedCenters);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  const getRoleList = async () => {
    try {
      const response = await api.get("roles/list/limited");

      setRoles(response.data.data);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  const getSubscriptionListByGrade = async (gradeId) => {
    try {
      if (!gradeId) {
        setSubscriptions([]);
        return;
      }

      const response = await api.get(
        `filter/subscription?grade_id[]=${gradeId}`
      );

      console.log("API Response:", response.data);

      const formattedSubscriptions = response.data?.data?.map(
        (subscription) => ({
          value: subscription.id,
          label: subscription.name,
        })
      );

      setSubscriptions(formattedSubscriptions || []);
    } catch (e) {
      console.error("Error Fetching Subscriptions", e);
      toast.error(
        "Error Fetching Subscriptions",
        e?.response?.data?.error || e.message
      );
    }
  };

  const getGradeList = async () => {
    try {
      if (!formik.values.center_id) {
        setGrades([]);
        formik.setFieldValue("grade_id", "");
        return;
      }
      const response = await api.get(
        `filter/grades?center_id[]=${formik.values.center_id}`
      );
      const formattedGrades = response.data?.data?.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));
      setGrades(formattedGrades);
      if (!formattedGrades.some((s) => s.value === formik.values.grade_id)) {
        formik.setFieldValue("grade_id", "");
      }
    } catch (e) {
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  useEffect(() => {
    getGradeList();
  }, [formik.values.center_id]);

  useEffect(() => {
    getCenterList();
    getRoleList();
  }, []);

  useEffect(() => {
    if (formik.values.grade_id) {
      getSubscriptionListByGrade(formik.values.grade_id);
    } else {
      setSubscriptions([]);
    }
  }, [formik.values.grade_id]);

  return (
    <div className="container p-3">
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
              <Link to="/student">
                <button type="button" className="btn btn-sm add-btn p-1">
                  <MdKeyboardArrowLeft size={25} />
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
            <span className="mx-3 table-heading">
              Add Student -&nbsp;
              <span className="table-subheading">Add a new Student</span>
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
              <FiSave className="trash-icon" /> &nbsp;&nbsp; Save Student
            </button>
          </div>
        </div>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex justify-content-between px-5 my-2">
            <p className="view-header">Student Info</p>
          </div>
          <div className="container-fluid px-4">
            <div className="row border-top py-5">
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Centre Name</p>
                  </div>
                  <div className="col-7">
                    <select
                      className={`form-select form-select-sm ${formik.touched.center_id && formik.errors.center_id
                        ? "is-invalid"
                        : ""
                        }`}
                      value={formik.values.center_id}
                      onChange={(e) => {
                        formik.setFieldValue("center_id", e.target.value);
                        formik.setFieldValue("grade_id", "");
                        getGradeList();
                      }}
                    >
                      <option value="">Select Center</option>
                      {center.map((center) => (
                        <option key={center.value} value={center.value}>
                          {center.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.center_id && formik.errors.center_id && (
                      <div className="invalid-feedback">
                        {formik.errors.center_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Grader List</p>
                  </div>
                  <div className="col-7">
                    <select
                      className={`form-select form-select-sm${formik.touched.grade_id && formik.errors.grade_id
                        ? "is-invalid"
                        : ""
                        }`}
                      value={formik.values.grade_id}
                      onChange={(e) => {
                        formik.setFieldValue("grade_id", e.target.value);
                        getSubscriptionListByGrade(e.target.value);
                      }}
                    >
                      <option value="">Select Grade</option>
                      {grade.map((grade) => (
                        <option key={grade.value} value={grade.value}>
                          {grade.label}
                        </option>
                      ))}
                    </select>

                    {formik.touched.grade_id && formik.errors.grade_id && (
                      <div className="invalid-feedback">
                        {formik.errors.grade_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Subscriptions</p>
                  </div>
                  <div className="col-7">
                    <MultiSelect
                      options={subscriptions}
                      value={selectedSubscriptions}
                      onChange={(selected) => {
                        setSelectedSubscriptions(selected);
                        formik.setFieldValue(
                          "subscription_id",
                          selected.map((option) => option.value)
                        );
                      }}
                      labelledBy="Select Subscriptions"
                      className={`form-multi-select form-multi-select-sm border-1 rounded-1 ${formik.touched.subscription_id && formik.errors.subscription_id
                        ? "is-invalid"
                        : ""
                        }`}
                    />
                    {formik.touched.subscription_id &&
                      formik.errors.subscription_id && (
                        <div className="invalid-feedback">
                          {formik.errors.subscription_id}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Role</p>
                  </div>
                  <div className="col-7">
                    <select
                      className={`form-select form-select-sm ${formik.touched.role_id && formik.errors.role_id
                        ? "is-invalid"
                        : ""
                        }`}
                      value={formik.values.name}
                      onChange={(e) =>
                        formik.setFieldValue("role_id", e.target.value)
                      }
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>

                    {formik.touched.role_id && formik.errors.role_id && (
                      <div className="invalid-feedback">
                        {formik.errors.role_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Student First Name</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control form-control-sm ${formik.touched.first_name && formik.errors.first_name
                        ? "is-invalid"
                        : ""
                        }`}
                      placeholder="Enter Text"
                      {...formik.getFieldProps("first_name")}
                    />
                    {formik.touched.first_name && formik.errors.first_name && (
                      <div className="invalid-feedback">
                        {formik.errors.first_name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Student Middle Name</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className="form-control form-control-sm"
                      {...formik.getFieldProps("middle_name")}
                      placeholder="Enter Text"
                    />
                    {formik.touched.middle_name &&
                      formik.errors.middle_name && (
                        <div className="invalid-feedback">
                          {formik.errors.middle_name}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Student Last Name</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className="form-control form-control-sm"
                      {...formik.getFieldProps("last_name")}
                      placeholder="Enter Text"
                    />
                    {formik.touched.last_name && formik.errors.last_name && (
                      <div className="invalid-feedback">
                        {formik.errors.last_name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Gender</p>
                  </div>
                  <div className="col-7">
                    <div className="d-flex align-items-center">
                      {/* Male Radio Button */}
                      <div className="form-check me-3">
                        <input
                          type="radio"
                          id="male"
                          name="student_gender"
                          value="Male"
                          onKeyDown={(e) => e.stopPropagation()}
                          className="form-check-input"
                          {...formik.getFieldProps("student_gender")}
                        />
                        <label htmlFor="male" className="view-label-text form-check-label">Male</label>
                      </div>

                      {/* Female Radio Button */}
                      <div className="form-check">
                        <input
                          type="radio"
                          id="female"
                          name="student_gender"
                          value="Female"
                          onKeyDown={(e) => e.stopPropagation()}
                          className="form-check-input"
                          {...formik.getFieldProps("student_gender")}
                        />
                        <label htmlFor="female" className="view-label-text form-check-label">Female</label>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start">
                      <div>
                        {formik.touched.student_gender && formik.errors.student_gender && (
                          <div className="invalid-feedback d-block">
                            {formik.errors.student_gender}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Student Date of Birth</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control form-control-sm ${formik.touched.date_of_birth &&
                        formik.errors.date_of_birth
                        ? "is-invalid"
                        : ""
                        }`}
                      {...formik.getFieldProps("date_of_birth")}
                    />
                    {formik.touched.date_of_birth &&
                      formik.errors.date_of_birth && (
                        <div className="invalid-feedback">
                          {formik.errors.date_of_birth}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text"> Student Email</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="email"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control form-control-sm ${formik.touched.student_email &&
                        formik.errors.student_email
                        ? "is-invalid"
                        : ""
                        }`}
                      {...formik.getFieldProps("student_email")}
                      placeholder="Enter Text"
                    />
                    {formik.touched.student_email &&
                      formik.errors.student_email && (
                        <div className="invalid-feedback">
                          {formik.errors.student_email}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Student Mobile</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control form-control-sm ${formik.touched.student_mobile &&
                        formik.errors.student_mobile
                        ? "is-invalid"
                        : ""
                        }`}
                      {...formik.getFieldProps("student_mobile")}
                      placeholder="Enter Number"
                    />
                    {formik.touched.student_mobile &&
                      formik.errors.student_mobile && (
                        <div className="invalid-feedback">
                          {formik.errors.student_mobile}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Parent Name</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className="form-control form-control-sm"
                      {...formik.getFieldProps("parent_name")}
                      placeholder="Enter Text"
                    />
                    {formik.touched.parent_name &&
                      formik.errors.parent_name && (
                        <div className="invalid-feedback">
                          {formik.errors.parent_name}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Parent Email</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="email"
                      onKeyDown={(e) => e.stopPropagation()}
                      className="form-control form-control-sm "
                      {...formik.getFieldProps("parent_email")}
                      placeholder="Enter Text"
                    />
                    {formik.touched.parent_email &&
                      formik.errors.parent_email && (
                        <div className="invalid-feedback">
                          {formik.errors.parent_email}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Parent Mobile Number</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className="form-control form-control-sm"
                      {...formik.getFieldProps("parent_mobile")}
                      placeholder="Enter Text"
                    />
                    {formik.touched.parent_mobile &&
                      formik.errors.parent_mobile && (
                        <div className="invalid-feedback">
                          {formik.errors.parent_mobile}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Roll Number</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control form-control-sm ${formik.touched.roll_no && formik.errors.roll_no
                        ? "is-invalid"
                        : ""
                        }`}
                      placeholder="Enter Text"
                      {...formik.getFieldProps("roll_no")}
                    />
                    {formik.touched.roll_no && formik.errors.roll_no && (
                      <div className="invalid-feedback">
                        {formik.errors.roll_no}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Admission Number</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="text"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control form-control-sm ${formik.touched.admission_no &&
                        formik.errors.admission_no
                        ? "is-invalid"
                        : ""
                        }`}
                      placeholder="Enter Text"
                      {...formik.getFieldProps("admission_no")}
                    />
                    {formik.touched.admission_no &&
                      formik.errors.admission_no && (
                        <div className="invalid-feedback">
                          {formik.errors.admission_no}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="view-label-text">Admission Date</p>
                  </div>
                  <div className="col-7">
                    <input
                      type="date"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control form-control-sm ${formik.touched.admission_date &&
                        formik.errors.admission_date
                        ? "is-invalid"
                        : ""
                        }`}
                      {...formik.getFieldProps("admission_date")}
                    />
                    {formik.touched.admission_date &&
                      formik.errors.admission_date && (
                        <div className="invalid-feedback">
                          {formik.errors.admission_date}
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

export default StudentAdd;
