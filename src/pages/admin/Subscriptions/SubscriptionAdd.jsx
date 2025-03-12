import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useEffect, useMemo, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MultiSelect } from "react-multi-select-component";
import { FiSave } from "react-icons/fi";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";

function SubscriptionAdd() {
  const [selectedWorksheet, setSelectedWorksheet] = useState([]);
  const [grades, setGrades] = useState([]);
  const [Worksheets, setWorksheets] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    grade_id: Yup.string().required("*Select a grade"),
    // worksheet_id: Yup.array()
    //   .of(Yup.string().required("*Select at least one Worksheet"))
    //   .min(1, "*Select at least one Worksheet")
    //   .required("*Select a Worksheet name"),
    name: Yup.string().required("*Name is a required"),
    price: Yup.string().required("*Price is a required"),
    duration: Yup.string().required("*Duration is a required"),
    // description: Yup.string().required("*Description is a required"),
    // details: Yup.string().required("*Details is a required"),
  });

  const formik = useFormik({
    initialValues: {
      grade_id: "",
      worksheet_id: [],
      name: "",
      details: "",
      price: "",
      duration: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form Values:", values);
      try {
        const response = await api.post("subscription", values);
        if (response.status === 200) {
          console.log("object", response);
          toast.success(response.data?.message);
          formik.resetForm();
          navigate("/subscription");
        }
      } catch (error) {
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;

          // Loop through errors and show each one in a toast
          Object.keys(errors).forEach((key) => {
            errors[key].forEach((errMsg) => {
              toast.error(errMsg);
            });
          });
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleDetailsChange = (value) => {
    formik.setFieldValue("details", value);
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

  const getWorksheetList = async (selectId) => {
    try {
      // If no grade_id is selected, fetch the entire list of worksheets
      if (!selectId || selectId.length === 0) {
        const response = await api.get("worksheets/list");
        const formattedWorksheets = response.data?.data?.map((worksheet) => ({
          value: worksheet.id,
          label: worksheet.title,
        }));
        setWorksheets(formattedWorksheets);
        return;
      }

      // Fetch worksheets based on the selected grade_id
      const response = await api.get(
        `filter/worksheets?grade_id[]=${selectId}`
      );
      const formattedWorksheets = response.data?.data?.map((worksheet) => ({
        value: worksheet.id,
        label: worksheet.title,
      }));
      setWorksheets(formattedWorksheets);

      // Reset the selected worksheets if they are not in the new list
      if (
        !formattedWorksheets.some((worksheet) =>
          formik.values.worksheet_id.includes(worksheet.value)
        )
      ) {
        formik.setFieldValue("worksheet_id", []);
        setSelectedWorksheet([]);
      }
    } catch (e) {
      toast.error(`Error Fetching: ${e?.response?.data?.error || e.message}`);
    }
  };

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

  const modules = useMemo(
    () => ({
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
        handlers: {
          ...toolbarHandlers,
          image: function () {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = () => {
              const file = input.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const image = new Image();
                  image.src = e.target.result;
                  image.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxWidth = 100; // Set the maximum width for the image
                    const scaleSize = maxWidth / image.width;
                    canvas.width = maxWidth;
                    canvas.height = image.height * scaleSize;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                    const resizedImage = canvas.toDataURL("image/jpeg");
                    const range = this.quill.getSelection();
                    this.quill.insertEmbed(range.index, "image", resizedImage);
                  };
                };
                reader.readAsDataURL(file);
              }
            };
          },
        },
      },
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: true,
      },
    }),
    []
  );

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
  ];

  useEffect(() => {
    getGradeList();
  }, []);

  useEffect(() => {
    getWorksheetList(formik.values.grade_id);
  }, [formik.values.grade_id]);

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
              <Link to="/subscription">
                <button type="button" className="btn btn-sm add-btn p-1">
                  <MdKeyboardArrowLeft size={25} />
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
            <span className="mx-3 table-heading">
              Add Subscription -&nbsp;
              <span className="table-subheading">Add a new Subscription</span>
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
              <FiSave className="trash-icon" /> &nbsp;&nbsp; Save Subscription
            </button>
          </div>
        </div>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex justify-content-between px-5 my-2">
            <p className="view-header">Subscription Info</p>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Grade</p>
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <select
                      className={`form-select form-select-sm ${
                        formik.touched.grade_id && formik.errors.grade_id
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.grade_id}
                      onChange={(e) => {
                        const selectedGradeId = e.target.value;
                        formik.setFieldValue("grade_id", selectedGradeId);
                      }}
                    >
                      <option value="">Select Grade ID</option>
                      {grades.map((grade) => (
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
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Worksheet</p>
                  </div>
                  <div className="col-7">
                    <MultiSelect
                      options={Worksheets}
                      value={selectedWorksheet}
                      onChange={(selected) => {
                        setSelectedWorksheet(selected);
                        formik.setFieldValue(
                          "worksheet_id",
                          selected.map((option) => option.value)
                        );
                      }}
                      labelledBy="Select Worksheet"
                      className="form-multi-select form-multi-select-sm border-1 rounded-1"
                    />
                    {formik.touched.worksheet_id &&
                      formik.errors.worksheet_id && (
                        <div className="invalid-feedback">
                          {formik.errors.worksheet_id}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Name</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.name && formik.errors.name
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("name")}
                      value={formik.values.name}
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
                    <p className="view-label-text">Price</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.price && formik.errors.price
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("price")}
                      value={formik.values.price}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <div className="invalid-feedback">
                        {formik.errors.price}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Duration</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <select
                      className={`form-select form-select-sm ${
                        formik.touched.duration && formik.errors.duration
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("duration")}
                    >
                      <option value="">Select Months</option>
                      <option value="1">One Month</option>
                      <option value="3">Three Months</option>
                      <option value="6">Six Months</option>
                      <option value="12">Twelve Months</option>
                    </select>
                    {formik.touched.duration && formik.errors.duration && (
                      <div className="invalid-feedback">
                        {formik.errors.duration}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Description</p>
                  </div>
                  <div className="col-7">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.description && formik.errors.description
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("description")}
                      value={formik.values.description}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="invalid-feedback">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row mb-4">
                  <div className="col-2">
                    <p className="view-label-text">Details</p>
                  </div>
                  <div className="col-10">
                    <ReactQuill
                      theme="snow"
                      value={formik.values.details}
                      onChange={handleDetailsChange}
                      modules={modules}
                      formats={formats}
                      className={`${
                        formik.touched.details && formik.errors.details
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.details && formik.errors.details && (
                      <div className="invalid-feedback">
                        {formik.errors.details}
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

export default SubscriptionAdd;
