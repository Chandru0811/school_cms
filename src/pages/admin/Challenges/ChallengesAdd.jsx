import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { FaTrash } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { useState } from "react";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider } from "react-bootstrap";
import { createTheme } from "@mui/material";

function ChallengesAdd() {
  const [selectedServices, setSelectedServices] = useState([]);

  const serviceOption = [
    { value: "1", label: "SRDK" },
    { value: "2", label: "KVM" },
    { value: "3", label: "KCS" },
    { value: "4", label: "PAK" },
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

  const validationSchema = Yup.object({
    centre_id: Yup.array()
      .of(Yup.string().required("*Select at least one centre"))
      .min(1, "*Select at least one centre")
      .required("*Select a centre name"),
    grade_id: Yup.string().required("*Select a grade"),
    subject_topic: Yup.string().required("*Subject topic is required"),
    type: Yup.string().required("*Select a type"),
    answer_type: Yup.string().required("*Select a answer type"),
    title: Yup.string().required("*Challenged title is required"),
    level: Yup.string().required("*Select a level"),
    time_limit: Yup.string().required("*Time limit is required"),
    description: Yup.string()
      .notRequired("*Description is a required field")
      .max(250, "*The maximum length is 250 characters"),
    ques_type: Yup.array()
      .min(1, "*Select at least one question type")
      .required("*Select a question type"),
    multiChoices: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().required("*Multi choice value is required"),
      })
    ),
    filledAnswer: Yup.string().required("*Field is required"),
    closedOption: Yup.string().required("*Select a one option"),
    shortAnswer: Yup.string().required("*Field is required"),
    checkUploadFile: Yup.string().required("*Please upload a file"),
  });

  const formik = useFormik({
    initialValues: {
      centre_id: "",
      grade_id: "",
      subject_topic: "",
      type: "",
      title: "",
      level: "",
      time_limit: "",
      hint: "",
      description: "",
      answer_type: "",
      ques_type: [],
      multiChoices: [
        { id: Date.now(), value: "" },
        { id: Date.now() + 1, value: "" },
      ],
      filledAnswer: "",
      closedOption: "",
      shortAnswer: "",
      checkUploadFile: null,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {},
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      formik.setFieldValue("ques_type", [...formik.values.ques_type, value]);
      if (value === "multiCheckbox" && formik.values.multiChoices.length < 2) {
        formik.setFieldValue("multiChoices", [
          { id: Date.now(), value: "" },
          { id: Date.now() + 1, value: "" },
        ]);
      }
    } else {
      formik.setFieldValue(
        "ques_type",
        formik.values.ques_type.filter((option) => option !== value)
      );
      if (value === "multiCheckbox") {
        formik.setFieldValue("multiChoices", []);
      }
    }
  };

  const addMultiChoice = () => {
    formik.setFieldValue("multiChoices", [
      ...formik.values.multiChoices,
      { id: Date.now(), value: "" },
    ]);
  };

  const removeMultiChoice = (id) => {
    const updatedMultiChoices = formik.values.multiChoices.filter(
      (multiChoice) => multiChoice.id !== id
    );
    formik.setFieldValue("multiChoices", updatedMultiChoices);
  };

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
          <Link to="/challenges" className="custom-breadcrumb text-sm">
            &nbsp;Challenges
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Challenges Add
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
              <span className="me-2 text-muted text-sm">Add Challenges</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/challenges">
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
                <label className="form-label">
                  Subject Topic<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.subject_topic && formik.errors.subject_topic
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("subject_topic")}
                />
                {formik.touched.subject_topic &&
                  formik.errors.subject_topic && (
                    <div className="invalid-feedback">
                      {formik.errors.subject_topic}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Level<span className="text-danger">*</span>
                </label>
                <select
                  aria-label="Default select example"
                  className={`form-select form-select-sm ${
                    formik.touched.level && formik.errors.level
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("level")}
                >
                  <option value=""></option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {formik.touched.level && formik.errors.level && (
                  <div className="invalid-feedback">{formik.errors.level}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Type<span className="text-danger">*</span>
                </label>
                <select
                  aria-label="Default select example"
                  className={`form-select form-select-sm ${
                    formik.touched.type && formik.errors.type
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("type")}
                >
                  <option value=""></option>
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Maths">Maths</option>
                </select>
                {formik.touched.type && formik.errors.type && (
                  <div className="invalid-feedback">{formik.errors.type}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Challenges Title<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.title && formik.errors.title
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="invalid-feedback">{formik.errors.title}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Challanges Description</label>
                <textarea
                  rows={5}
                  className={`form-control ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("description")}
                  maxLength={825}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">
                    {formik.errors.description}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Time Limit<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.time_limit && formik.errors.time_limit
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("time_limit")}
                />

                {formik.touched.time_limit && formik.errors.time_limit && (
                  <div className="invalid-feedback">
                    {formik.errors.time_limit}
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
                  { id: "filled", label: "Filled" },
                  { id: "closed", label: "Closed" },
                  { id: "multiCheckbox", label: "Multi choice" },
                  { id: "shortCheckbox", label: "Short Answer" },
                  { id: "uploadCheckbox", label: "Upload" },
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
                {/* Conditional Fields Based on Selected Checkboxes */}
                {formik.values.ques_type.includes("filled") && (
                  <div className="mt-2">
                    <label className="form-label">Enter your answer:</label>
                    <input
                      type="text"
                      placeholder="Your Question & Answer"
                      className={`form-control form-control-sm ${
                        formik.touched.filledAnswer &&
                        formik.errors.filledAnswer
                          ? "is-invalid"
                          : ""
                      }`}
                      name="filledAnswer"
                      value={formik.values.filledAnswer}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.filledAnswer &&
                      formik.errors.filledAnswer && (
                        <div className="text-danger">
                          {formik.errors.filledAnswer}
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
                          name="closedOption"
                          value="yes"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.closedOption === "yes"}
                        />
                        <label className="form-check-label">Yes</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="closedOption"
                          value="no"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.closedOption === "no"}
                        />
                        <label className="form-check-label">No</label>
                      </div>
                    </div>
                    {formik.touched.closedOption &&
                      formik.errors.closedOption && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.closedOption}
                        </div>
                      )}
                  </div>
                )}
                {formik.values.ques_type.includes("multiCheckbox") && (
                  <div className="mt-2">
                    <label className="form-label">Select Multi Choice:</label>
                    {formik.values.multiChoices.map((multiChoice, index) => (
                      <div
                        key={multiChoice.id}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input mb-2"
                          name="multiChoiseAnswer"
                          id="multiChoiseAnswer"
                          aria-label="Multi Choise"
                        />{" "}
                        &nbsp; &nbsp;
                        <div className="input-group mb-2">
                          <input
                            type="text"
                            className={`form-control form-control-sm ${
                              formik.errors.multiChoices &&
                              formik.touched.multiChoices &&
                              formik.errors.multiChoices[index]?.value
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`multiChoices[${index}].value`}
                            value={multiChoice.value}
                            onChange={(e) => {
                              const updatedMultiChoices = [
                                ...formik.values.multiChoices,
                              ];
                              updatedMultiChoices[index].value =
                                e.target.value.replace(/,/g, "");
                              formik.setFieldValue(
                                "multiChoices",
                                updatedMultiChoices
                              );
                            }}
                            placeholder={`Multi Choice ${index + 1}`}
                          />
                          {index > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeMultiChoice(multiChoice.id)}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                        {/* Validation message below the input group */}
                        {formik.errors.multiChoices &&
                          formik.touched.multiChoices &&
                          formik.errors.multiChoices[index]?.value && (
                            <div className="text-danger mt-1">
                              {formik.errors.multiChoices[index]?.value}
                            </div>
                          )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary btn-sm mt-2"
                      onClick={addMultiChoice}
                    >
                      Add Multi Choice
                    </button>
                  </div>
                )}
                {formik.values.ques_type.includes("shortCheckbox") && (
                  <div className="mt-2">
                    <label className="form-label">Short Answer</label>
                    <textarea
                      rows={3}
                      className={`form-control ${
                        formik.touched.shortAnswer && formik.errors.shortAnswer
                          ? "is-invalid"
                          : ""
                      }`}
                      name="shortAnswer"
                      value={formik.values.shortAnswer}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.shortAnswer &&
                      formik.errors.shortAnswer && (
                        <div className="text-danger">
                          {formik.errors.shortAnswer}
                        </div>
                      )}
                  </div>
                )}
                {formik.values.ques_type.includes("uploadCheckbox") && (
                  <div className="mt-2">
                    <label className="form-label">Upload File:</label>
                    <input
                      type="file"
                      className={`form-control form-control-sm ${
                        formik.touched.checkUploadFile &&
                        formik.errors.checkUploadFile
                          ? "is-invalid"
                          : ""
                      }`}
                      name="checkUploadFile"
                      value={formik.values.checkUploadFile}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.checkUploadFile &&
                      formik.errors.checkUploadFile && (
                        <div className="text-danger">
                          {formik.errors.checkUploadFile}
                        </div>
                      )}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Hint</label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.hint && formik.errors.hint
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("hint")}
                />
                {formik.touched.hint && formik.errors.hint && (
                  <div className="invalid-feedback">{formik.errors.hint}</div>
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

export default ChallengesAdd;
