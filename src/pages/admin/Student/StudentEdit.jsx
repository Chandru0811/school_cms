import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function StudentEdit() {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [roles, setRoles] = useState([]);
  const [center, setCenters] = useState([]);
  const [grade, setGrades] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const validationSchema = yup.object().shape({
    center_id: yup.string().required("*Select a center id"),
    role_id: yup.string().required("*Select a role"),
    first_name: yup.string().max(255, "*First Name must not exceed 255 characters").required("*Student first name is required"),
    student_email: yup
      .string()
      .email("*Email is Invalid")
      .required("*Student email is required"),
    student_mobile: yup.string()
      .matches(/^(?:\d{8}|\d{10})$/, "*Mobile number must be either 8 or 10 digits")
      .required("*Student Mobile number is required!"),
    parent_name: yup.string().required("*Parent name is required"),
    parent_email: yup
      .string()
      .email("*Email is Invalid")
      .required("*Parent email is required")
      .test("unique-email", "Student and Parent email must be different", function (value) {
        return value !== this.parent.student_email;
      }),
    parent_mobile: yup
      .string()
      .matches(/^(?:\d{8}|\d{10})$/, "*Mobile number must be either 8 or 10 digits")
      .required("Parent Mobile number is required!")
      .test("unique-mobile", "Student and Parent mobile number must be different", function (value) {
        return value !== this.parent.student_mobile;
      }),
    grade_id: yup.string().required("*Grader list is required"),
    roll_no: yup.string().max(255, "*Roll No must not exceed 255 characters").required("*Roll number is required"),
    admission_no: yup.string().max(255, "*Admission No must not exceed 255 characters").required("*Admission number is required"),
    date_of_birth: yup.string().required("*Date of Birth is required"),
    admission_date: yup.string().max(255, "*Admission Date must not exceed 255 characters").required("*Admission date is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: "",
      role_id: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      student_email: "",
      student_mobile: "",
      parent_name: "",
      parent_email: "",
      parent_mobile: "",
      grade_id: "",
      roll_no: "",
      admission_no: "",
      date_of_birth: "",
      admission_date: new Date().toISOString().split("T")[0],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`student/update/${id}`, values);

        if (response.status === 200) {
          toast.success(response.data.message);

          navigate("/student");
        }
      } catch (e) {
        toast.error("Error Fetching Data ", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`student/${id}`);
      const data = response.data.data;
      const formatedData = {
        center_id: data.center_id,
        role_id: data.student.role_id,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        student_email: data.student.email,
        student_mobile: data.student.mobile,
        parent_name: data.parent.name,
        parent_email: data.parent.email,
        parent_mobile: data.parent.mobile,
        grade_id: data.grade_id,
        roll_no: data.roll_no,
        admission_no: data.admission_no,
        date_of_birth: data.date_of_birth,
        admission_date: data.admission_date,
      };
      formik.setValues(formatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch payment type details.");
    }finally {
      setLoading(false);
    }
  };

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

  const getGradeList = async () => {
    try {
      if (!formik.values.center_id) {
        setGrades([]);
        formik.setFieldValue("grade_id", "");
        return;
      }
      const response = await api.get(`filter/grades?center_id[]=${formik.values.center_id}`);
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
    getCenterList();
    getRoleList();
    getData();
  }, [id]);
  useEffect(() => {
    getGradeList();
  }, [formik.values.center_id]);

  return (
    <div className="container card p-3">
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <ol
          className="breadcrumb my-3 text-sm"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          <li>
            <Link to="/" className="custom-breadcrumb">
              Home
            </Link>
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            <Link to="/student" className="custom-breadcrumb">
              &nbsp;Student
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            &nbsp;Student Edit
          </li>
        </ol>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted">Edit Student</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/student">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-button btn-sm me-2"
                style={{ fontWeight: "600px !important" }}
                disabled={loadIndicator}
              >
                Update
              </button>
            </div>
          </div>
          {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Center Name<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.center_id && formik.errors.center_id
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values?.center_id}
                  onChange={(e) =>
                    formik.setFieldValue("center_id", e.target.value)
                  }
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
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Grader List<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.grade_id && formik.errors.grade_id
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values?.grade_id}
                  onChange={(e) =>
                    formik.setFieldValue("grade_id", e.target.value)
                  }
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
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Role<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.role_id && formik.errors.role_id
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values?.role_id}
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
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Student First Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.first_name && formik.errors.first_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("first_name")}
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <div className="invalid-feedback">
                    {formik.errors.first_name}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Student Middle Name</label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("middle_name")}
                />
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Student Last Name</label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("last_name")}
                />
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Student Date of Birth<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.date_of_birth && formik.errors.date_of_birth
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
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Student Email<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.student_email && formik.errors.student_email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("student_email")}
                />
                {formik.touched.student_email &&
                  formik.errors.student_email && (
                    <div className="invalid-feedback">
                      {formik.errors.student_email}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Student Mobile<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.student_mobile &&
                    formik.errors.student_mobile
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("student_mobile")}
                />
                {formik.touched.student_mobile &&
                  formik.errors.student_mobile && (
                    <div className="invalid-feedback">
                      {formik.errors.student_mobile}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Parent Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.parent_name && formik.errors.parent_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parent_name")}
                />
                {formik.touched.parent_name && formik.errors.parent_name && (
                  <div className="invalid-feedback">
                    {formik.errors.parent_name}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Parent Email<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.parent_email && formik.errors.parent_email
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parent_email")}
                />
                {formik.touched.parent_email && formik.errors.parent_email && (
                  <div className="invalid-feedback">
                    {formik.errors.parent_email}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Parent Mobile Number<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.parent_mobile && formik.errors.parent_mobile
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parent_mobile")}
                />
                {formik.touched.parent_mobile &&
                  formik.errors.parent_mobile && (
                    <div className="invalid-feedback">
                      {formik.errors.parent_mobile}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Roll Number<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.roll_no && formik.errors.roll_no
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("roll_no")}
                />
                {formik.touched.roll_no && formik.errors.roll_no && (
                  <div className="invalid-feedback">
                    {formik.errors.roll_no}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Admission Number<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.admission_no && formik.errors.admission_no
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("admission_no")}
                />
                {formik.touched.admission_no && formik.errors.admission_no && (
                  <div className="invalid-feedback">
                    {formik.errors.admission_no}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Admission Date</label>
                <input
                  type="date"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.admission_date &&
                    formik.errors.admission_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("admission_date")}
                />
                {/* {formik.touched.admission_date && formik.errors.admission_date && (
              <div className="invalid-feedback">
                {formik.errors.admission_date}
              </div>
            )} */}
              </div>
            </div>
          </div>
        )}
        </div>
      </form>
    </div>
  );
}

export default StudentEdit;
