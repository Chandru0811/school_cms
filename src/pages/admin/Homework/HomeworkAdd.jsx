import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ThemeProvider } from "react-bootstrap";
import { createTheme } from "@mui/material";
import toast from "react-hot-toast";
import api from "../../../config/URL";

function HomeworkAdd() {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filterDatas, setFilterDatas] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loadIndicator, setLoadIndicator] = useState(false);
  const questionOption = [
    { value: "fillable", label: "Filled" },
    { value: "closed", label: "Closed" },
    { value: "multichoice", label: "Multi Choice" },
    { value: "short_answer", label: "Short Answer" },
    { value: "upload", label: "Upload" },
  ];
  const today = new Date().toISOString().split("T")[0];
  const validationSchema = yup.object().shape({
    title: yup.string().required("*Title is required"),
    center_id: yup
      .array()
      .of(yup.string().required("*Select at least one centre"))
      .min(1, "*Select at least one centre")
      .required("*Select a centre name"),
    grade_id: yup
      .array()
      .of(yup.string().required("*Select at least one subject"))
      .min(1, "*Select at least one subject")
      .required("*Select a subject name"),
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
    ques_type: yup
      .array()
      .of(yup.string().required("*Select at least one question type"))
      .min(1, "*Select at least one question type")
      .required("*Select a question type name"),
      due_date: yup
      .string()
      .required("*Due Date is required")
      .test("future-date", "*Past dates are not allowed", value => {
        return value >= today;
      }),
      total_score: yup
      .number()
      .typeError("*Totle Score must be a number")
      .required("*Totle Score field is required")
      .positive("*Totle Score must be a positive number")
      .integer("*Totle Score must be an integer"),
    difficult_level: yup.string().required("*Select a difficult level"),
    ques_id_with_type: yup
      .array()
      .min(1, "*Please select a question")
      .of(
        yup.object().shape({
          id: yup.number().required(),
          questype: yup
            .string()
            // .oneOf(questionOption, "*Invalid question type")
            .required("*Please select a question type"),
        })
      ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      center_id: [],
      grade_id: [],
      subject_id: [],
      topic_id: [],
      ques_type: [],
      due_date: "",
      difficult_level: "",
      total_score: "",
      ques_id_with_type: [],
      question_id: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form Values:", values);
      try {
        const response = await api.post("homework", values);
        if (response.status === 200) {
          console.log("object", response);
          toast.success(response.data?.message);
          formik.resetForm();
          navigate("/homework");
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

  const handleRadioChange = (rowId, value) => {
    const updatedValues = [...formik.values.ques_id_with_type];
    const rowIndex = updatedValues.findIndex((q) => q.id === rowId);
    if (rowIndex >= 0) {
      updatedValues[rowIndex].questype = value;
    } else {
      updatedValues.push({ id: rowId, questype: value });
    }
    formik.setFieldValue("ques_id_with_type", updatedValues);
    setRowSelection((prev) => {
      const newSelection = { ...prev };

      if (!newSelection[rowId]) {
        newSelection[rowId] = true;
      }

      return newSelection;
    });
  };
  // console.log("error", formik.errors);
  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        enableHiding: false,
        size: 40,
        Cell: ({ cell }) => (
          <span style={{ textAlign: "center" }}>{cell.getValue()}</span>
        ),
      },
      { accessorKey: "question", header: "Question" },
      {
        accessorKey: "ques_type",
        header: "Question Type",
        Cell: ({ row }) => {
          let quesTypes = [];
          try {
            quesTypes = JSON.parse(row.original.ques_type) || [];
          } catch (error) {
            console.error("Error parsing ques_type:", error);
            quesTypes = [];
          }
          const selectedRow = formik.values.ques_id_with_type.find(
            (q) => q.id === row.original.id
          );
          return (
            <div>
              <div
                className="d-flex gap-3"
              >
                {quesTypes.map((t, i) => (
                  <div className="form-check" key={`${row.id}-${i}`}>
                    <label className="form-check-label">
                      <input
                        type="radio"
                        // name={`ques_id_with_type_${row.id}`}
                        value={t}
                        className="form-check-input position-relative" style={{ top: "-2px" }}
                        checked={selectedRow?.questype === t || ""}
                        onChange={(e) =>
                          handleRadioChange(row.original.id, e.target.value)
                        }
                      />
                      {cName(t)}
                    </label>
                  </div>
                ))}
              </div>
              {/* {formik.errors.ques_id_with_type &&
                formik.touched.ques_id_with_type && (
                  <small className="text-danger">
                    {formik.errors.ques_id_with_type}
                  </small>
                )} */}
            </div>
          );
        },
      },
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
    [formik.values]
  );
  const cName = (t) => {
    switch (t) {
      case "fillable":
        return "Fillable";
      case "multichoice":
        return "Multi Choice";
      case "short_answer":
        return "Short Answer";
      case "closed":
        return "Closed";
      case "upload":
        return "Upload";
      default:
        return t;
    }
  };
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

  const table = useMaterialReactTable({
    columns,
    data: filterDatas,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: {
      columnVisibility: {
        working_hrs: false,
        citizenship: false,
        nationality: false,
        created_by: false,
        created_at: false,
        updated_by: false,
        updated_at: false,
      },
    },
    enableRowSelection: true,
    getRowId: (row) => row.id,
    state: { rowSelection },
    onRowSelectionChange: (updatedSelection) => {
      setRowSelection(updatedSelection);
    },
  });

  const handleRowSelectionChange = (selectedData) => {
    const selectedRowIds = selectedData.map((row) => row.original.id);
    const updatedSelectedRows = selectedRowIds.map((id) => {
      const existingEntry = formik.values.ques_id_with_type.find(
        (q) => q.id === id
      );
      let quesTypes = [];
      const rowData = filterDatas.find((q) => q.id === id);
      try {
        quesTypes = rowData ? JSON.parse(rowData.ques_type) : [];
      } catch (error) {
        console.error("Error parsing ques_type:", error);
      }
      return (
        existingEntry || {
          id,
          questype: quesTypes.length > 0 ? quesTypes[0] : "",
        }
      );
    });
    formik.setFieldValue("question_id", selectedRowIds);
    formik.setFieldValue("ques_id_with_type", updatedSelectedRows);
  };
  useEffect(() => {
    handleRowSelectionChange(table.getSelectedRowModel().rows);
  }, [table.getSelectedRowModel().rows]);

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      const formattedCenters = response.data.data.map((center) => ({
        value: center.id,
        label: center.name,
      }));
      // console.log("center", formattedCenters);
      setCenterList(formattedCenters);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  const getSubjectList = async () => {
    try {
      const response = await api.get("subjects/list");
      // console.log(response);
      const formattedSubjects = response.data?.data?.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }));

      setSubjects(formattedSubjects);
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  const getGradeList = async () => {
    try {
      const response = await api.get("grades/list");
      // console.log(response);
      const formattedGrades = response.data?.data?.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));

      setGrades(formattedGrades);
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  const topicList = async () => {
    try {
      const response = await api.get("topics/list");
      // console.log(response);
      const formattedTopics = response.data?.data?.map((topics) => ({
        value: topics.id,
        label: topics.name,
      }));

      setTopics(formattedTopics);
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };
  const filterData = async () => {
    try {
      const response = await api.get("filter/homework", {
        params: {
          ...(formik.values.difficult_level && {
            difficult_level: formik.values.difficult_level,
          }),
          ...(formik.values.ques_type && {
            "ques_type[]": formik.values.ques_type,
          }),
          ...(formik.values.topic_id && {
            "topic_id[]": formik.values.topic_id,
          }),
          ...(formik.values.grade_id && {
            "grade_id[]": formik.values.grade_id,
          }),
          ...(formik.values.center_id && {
            "center_id[]": formik.values.center_id,
          }),
          ...(formik.values.subject_id && {
            "subject_id[]": formik.values.subject_id,
          }),
        },
      });
      if (response.status === 200) {
        setFilterDatas(response.data.data);
        // console.log(response);
      }
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  useEffect(() => {
    filterData();
  }, [
    selectedCenter,
    selectedSubjects,
    selectedGrades,
    selectedTopics,
    selectedQuestion,
    formik.values.difficult_level,
    formik.values.type,
  ]);
  useEffect(() => {
    getCenterList();
    getSubjectList();
    getGradeList();
    topicList();
  }, []);
  // console.log("formik.values", formik.values);
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
        <li className="breadcrumb-item active text-sm" aria-current="page">
          <Link to="/homework" className="custom-breadcrumb">
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
              <button
                type="submit"
                className="btn btn-button btn-sm"
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
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Title</label>
                <span className="text-danger">*</span>
                <input
                  className={`form-control form-control-sm ${formik.touched.title && formik.errors.title
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="invalid-feedback">{formik.errors.title}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Centre<span className="text-danger">*</span>
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
                  }}
                  labelledBy="Select Service"
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
                <MultiSelect
                  options={grades}
                  value={selectedGrades}
                  onChange={(selected) => {
                    setSelectedGrades(selected);
                    formik.setFieldValue(
                      "grade_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Service"
                  className={`form-multi-select form-multi-select-sm ${formik.touched.grade_id && formik.errors.grade_id
                      ? "is-invalid"
                      : ""
                    }`}
                />

                {formik.touched.grade_id && formik.errors.grade_id && (
                  <div className="invalid-feedback">
                    {formik.errors.grade_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Subject<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={subjects}
                  value={selectedSubjects}
                  onChange={(selected) => {
                    setSelectedSubjects(selected);
                    formik.setFieldValue(
                      "subject_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Service"
                  className={`form-multi-select form-multi-select-sm ${formik.touched.subject_id && formik.errors.subject_id
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
                  Topic<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={topics}
                  value={selectedTopics}
                  onChange={(selected) => {
                    setSelectedTopics(selected);
                    formik.setFieldValue(
                      "topic_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Topic"
                  className={`form-multi-select form-multi-select-sm ${formik.touched.topic_id && formik.errors.topic_id
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
                  className={`form-multi-select form-multi-select-sm ${formik.touched.ques_type && formik.errors.ques_type
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
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Difficulty Type<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.difficult_level &&
                      formik.errors.difficult_level
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("difficult_level")}
                >
                  <option value=""></option>
                  <option value="All">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {formik.touched.difficult_level &&
                  formik.errors.difficult_level && (
                    <div className="invalid-feedback">
                      {formik.errors.difficult_level}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Due Date</label>
                <span className="text-danger">*</span>
                <input
                  type="date"
                  className={`form-control form-control-sm ${formik.touched.due_date && formik.errors.due_date
                    ? "is-invalid"
                    : ""
                    }`}
                  {...formik.getFieldProps("due_date")}
                  min={today}
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
                  className={`form-control form-control-sm ${formik.touched.total_score && formik.errors.total_score
                      ? "is-invalid"
                      : ""
                    }`}
                  {...formik.getFieldProps("total_score")}
                />
                {formik.touched.total_score && formik.errors.total_score && (
                  <div className="invalid-feedback">
                    {formik.errors.total_score}
                  </div>
                )}
              </div>
            </div>
          </div>
          <ThemeProvider theme={theme}>
            <MaterialReactTable table={table} />
            {formik.touched.ques_id_with_type &&
              formik.errors.ques_id_with_type && (
                <small className="text-danger ps-2 py-2">
                  {formik.errors.ques_id_with_type}
                </small>
              )}
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
}

export default HomeworkAdd;
