import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { FiAlertTriangle } from "react-icons/fi";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { FaFileDownload } from "react-icons/fa";

function QuestionAdd() {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const fileInputRef = useRef(null);

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .of(yup.string().required("*Select at least one centre"))
      .min(1, "*Select at least one centre")
      .required("*Select a centre name"),
    grade_id: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Select a subject"),
    topic_id: yup.string().required("*Select a topic"),
    question: yup
      .string()
      .nullable()
      .when("uploadType", {
        is: "upload",
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required("*Question is required"),
      }),
    ques_type: yup
      .array()
      .nullable()
      .when("uploadType", {
        is: "upload",
        then: (schema) => schema.notRequired(),
        otherwise: (schema) =>
          schema
            .min(1, "*Select at least one question type")
            .required("*Select a question type"),
      }),
    difficult_level: yup
      .string()
      .nullable()
      .when("uploadType", {
        is: "upload",
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required("*Select a difficult level"),
      }),
    bulkImg: yup.mixed().when("uploadType", {
      is: "upload",
      then: (schema) => schema.required("*File is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
      subject_id: "",
      topic_id: "",
      uploadType: "manual",
      bulkImg: null,
      difficult_level: "",
      question: "",
      upload: null,
      ques_type: [],
      answer: [],
      answer_upload: null,
      options: [
        { id: Date.now(), value: "" },
        { id: Date.now() + 1, value: "" },
      ],
      hint: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values:", values);
      setLoadIndicator(true);
      // handleSubmit();

      const formData = new FormData();
      // const fieldsToConvert = ["center_id"];
      const fieldsToConvert = ["center_id", "ques_type"];

      fieldsToConvert.forEach((field) => {
        if (Array.isArray(values[field])) {
          values[field].forEach((item) => {
            formData.append(`${field}[]`, item);
          });
        } else {
          formData.append(`${field}[]`, values[field]);
        }
      });
      formData.append("grade_id", values.grade_id);
      formData.append("subject_id", values.subject_id);
      formData.append("topic_id", values.topic_id);
      if (values.uploadType === "upload") {
        formData.append("ques_type[]", "multichoice");

        const validRows = rows.filter((row, rowIndex) => {
          const isValid = columns.every((col) => {
            const value = row[col.field];
            return value !== null && value !== undefined && value !== "" && !(typeof value === "string" && value.trim() === "");
          });
          return isValid;
        });
        if (validRows.length !== rows.length) {
          toast("Some rows have missing values. Please fill them.", {
            icon: "⚠️",
          });
          setLoadIndicator(false);
          return;
        }
        
        rows.forEach((row, index) => {
          formData.append(`questions[${index}][question]`, row["Question"] || "");
          formData.append(`questions[${index}][options][]`, row["Option 1"] || "");
          formData.append(`questions[${index}][options][]`, row["Option 2"] || "");
          formData.append(`questions[${index}][options][]`, row["Option 3"] || "");
          formData.append(`questions[${index}][options][]`, row["Option 4"] || "");
          formData.append(`questions[${index}][difficult_level]`, row["difficult_level"] || "");
          formData.append(`questions[${index}][hint]`, row["Hint"] || "");

          const selectedOptionLabel = row["Answer"];
          const selectedOptionValue = row[`Option ${selectedOptionLabel.replace("Option", "").trim()}`];
          formData.append(`questions[${index}][answer][multichoice]`, selectedOptionValue || "");
        });
      } else {
        formData.append("question", values.question);
        formData.append("difficult_level", values.difficult_level);
        formData.append("hint", values.hint);

        const optionsArray = values.options.map((option) => option.value);
        optionsArray.forEach((option) => {
          formData.append("options[]", option);
        });

        const selectedAnswer = values.answer[0]?.multichoice;
        if (selectedAnswer) {
          formData.append("answer[multichoice]", selectedAnswer);
        }

        if (values.upload) {
          formData.append("upload", values.upload);
        }
        if (values.answer_upload) {
          formData.append("answer_upload", values.answer_upload);
        }
      }

      try {
        let url = values.uploadType === "upload" ? "multiple/questions" : "question";
        const response = await api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 201 || response.status === 200) {
          toast.success(response.data.message);
          navigate("/question");
        } else {
          toast(response.data.message);
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
      console.log("center", formattedCenters);
      setCenterList(formattedCenters);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };
  const getGradeList = async () => {
    try {
      if (selectedCenter.length === 0) {
        setGrades([]);
        formik.setFieldValue("grade_id", "");
        return;
      }

      const centerIds = selectedCenter
        .map((center) => `center_id[]=${center.value}`)
        .join("&");
      const response = await api.get(`filter/grades?${centerIds}`);

      const formattedGrades = response.data?.data?.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));

      setGrades(formattedGrades);

      // Reset grade & subject if current values are no longer valid
      if (!formattedGrades.some((g) => g.value === formik.values.grade_id)) {
        formik.setFieldValue("grade_id", "");
        formik.setFieldValue("subject_id", "");
      }
    } catch (e) {
      toast.error(
        `Error Fetching Grades: ${e?.response?.data?.error || e.message}`
      );
    }
  };
  const getSubjectList = async () => {
    try {
      if (!formik.values.grade_id) {
        setSubjects([]);
        formik.setFieldValue("subject_id", "");
        return;
      }
      const response = await api.get(
        `filter/subjects?grade_id[]=${formik.values.grade_id}`
      );
      const formattedSubjects = response.data?.data?.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }));
      setSubjects(formattedSubjects);
      if (
        !formattedSubjects.some((s) => s.value === formik.values.subject_id)
      ) {
        formik.setFieldValue("subject_id", "");
      }
    } catch (e) {
      toast.error(
        `Error Fetching Subjects: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  const getTopicsList = async () => {
    try {
      if (!formik.values.subject_id) {
        setTopics([]);
        formik.setFieldValue("topic_id", "");
        return;
      }
      const response = await api.get(
        `filter/topics?subject_id[]=${formik.values.subject_id}`
      );
      const formattedTopics = response.data?.data?.map((topic) => ({
        value: topic.id,
        label: topic.name,
      }));
      setTopics(formattedTopics);
      if (!formattedTopics.some((s) => s.value === formik.values.topic_id)) {
        formik.setFieldValue("topic_id", "");
      }
    } catch (e) {
      toast.error(
        `Error Fetching Topics: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      formik.setFieldValue("ques_type", [...formik.values.ques_type, value]);
      if (value === "multichoice" && formik.values.options.length < 2) {
        formik.setFieldValue("options", [
          { id: Date.now(), value: "" },
          { id: Date.now() + 1, value: "" },
        ]);
      }
    } else {
      formik.setFieldValue(
        "ques_type",
        formik.values.ques_type.filter((option) => option !== value)
      );
      if (value === "multichoice") {
        formik.setFieldValue("options", []);
      }
    }
  };

  useEffect(() => {
    getCenterList();
  }, []);

  useEffect(() => {
    getGradeList();
  }, [selectedCenter]);

  useEffect(() => {
    getSubjectList();
  }, [formik.values.grade_id]);

  useEffect(() => {
    getTopicsList();
  }, [formik.values.subject_id]);

  const handleDownload = () => {
    const fileUrl = "/schoolCms/MCQ%20Format.xlsx";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "MCQ Question Format.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    formik.setFieldValue("bulkImg", file);
    setShowTable(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) return;

      const headers = jsonData[0]; // Extract headers

      const formattedData = jsonData
        .slice(1) // Remove header row
        .map((row, rowIndex) =>
          headers.reduce(
            (acc, key, index) => {
              acc[key] = row[index]?.toString().trim() || ""; // Convert undefined/null to empty string
              return acc;
            },
            { id: rowIndex } // Add unique ID for DataGrid
          )
        )
        .filter(
          (row) => headers.some((key) => row[key] !== "") // Ensure at least one non-empty column
        );

      // Set columns dynamically & enable editing
      const gridColumns = headers.map((header) => ({
        field: header,
        headerName: header,
        flex: 1, // Auto adjust width
        minWidth: 150, // Prevent too small columns
        editable: true, // Allow editing
      }));

      setColumns(gridColumns);
      setRows(formattedData);
      console.log("Formatted Excel Data:", formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  //   console.log("row",rows);
  const handleSubmit = () => {
    const validRows = rows.filter((row) =>
      Object.keys(row).some((key) => key !== "id" && row[key].trim() !== "")
    );

    if (validRows.length !== rows.length) {
      alert(
        "Some rows are empty. Please fill or remove them before submitting."
      );
      return;
    }

    console.log("✅ Submitting Data:", validRows);
  };

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
        <ol
          className="breadcrumb my-3"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          <li>
            <Link to="/" className="custom-breadcrumb text-sm">
              Home
            </Link>
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            <Link to="/question" className="custom-breadcrumb">
              &nbsp;Question
            </Link>
          </li>
          <span className="breadcrumb-separator"> &gt; </span>
          <li className="breadcrumb-item active text-sm" aria-current="page">
            &nbsp;Question & Answer Add
          </li>
        </ol>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted text-sm">
                Add Question & Answer
              </span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/question">
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
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Centre Name<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={centerList}
                  value={selectedCenter}
                  onChange={(selected) => {
                    setSelectedCenter(selected);
                    formik.setFieldValue(
                      "center_id",
                      selected.map((option) => option.value)
                    );
                    if (selected.length === 0) {
                      setGrades([]);
                      setSubjects([]);
                      formik.setFieldValue("grade_id", "");
                      formik.setFieldValue("subject_id", "");
                    }
                  }}
                  labelledBy="Select Center"
                  className={`form-multi-select form-multi-select-sm ${formik.touched.center_id && formik.errors.center_id
                    ? "is-invalid"
                    : ""
                    }`}
                />
                {formik.touched.center_id && formik.errors.center_id && (
                  <div className="invalid-feedback">
                    {formik.errors.center_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Grade<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.grade_id && formik.errors.grade_id
                    ? "is-invalid"
                    : ""
                    }`}
                  value={formik.values.grade_id}
                  onChange={(e) =>
                    formik.setFieldValue("grade_id", e.target.value)
                  }
                >
                  <option value="">Select grade</option>
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
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Subject<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.subject_id && formik.errors.subject_id
                    ? "is-invalid"
                    : ""
                    }`}
                  value={formik.values.subject_id}
                  onChange={(e) =>
                    formik.setFieldValue("subject_id", e.target.value)
                  }
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
                {formik.touched.subject_id && formik.errors.subject_id && (
                  <div className="invalid-feedback">
                    {formik.errors.subject_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Topic<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.topic_id && formik.errors.topic_id
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("topic_id")}
                >
                  <option value="">Select Topic</option>
                  {topics.map((topic) => (
                    <option key={topic.value} value={topic.value}>
                      {topic.label}
                    </option>
                  ))}
                </select>
                {formik.touched.topic_id && formik.errors.topic_id && (
                  <div className="invalid-feedback">
                    {formik.errors.topic_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Question Upload Type<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.uploadType && formik.errors.uploadType
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("uploadType")}
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="manual">Manual</option>
                  <option value="upload">Upload</option>
                </select>
                {formik.touched.uploadType && formik.errors.uploadType && (
                  <div className="invalid-feedback">
                    {formik.errors.uploadType}
                  </div>
                )}
              </div>
              {formik.values.uploadType === "manual" ? (
                <>
                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">
                      Difficult Level<span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="radio"
                          name="difficult_level"
                          value="Easy"
                          className="form-check-input"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.difficult_level === "Easy"}
                        />
                        <label className="form-check-label">Easy</label>
                      </div>

                      <div className="form-check">
                        <input
                          type="radio"
                          name="difficult_level"
                          value="Medium"
                          className="form-check-input"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.difficult_level === "Medium"}
                        />
                        <label className="form-check-label">Medium</label>
                      </div>

                      <div className="form-check">
                        <input
                          type="radio"
                          name="difficult_level"
                          value="Hard"
                          className="form-check-input"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.difficult_level === "Hard"}
                        />
                        <label className="form-check-label">Hard</label>
                      </div>
                    </div>

                    {formik.touched.difficult_level &&
                      formik.errors.difficult_level && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.difficult_level}
                        </div>
                      )}
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">Question</label>
                    <span className="text-danger">*</span>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${formik.touched.question && formik.errors.question
                        ? "is-invalid"
                        : ""
                        }`}
                      {...formik.getFieldProps("question")}
                    ></input>
                    {formik.touched.question && formik.errors.question && (
                      <div className="invalid-feedback">
                        {formik.errors.question}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label">Upload File</label>
                    <input
                      type="file"
                      accept="image/*"
                      className={`form-control form-control-sm ${formik.touched.upload && formik.errors.upload
                        ? "is-invalid"
                        : ""
                        }`}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "upload",
                          event.currentTarget.files[0]
                        );
                      }}
                    ></input>
                    {formik.touched.upload && formik.errors.upload && (
                      <div className="invalid-feedback">
                        {formik.errors.upload}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    <div>
                      <label className="form-label">
                        Question Type<span className="text-danger">*</span>
                      </label>
                    </div>
                    {[
                      { id: "fillable", label: "Fillable" },
                      { id: "closed", label: "Closed" },
                      { id: "multichoice", label: "Multi choice" },
                      { id: "short_answer", label: "Short Answer" },
                      { id: "upload", label: "Answer Upload" },
                    ].map(({ id, label }) => (
                      <div className="form-check form-check-inline" key={id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={id}
                          value={id}
                          onChange={handleCheckboxChange}
                          checked={formik.values.ques_type.includes(id)}
                        />
                        <label className="form-check-label" htmlFor={id}>
                          {label}
                        </label>
                      </div>
                    ))}

                    {formik.errors.ques_type && formik.touched.ques_type && (
                      <div className="text-danger">
                        {formik.errors.ques_type}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mb-3">
                    {/* Conditional Fields Based on Selected Checkboxes */}
                    {formik.values.ques_type.includes("fillable") && (
                      <div className="mt-2">
                        <label className="form-label">Enter your answer:</label>
                        <input
                          type="text"
                          placeholder="Your Question & Answer"
                          className={`form-control form-control-sm ${formik.touched.answer?.[0]?.fillable &&
                            formik.errors.answer?.[0]?.fillable
                            ? "is-invalid"
                            : ""
                            }`}
                          name="answer"
                          value={formik.values.answer[0]?.fillable || ""}
                          onChange={(e) => {
                            const updatedAnswer = [
                              {
                                ...formik.values.answer[0],
                                fillable: e.target.value,
                              },
                            ];
                            formik.setFieldValue("answer", updatedAnswer);
                          }}
                        />
                        {formik.touched.answer?.[0]?.fillable &&
                          formik.errors.answer?.[0]?.fillable && (
                            <div className="text-danger">
                              {formik.errors.answer[0]?.fillable}
                            </div>
                          )}
                      </div>
                    )}
                    {formik.values.ques_type.includes("closed") && (
                      <div className="mt-2">
                        <label className="form-label">Select Yes or No:</label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="closed"
                              value="yes"
                              onChange={(e) => {
                                // Create or update the first object in the answer array with closed value
                                const currentAnswer =
                                  formik.values.answer?.[0] || {};
                                formik.setFieldValue("answer", [
                                  { ...currentAnswer, closed: e.target.value },
                                ]);
                              }}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values.answer?.[0]?.closed === "yes"
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="closedYes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="closed"
                              value="no"
                              onChange={(e) => {
                                const currentAnswer =
                                  formik.values.answer?.[0] || {};
                                formik.setFieldValue("answer", [
                                  { ...currentAnswer, closed: e.target.value },
                                ]);
                              }}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values.answer?.[0]?.closed === "no"
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="closedNo"
                            >
                              No
                            </label>
                          </div>
                        </div>
                        {formik.touched.answer?.[0]?.closed &&
                          formik.errors.answer?.[0]?.closed && (
                            <div className="invalid-feedback d-block">
                              {formik.errors.answer[0]?.closed}
                            </div>
                          )}
                      </div>
                    )}
                    {formik.values.ques_type.includes("multichoice") && (
                      <div className="mt-2">
                        <label className="form-label">
                          Select Multi Choice:
                        </label>
                        {formik.values.options.map((multiChoice, index) => (
                          <div
                            key={multiChoice.id}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <input
                              type="checkbox"
                              className="form-check-input mb-2"
                              name={`options[${index}].selected`}
                              id={`multiChoice-${index}`}
                              checked={multiChoice.selected || false}
                              onChange={() => {
                                let updatedOptions = [...formik.values.options];
                                let updatedAnswers = [...formik.values.answer];

                                if (multiChoice.selected) {
                                  updatedAnswers = updatedAnswers.filter(
                                    (ans) =>
                                      ans.multichoice !== multiChoice.value
                                  );
                                } else {
                                  updatedAnswers.push({
                                    multichoice: multiChoice.value,
                                  });
                                }
                                updatedOptions[index] = {
                                  ...multiChoice,
                                  selected: !multiChoice.selected,
                                };
                                console.log(
                                  "multichoice",
                                  (updatedOptions[index] = {
                                    ...multiChoice,
                                    selected: !multiChoice.selected,
                                  })
                                );
                                console.log("answer", updatedAnswers);
                                formik.setFieldValue("options", updatedOptions);
                                formik.setFieldValue("answer", updatedAnswers);
                              }}
                              aria-label="Multi Choice"
                            />
                            &nbsp; &nbsp;
                            <div className="input-group mb-2">
                              <input
                                type="text"
                                className={`form-control form-control-sm ${formik.errors.options &&
                                  formik.touched.options &&
                                  formik.errors.options[index]?.value
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                name={`options[${index}].value`}
                                value={multiChoice.value}
                                onChange={(e) => {
                                  let updatedOptions = [
                                    ...formik.values.options,
                                  ];
                                  updatedOptions[index].value =
                                    e.target.value.replace(/,/g, "");

                                  // Update answer array if selected
                                  let updatedAnswers = [
                                    ...formik.values.answer,
                                  ];
                                  if (multiChoice.selected) {
                                    updatedAnswers = updatedAnswers.map((ans) =>
                                      ans.multichoice === multiChoice.value
                                        ? {
                                          ...ans,
                                          multichoice: e.target.value.replace(
                                            /,/g,
                                            ""
                                          ),
                                        }
                                        : ans
                                    );
                                  }

                                  formik.setFieldValue(
                                    "options",
                                    updatedOptions
                                  );
                                  formik.setFieldValue(
                                    "answer",
                                    updatedAnswers
                                  );
                                }}
                                placeholder={`Multi Choice ${index + 1}`}
                              />
                              {index > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    let updatedOptions =
                                      formik.values.options.filter(
                                        (opt) => opt.id !== multiChoice.id
                                      );
                                    let updatedAnswers =
                                      formik.values.answer.filter(
                                        (ans) =>
                                          ans.multichoice !== multiChoice.value
                                      );

                                    formik.setFieldValue(
                                      "options",
                                      updatedOptions
                                    );
                                    formik.setFieldValue(
                                      "answer",
                                      updatedAnswers
                                    );
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                            {formik.errors.options &&
                              formik.touched.options &&
                              formik.errors.options[index]?.values && (
                                <div className="text-danger mt-1">
                                  {formik.errors.options[index]?.values}
                                </div>
                              )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mt-2"
                          onClick={() => {
                            formik.setFieldValue("options", [
                              ...formik.values.options,
                              { id: Date.now(), value: "", selected: false },
                            ]);
                          }}
                        >
                          Add Multi Choice
                        </button>
                      </div>
                    )}
                    {formik.values.ques_type.includes("short_answer") && (
                      <div className="mt-2 mb-3">
                        <label className="form-label">Short Answer</label>
                        <textarea
                          rows={3}
                          className={`form-control form-control-sm ${formik.touched.answer?.[0]?.short_answer &&
                            formik.errors.answer?.[0]?.short_answer
                            ? "is-invalid"
                            : ""
                            }`}
                          name="answer"
                          value={formik.values.answer[0]?.short_answer || ""}
                          onChange={(e) => {
                            const updatedAnswer = [
                              {
                                ...formik.values.answer[0],
                                short_answer: e.target.value,
                              },
                            ];
                            formik.setFieldValue("answer", updatedAnswer);
                          }}
                        />
                        {formik.touched.answer?.[0]?.short_answer &&
                          formik.errors.answer?.[0]?.short_answer && (
                            <div className="text-danger">
                              {formik.errors.answer[0]?.short_answer}
                            </div>
                          )}
                      </div>
                    )}
                    {formik.values.ques_type.includes("upload") && (
                      <div className="mt-2 mb-3">
                        <label className="form-label">Answer Upload</label>
                        <input
                          type="file"
                          className={`form-control form-control-sm ${formik.touched.answer_upload &&
                            formik.errors.answer_upload
                            ? "is-invalid"
                            : ""
                            }`}
                          name="answer_upload"
                          accept="image/*"
                          onChange={(event) => {
                            formik.setFieldValue(
                              "answer_upload",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        {formik.touched.answer_upload &&
                          formik.errors.answer_upload && (
                            <div className="text-danger">
                              {formik.errors.answer_upload}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mb-3 mt-2">
                    <label className="form-label">Hint</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      {...formik.getFieldProps("hint")}
                    ></input>
                  </div>
                </>
              ) : formik.values.uploadType === "upload" ? (
                showTable ? (
                  <div className="col-12 mb-3 mt-5">
                    <div className="table-container">
                      <DataGrid
                        rows={rows}
                        columns={columns}
                        processRowUpdate={(updatedRow, oldRow) => {
                          setRows((prevRows) =>
                            prevRows.map((row) =>
                              row.id === updatedRow.id ? updatedRow : row
                            )
                          );
                          return updatedRow;
                        }}
                        disableSelectionOnClick
                        checkboxSelection={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="col-12 mb-3">
                    <div
                      className="mt-5 mb-3 pb-5 pt-4 d-flex flex-column justify-content-center align-items-center"
                      style={{
                        border: "2px dashed #005aff",
                        borderRadius: "10px",
                      }}
                    >
                      <button
                        onClick={handleDownload}
                        type="button"
                        className="text-end ms-auto me-5 btn btn-outline-success btn-sm py-2 px-3"
                      >
                        <FaFileDownload size={20} />
                      </button>
                      <p style={{ color: "#4B5563", marginBottom: "10px" }}>
                        Upload .xlsx, .xls, or .csv file
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          padding: "10px 20px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Select file
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                      />
                      {formik.touched.bulkImg && formik.errors.bulkImg && (
                        <small className="text-danger mt-2">
                          {formik.errors.bulkImg}
                        </small>
                      )}
                    </div>
                  </div>
                )
              ) : (
                ""
              )}
              <>
                {/* <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Difficult Level<span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      name="difficult_level"
                      value="Easy"
                      className="form-check-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.difficult_level === "Easy"}
                    />
                    <label className="form-check-label">Easy</label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      name="difficult_level"
                      value="Medium"
                      className="form-check-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.difficult_level === "Medium"}
                    />
                    <label className="form-check-label">Medium</label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      name="difficult_level"
                      value="Hard"
                      className="form-check-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.difficult_level === "Hard"}
                    />
                    <label className="form-check-label">Hard</label>
                  </div>
                </div>

                {formik.touched.difficult_level &&
                  formik.errors.difficult_level && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.difficult_level}
                    </div>
                  )}
              </div> */}
                {/* <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Question</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control form-control-sm ${formik.touched.question && formik.errors.question
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("question")}
                ></input>
                {formik.touched.question && formik.errors.question && (
                  <div className="invalid-feedback">
                    {formik.errors.question}
                  </div>
                )}
              </div> */}
                {/* <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Upload File</label>
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control form-control-sm ${formik.touched.upload && formik.errors.upload
                    ? "is-invalid"
                    : ""
                    }`}
                  onChange={(event) => {
                    formik.setFieldValue("upload", event.currentTarget.files[0]);
                  }}
                ></input>
                {formik.touched.upload && formik.errors.upload && (
                  <div className="invalid-feedback">
                    {formik.errors.upload}
                  </div>
                )}
              </div> */}
                {/* <div className="col-md-6 col-12 mb-3">
                <div>
                  <label className="form-label">
                    Question Type<span className="text-danger">*</span>
                  </label>
                </div>
                {[
                  { id: "fillable", label: "Fillable" },
                  { id: "closed", label: "Closed" },
                  { id: "multichoice", label: "Multi choice" },
                  { id: "short_answer", label: "Short Answer" },
                  { id: "upload", label: "Answer Upload" },
                ].map(({ id, label }) => (
                  <div className="form-check form-check-inline" key={id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={id}
                      value={id}
                      onChange={handleCheckboxChange}
                      checked={formik.values.ques_type.includes(id)}
                    />
                    <label className="form-check-label" htmlFor={id}>
                      {label}
                    </label>
                  </div>
                ))}

                {formik.errors.ques_type && formik.touched.ques_type && (
                  <div className="text-danger">{formik.errors.ques_type}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                {formik.values.ques_type.includes("fillable") && (
                  <div className="mt-2">
                    <label className="form-label">Enter your answer:</label>
                    <input
                      type="text"
                      placeholder="Your Question & Answer"
                      className={`form-control form-control-sm ${formik.touched.answer?.[0]?.fillable && formik.errors.answer?.[0]?.fillable
                        ? "is-invalid"
                        : ""
                        }`}
                      name="answer"
                      value={formik.values.answer[0]?.fillable || ""}
                      onChange={(e) => {
                        const updatedAnswer = [{ ...formik.values.answer[0], fillable: e.target.value }];
                        formik.setFieldValue("answer", updatedAnswer);
                      }}
                    />
                    {formik.touched.answer?.[0]?.fillable && formik.errors.answer?.[0]?.fillable && (
                      <div className="text-danger">{formik.errors.answer[0]?.fillable}</div>
                    )}
                  </div>
                )}
                {formik.values.ques_type.includes("closed") && (
                  <div className="mt-2">
                    <label className="form-label">Select Yes or No:</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="closed"
                          value="yes"
                          onChange={(e) => {
                            // Create or update the first object in the answer array with closed value
                            const currentAnswer = formik.values.answer?.[0] || {};
                            formik.setFieldValue("answer", [
                              { ...currentAnswer, closed: e.target.value },
                            ]);
                          }}
                          onBlur={formik.handleBlur}
                          checked={formik.values.answer?.[0]?.closed === "yes"}
                        />
                        <label className="form-check-label" htmlFor="closedYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="closed"
                          value="no"
                          onChange={(e) => {
                            const currentAnswer = formik.values.answer?.[0] || {};
                            formik.setFieldValue("answer", [
                              { ...currentAnswer, closed: e.target.value },
                            ]);
                          }}
                          onBlur={formik.handleBlur}
                          checked={formik.values.answer?.[0]?.closed === "no"}
                        />
                        <label className="form-check-label" htmlFor="closedNo">
                          No
                        </label>
                      </div>
                    </div>
                    {formik.touched.answer?.[0]?.closed && formik.errors.answer?.[0]?.closed && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.answer[0]?.closed}
                      </div>
                    )}
                  </div>
                )}
                {formik.values.ques_type.includes("multichoice") && (
                  <div className="mt-2">
                    <label className="form-label">Select Multi Choice:</label>
                    {formik.values.options.map((multiChoice, index) => (
                      <div
                        key={multiChoice.id}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input mb-2"
                          name={`options[${index}].selected`}
                          id={`multiChoice-${index}`}
                          checked={multiChoice.selected || false}
                          onChange={() => {
                            let updatedOptions = [...formik.values.options];
                            let updatedAnswers = [...formik.values.answer];

                            if (multiChoice.selected) {
                              updatedAnswers = updatedAnswers.filter((ans) => ans.multichoice !== multiChoice.value);
                            } else {
                              updatedAnswers.push({ multichoice: multiChoice.value});
                            }
                            updatedOptions[index] = {
                              ...multiChoice,
                              selected: !multiChoice.selected,
                            };
                            console.log("multichoice", updatedOptions[index] = {
                              ...multiChoice,
                              selected: !multiChoice.selected,
                            });
                            console.log("answer",updatedAnswers)
                            formik.setFieldValue("options", updatedOptions);
                            formik.setFieldValue("answer", updatedAnswers);
                          }}
                          aria-label="Multi Choice"
                        />
                        &nbsp; &nbsp;
                        <div className="input-group mb-2">
                          <input
                            type="text"
                            className={`form-control form-control-sm ${formik.errors.options &&
                              formik.touched.options &&
                              formik.errors.options[index]?.value
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`options[${index}].value`}
                            value={multiChoice.value}
                            onChange={(e) => {
                              let updatedOptions = [...formik.values.options];
                              updatedOptions[index].value = e.target.value.replace(/,/g, "");

                              // Update answer array if selected
                              let updatedAnswers = [...formik.values.answer];
                              if (multiChoice.selected) {
                                updatedAnswers = updatedAnswers.map((ans) =>
                                  ans.multichoice === multiChoice.value
                                    ? { ...ans, multichoice: e.target.value.replace(/,/g, "") }
                                    : ans
                                );
                              }

                              formik.setFieldValue("options", updatedOptions);
                              formik.setFieldValue("answer", updatedAnswers);
                            }}
                            placeholder={`Multi Choice ${index + 1}`}
                          />
                          {index > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                let updatedOptions = formik.values.options.filter((opt) => opt.id !== multiChoice.id);
                                let updatedAnswers = formik.values.answer.filter((ans) => ans.multichoice !== multiChoice.value);

                                formik.setFieldValue("options", updatedOptions);
                                formik.setFieldValue("answer", updatedAnswers);
                              }}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                        {formik.errors.options &&
                          formik.touched.options &&
                          formik.errors.options[index]?.values && (
                            <div className="text-danger mt-1">
                              {formik.errors.options[index]?.values}
                            </div>
                          )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary btn-sm mt-2"
                      onClick={() => {
                        formik.setFieldValue("options", [
                          ...formik.values.options,
                          { id: Date.now(), value: "", selected: false },
                        ]);
                      }}
                    >
                      Add Multi Choice
                    </button>
                  </div>
                )}
                {formik.values.ques_type.includes("short_answer") && (
                  <div className="mt-2 mb-3">
                    <label className="form-label">Short Answer</label>
                    <textarea
                      rows={3}
                      className={`form-control form-control-sm ${formik.touched.answer?.[0]?.short_answer && formik.errors.answer?.[0]?.short_answer
                        ? "is-invalid"
                        : ""
                        }`}
                      name="answer"
                      value={formik.values.answer[0]?.short_answer || ""}
                      onChange={(e) => {
                        const updatedAnswer = [{ ...formik.values.answer[0], short_answer: e.target.value }];
                        formik.setFieldValue("answer", updatedAnswer);
                      }}
                    />
                    {formik.touched.answer?.[0]?.short_answer && formik.errors.answer?.[0]?.short_answer && (
                      <div className="text-danger">{formik.errors.answer[0]?.short_answer}</div>
                    )}
                  </div>
                )}
                {formik.values.ques_type.includes("upload") && (
                  <div className="mt-2 mb-3">
                    <label className="form-label">Answer Upload</label>
                    <input
                      type="file"
                      className={`form-control form-control-sm ${formik.touched.answer_upload &&
                        formik.errors.answer_upload
                        ? "is-invalid"
                        : ""
                        }`}
                      name="answer_upload"
                      accept="image/*"
                      onChange={(event) => {
                        formik.setFieldValue("answer_upload", event.currentTarget.files[0]);
                      }}
                    />
                    {formik.touched.answer_upload &&
                      formik.errors.answer_upload && (
                        <div className="text-danger">
                          {formik.errors.answer_upload}
                        </div>
                      )}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3 mt-2">
                <label className="form-label">Hint</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  {...formik.getFieldProps("hint")}
                ></input>
              </div> */}
              </>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default QuestionAdd;
