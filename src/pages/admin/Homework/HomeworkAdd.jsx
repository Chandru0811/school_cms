import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider } from "react-bootstrap";
import { createTheme } from "@mui/material";

function HomeworkAdd() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);

  const serviceOption = [
    { value: "1", label: "Multi Choice" },
    { value: "2", label: "Filled" },
    { value: "3", label: "Closed" },
    { value: "4", label: "Short Answer" },
    { value: "5", label: "Upload" },
  ];

  const subjectOption = [
    { value: "1", label: "English" },
    { value: "2", label: "Tamil" },
    { value: "3", label: "Maths" },
  ];

  const topicOption = [
    { value: "1", label: "English" },
    { value: "2", label: "Tamil" },
    { value: "3", label: "Maths" },
  ];

  const data = [
    {
      id: 1,
      question: "SRDK",
    },
    {
      id: 4,
      question: "SRDK",
    },
    {
      id: 3,
      question: "SRDK",
    },
    {
      id: 2,
      question: "SRDK",
    },
  ];

  const validationSchema = yup.object().shape({
    student_id: yup.string().required("*Student id is required"),
    difficult_type: yup.string().required("*Select a deifficult type"),
    grade_id: yup.string().required("*Select a grade id"),
    due_date: yup.string().required("*Due date is required"),
    ques_type: yup.string().required("*Select a question type"),
    subject_id: yup
      .array()
      .of(yup.string().required("*Select at least one subject"))
      .min(1, "*Select at least one subject")
      .required("*Select a subject name"),
    topic_id: yup
      .array()
      .of(yup.string().required("*Select at least one subject"))
      .min(1, "*Select at least one subject")
      .required("*Select a subject name"),
    target_score: yup
      .number()
      .typeError("*Target Score must be a number")
      .required("*Target Score field is required")
      .positive("*Target Score must be a positive number")
      .integer("*Target Score must be an integer"),
  });

  const formik = useFormik({
    initialValues: {
      student_id: "",
      difficult_type: "",
      grade_id: "",
      due_date: "",
      target_score: "",
      service_id: "",
      ques_type: "",
      subject_id: "",
      topic_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // setLoadIndicator(true);
      console.log("Form values:", values);
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        enableHiding: false,
        size: 40,
        cell: ({ cell }) => (
          <span style={{ textAlign: "center" }}>{cell.getValue()}</span>
        ),
      },
      { accessorKey: "question", header: "Question" },
      {
        accessorKey: "created_at",
        header: "Created At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "updated_by",
        header: "Updated By",
        Cell: ({ cell }) => cell.getValue() || "",
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
      },
    ],
    []
  );

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "#535454 !important",
            backgroundColor: "#e6edf7 !important",
            fontWeight: "400 !important",
            fontSize: "13px !important",
            textAlign: "center !important",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            "&.Mui-disabled .MuiSwitch-track": {
              backgroundColor: "#f5e1d0",
              opacity: 1,
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "#eb862a",
            },
          },
          track: {
            backgroundColor: "#e0e0e0",
          },
          thumb: {
            color: "#eb862a",
          },
          switchBase: {
            "&.Mui-checked": {
              color: "#eb862a",
            },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#eb862a",
            },
          },
        },
      },
    },
  });

  return (
    <div className="container p-3">
      <ol
        className="breadcrumb my-3 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          <Link to="/homework" className="custom-breadcrumb text-sm">
            &nbsp;Homework
          </Link>
        </li>
        <span className="breadcrumb-separator text-sm"> &gt; </span>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Homework Add
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
              <span className="me-2 text-muted text-sm">Add Homework</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/homework">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button type="submit" className="btn btn-sm btn-button">
                Save
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Student<span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control form-control-sm ${
                    formik.touched.student_id && formik.errors.student_id
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("student_id")}
                />
                {formik.touched.student_id && formik.errors.student_id && (
                  <div className="invalid-feedback">
                    {formik.errors.student_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Grade<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.grade_id && formik.errors.grade_id
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("grade_id")}
                >
                  <option value="">Select Grade</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                {formik.touched.grade_id && formik.errors.grade_id && (
                  <div className="invalid-feedback">
                    {formik.errors.grade_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Topic<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={topicOption}
                  value={selectedTopic}
                  onChange={(selected) => {
                    setSelectedTopic(selected);
                    formik.setFieldValue(
                      "topic_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Topic"
                  className={`form-multi-select form-multi-select-sm ${
                    formik.touched.topic_id && formik.errors.topic_id
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.topic_id && formik.errors.topic_id && (
                  <div className="invalid-feedback">
                    {formik.errors.topic_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Subject<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={subjectOption}
                  value={selectedSubject}
                  onChange={(selected) => {
                    setSelectedSubject(selected);
                    formik.setFieldValue(
                      "subject_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Service"
                  className={`form-multi-select form-multi-select-sm ${
                    formik.touched.subject_id && formik.errors.subject_id
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.subject_id && formik.errors.subject_id && (
                  <div className="invalid-feedback">
                    {formik.errors.subject_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Difficult Type<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.difficult_type &&
                    formik.errors.difficult_type
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("difficult_type")}
                >
                  <option value="">Select Subject</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {formik.touched.difficult_type &&
                  formik.errors.difficult_type && (
                    <div className="invalid-feedback">
                      {formik.errors.difficult_type}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Due Date<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control form-control-sm ${
                    formik.touched.due_date && formik.errors.due_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("due_date")}
                />

                {formik.touched.due_date && formik.errors.due_date && (
                  <div className="invalid-feedback">
                    {formik.errors.due_date}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Total Score</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.target_score && formik.errors.target_score
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("target_score")}
                />
                {formik.touched.target_score && formik.errors.target_score && (
                  <div className="invalid-feedback">
                    {formik.errors.target_score}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">Question</label>
                <MultiSelect
                  options={serviceOption}
                  value={selectedServices}
                  onChange={(selected) => {
                    setSelectedServices(selected);
                    formik.setFieldValue(
                      "service_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Service"
                  className={`form-multi-select ${
                    formik.touched.service_id && formik.errors.service_id
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{
                    height: "37.6px !important",
                    minHeight: "37.6px",
                  }}
                />
                {formik.touched.service_id && formik.errors.service_id && (
                  <div className="invalid-feedback">
                    {formik.errors.service_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Question Type<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.ques_type && formik.errors.ques_type
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("ques_type")}
                >
                  <option value="">Select Question Type</option>
                  <option value="All">All</option>
                  <option value="Filled">Filled</option>
                  <option value="Closed">Closed</option>
                  <option value="multiChoice">Multi Choice</option>
                  <option value="shortAnswer">Short Answer</option>
                  <option value="Upload">Upload</option>
                </select>
                {formik.touched.ques_type && formik.errors.ques_type && (
                  <div className="invalid-feedback">
                    {formik.errors.ques_type}
                  </div>
                )}
              </div>
            </div>
          </div>
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={data}
              enableColumnActions={false}
              enableColumnFilters={false}
              enableDensityToggle={false}
              enableFullScreenToggle={false}
              initialState={{
                columnVisibility: {
                  working_hrs: false,
                  citizenship: false,
                  nationality: false,
                  created_by: false,
                  created_at: false,
                  updated_by: false,
                  updated_at: false,
                },
              }}
              enableRowSelection={true}
            />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
}

export default HomeworkAdd;
