import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { MaterialReactTable } from "material-react-table";

function WorkSheetEdit() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState([]);

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

  const questionOption = [
    { value: "1", label: "Filled" },
    { value: "2", label: "Closed" },
    { value: "3", label: "Multi Choice" },
    { value: "4", label: "Short Answer" },
    { value: "5", label: "Upload" },
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
    centre_id: yup
      .array()
      .of(yup.string().required("*Select at least one centre"))
      .min(1, "*Select at least one centre")
      .required("*Select a centre name"),
    grade_id: yup.string().required("*Select a grade"),
    name: yup.string().required("*Title is required"),
    subject_id: yup
      .array()
      .of(yup.string().required("*Select at least one subject"))
      .min(1, "*Select at least one subject")
      .required("*Select a subject name"),
    type: yup.string().required("*Select a type"),
    ques_type: yup
      .array()
      .of(yup.string().required("*Select at least one question type"))
      .min(1, "*Select at least one question type")
      .required("*Select a question type name"),
    questionType: yup.string().required("*Select a question type"),
    question: yup.string().required("*Select a question"),
    target_score: yup
      .number()
      .typeError("*Target Score must be a number")
      .required("*Target Score field is required")
      .positive("*Target Score must be a positive number")
      .integer("*Target Score must be an integer"),
    reward: yup
      .number()
      .typeError("*Reward must be a number")
      .required("*Reward field is required")
      .positive("*Reward must be a positive number")
      .integer("*Reward must be an integer"),
  });

  const formik = useFormik({
    initialValues: {
      centre_id: "",
      grade_id: "",
      name: "Sumaiya",
      subject_id: " Grammer",
      type: "science",
      ques_type: "Closed",
      target_score: "10",
      reward: "5",
      question: "",
      questionType: "Challenge",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
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
          <Link to="/worksheet" className="custom-breadcrumb text-sm">
            &nbsp;Worksheet
          </Link>
        </li>
        <span className="breadcrumb-separator text-sm"> &gt; </span>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Worksheet Edit
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
              <span className="me-2 text-muted text-sm">Edit Worksheet</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/worksheet">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button type="submit" className="btn btn-button">
                Save
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Centre Name<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={serviceOption}
                  value={selectedServices}
                  onChange={(selected) => {
                    setSelectedServices(selected);
                    formik.setFieldValue(
                      "centre_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Service"
                  className={`form-multi-select form-multi-select-sm ${
                    formik.touched.centre_id && formik.errors.centre_id
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.centre_id && formik.errors.centre_id && (
                  <div className="invalid-feedback">
                    {formik.errors.centre_id}
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
                  <option value=""></option>
                  <option value="1">9 Grade</option>
                  <option value="2">10 Grade</option>
                  <option value="3">11 Grade</option>
                </select>
                {formik.touched.grade_id && formik.errors.grade_id && (
                  <div className="invalid-feedback">
                    {formik.errors.grade_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      name="questionType"
                      value="Challenge"
                      className={`form-check-input ${
                        formik.touched.questionType &&
                        formik.errors.questionType
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.questionType === "Challenge"} // Default checked
                    />
                    <label className="form-check-label">Challenge</label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      name="questionType"
                      value="Q/A"
                      className="form-check-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.questionType === "Q/A"}
                    />
                    <label className="form-check-label">Q/A</label>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                {formik.values.questionType === "Challenge" ? (
                  <label className="form-label">
                    Challenged Title<span className="text-danger">*</span>
                  </label>
                ) : formik.values.questionType === "Q/A" ? (
                  <label className="form-label">
                    Q/A Title<span className="text-danger">*</span>
                  </label>
                ) : null}

                <input
                  className={`form-control form-control-sm ${
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
                {formik.values.questionType === "Challenge" ? (
                  <label className="form-label">
                    Challenged Type<span className="text-danger">*</span>
                  </label>
                ) : formik.values.questionType === "Q/A" ? (
                  <label className="form-label">
                    Q/A Type<span className="text-danger">*</span>
                  </label>
                ) : null}
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.type && formik.errors.type
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("type")}
                >
                  <option value="">Select Type</option>
                  <option value="Practical">Practical</option>
                  <option value="Grammer">Grammer</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <div className="invalid-feedback">{formik.errors.type}</div>
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
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Question Type<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={questionOption}
                  value={selectedQuestion}
                  onChange={(selected) => {
                    setSelectedQuestion(selected);
                    formik.setFieldValue(
                      "ques_type",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Service"
                  className={`form-multi-select form-multi-select-sm ${
                    formik.touched.ques_type && formik.errors.ques_type
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.ques_type && formik.errors.ques_type && (
                  <div className="invalid-feedback">
                    {formik.errors.ques_type}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Service Id<span className="text-danger">*</span>
                </label>
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
                <label className="form-label">Traget Score</label>
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
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Reward</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.reward && formik.errors.reward
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("reward")}
                />
                {formik.touched.reward && formik.errors.reward && (
                  <div className="invalid-feedback">{formik.errors.reward}</div>
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

export default WorkSheetEdit;
