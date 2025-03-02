import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import 'react-quill/dist/quill.snow.css';

function SubscriptionEdit() {
  const [grade, setGrades] = useState([]);

  const toolbarHandlers = {
    undo: function () {
      this.quill.history.undo();
    },
    redo: function () {
      this.quill.history.redo();
    },
    maximize: function () {
      const editorContainer = document.querySelector(".ql-container");
      if (!document.fullscreenElement) {
        editorContainer.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
        ["undo", "redo", "maximize"],
      ],
      handlers: toolbarHandlers,
    },
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    // "video",
  ];

  const validationSchema = Yup.object({
    grade_id: Yup.string().required("*Select a grade"),
    name: Yup.string().required("*Name is a required"),
    details: Yup.string().required("*Details is a required"),
    price: Yup.string().required("*Price is a required"),
    duration: Yup.string().required("*Duration is a required"),
    description: Yup.string().required("*Description is a required"),
  });

  const formik = useFormik({
    initialValues: {
      grade_id: "",
      name: "",
      details: "",
      price: "",
      duration: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form Values:", values);
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleDescriptionChange = (value) => {
    formik.setFieldValue("description", value);
  };

  const getGradeList = async () => {
    try {
      const response = await api.get("grades/list");
      const formattedGrades = response.data.data.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));

      setGrades(formattedGrades);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  useEffect(() => {
    getGradeList();
  }, []);

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-3 px-2 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li>
          <Link to="/subscription" className="custom-breadcrumb text-sm">
            &nbsp;Subscriptions
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Subscriptions Edit
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
          <div className="d-flex justify-content-between align-items-center card_header p-1 mb-4 px-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted text-sm">
                Edit Subscriptions
              </span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/subscription">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button type="submit" className="btn btn-button">
                Update
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Grade<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.grade_id && formik.errors.grade_id ? "is-invalid" : ""}`}
                  value={formik.values.grade_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="grade_id"
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
                  Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${formik.touched.name && formik.errors.name
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("name")}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Price<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${formik.touched.price && formik.errors.price
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("price")}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="invalid-feedback">{formik.errors.price}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Duration<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${formik.touched.duration &&
                    formik.errors.duration
                    ? "is-invalid"
                    : ""
                    }`}
                  placeholder="Days"
                  {...formik.getFieldProps("duration")}
                  value={formik.values.duration}
                  onInput={(e) =>
                  (e.target.value = e.target.value.replace(
                    /\D/g,
                    ""
                  ))
                  }
                />
                {formik.touched.duration &&
                  formik.errors.duration && (
                    <div className="invalid-feedback">
                      {formik.errors.duration}
                    </div>
                  )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Details<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${formik.touched.details &&
                    formik.errors.details
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("details")}
                  value={formik.values.details}
                />
                {formik.touched.details &&
                  formik.errors.details && (
                    <div className="invalid-feedback">
                      {formik.errors.details}
                    </div>
                  )}
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <ReactQuill
                  theme="snow"
                  value={formik.values.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  formats={formats}
                  className={`${formik.touched.description && formik.errors.description
                    ? "is-invalid"
                    : ""
                    }`}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">
                    {formik.errors.description}
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

export default SubscriptionEdit;