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
import { FiSave } from "react-icons/fi";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";

function WorkSheetAdd() {
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
  const validationSchema = yup.object().shape({
    type: yup.string().required("*Select a question type"),
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
    ques_type: yup
      .array()
      .of(yup.string().required("*Select at least one question type"))
      .min(1, "*Select at least one question type")
      .required("*Select a question type name"),
    target_score: yup
      .number()
      .typeError("*Target Score must be a number")
      .required("*Target Score field is required")
      .positive("*Target Score must be a positive number")
      .integer("*Target Score must be an integer"),
    total_score: yup
      .number()
      .typeError("*Totle Score must be a number")
      .required("*Totle Score field is required")
      .positive("*Totle Score must be a positive number")
      .integer("*Totle Score must be an integer"),
    reward: yup
      .number()
      .typeError("*Reward must be a number")
      .required("*Reward field is required")
      .positive("*Reward must be a positive number")
      .integer("*Reward must be an integer"),
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
      type: "question",
      title: "",
      center_id: [],
      grade_id: [],
      subject_id: [],
      topic_id: [],
      ques_type: [],
      difficult_level: "",
      total_score: "",
      target_score: "",
      reward: "",
      // type: "",
      // difficult_type: "",
      ques_id_with_type: [],
      question_id: [],
      // question: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form Values:", values);
      try {
        const response = await api.post("worksheet", values);
        if (response.status === 200) {
          console.log("object", response);
          toast.success(response.data?.message);
          formik.resetForm();
          navigate("/worksheet");
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
              <div className="d-flex gap-3">
                {quesTypes.map((t, i) => (
                  <div className="form-check" key={`${row.id}-${i}`}>
                    <label className="form-check-label">
                      <input
                        placeholder="Enter Text"
                        type="radio"
                        // name={`ques_id_with_type_${row.id}`}
                        value={t}
                        className="form-check-input position-relative"
                        style={{ top: "-2px" }}
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

  const filterData = async () => {
    try {
      const response = await api.get(`filter/worksheet/${formik.values.type}`, {
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
              <Link to="/worksheet">
                <button type="button" className="btn btn-sm add-btn p-1">
                  <MdKeyboardArrowLeft size={25} />
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
            <span className="mx-3 table-heading">
              Add Worksheet -&nbsp;
              <span className="table-subheading">Add a new Worksheet</span>
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
              <FiSave className="trash-icon" /> &nbsp;&nbsp; Save Worksheet
            </button>
          </div>
        </div>
        <div className="card" style={{ border: "1px solid #dbd9d0" }}>
          <div className="d-flex justify-content-between px-5 my-2">
            <p className="view-header">Worksheet Info</p>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      placeholder="Enter Text"
                      type="radio"
                      name="type"
                      value="question"
                      className="form-check-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.type === "question"}
                    />
                    <label className="form-check-label">Q/A</label>
                  </div>
                  <div className="form-check">
                    <input
                      placeholder="Enter Text"
                      type="radio"
                      name="type"
                      value="challenge"
                      className={`form-check-input ${
                        formik.touched.type && formik.errors.type
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.type === "challenge"}
                    />
                    <label className="form-check-label">Challenge</label>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    {formik.values.type === "challenge" ? (
                      <label className="form-label">
                        Challenge Title<span className="text-danger">*</span>
                      </label>
                    ) : formik.values.type === "question" ? (
                      <label className="form-label">
                        Q/A Title<span className="text-danger">*</span>
                      </label>
                    ) : null}
                  </div>
                  <div className="col-7">
                    <input
                      placeholder="Enter Text"
                      className={`form-control form-control-sm ${
                        formik.touched.title && formik.errors.title
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("title")}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <div className="invalid-feedback">
                        {formik.errors.title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Centre</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
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
                          setTopics([]);
                          formik.setFieldValue("grade_id", []);
                          formik.setFieldValue("subject_id", []);
                          formik.setFieldValue("topic_id", []);
                          setSelectedGrades([]);
                          setSelectedSubjects([]);
                          setSelectedTopics([]);
                        }
                      }}
                      labelledBy="Select Service"
                      className={`form-multi-select form-multi-select-sm border-1 rounded-1 ${
                        formik.touched.center_id && formik.errors.center_id
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
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Grade</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <MultiSelect
                      options={grades}
                      value={selectedGrades}
                      onChange={(selected) => {
                        setSelectedGrades(selected);
                        formik.setFieldValue(
                          "grade_id",
                          selected.map((option) => option.value)
                        );
                        if (selected.length === 0) {
                          setSubjects([]);
                          setTopics([]);
                          formik.setFieldValue("subject_id", []);
                          formik.setFieldValue("topic_id", []);
                          setSelectedSubjects([]);
                          setSelectedTopics([]);
                        }
                      }}
                      labelledBy="Select Service"
                      className={`form-multi-select form-multi-select-sm border-1 rounded-1 ${
                        formik.touched.grade_id && formik.errors.grade_id
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
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Subject</p>
                  </div>
                  <div className="col-7">
                    <MultiSelect
                      options={subjects}
                      value={selectedSubjects}
                      onChange={(selected) => {
                        setSelectedSubjects(selected);
                        formik.setFieldValue(
                          "subject_id",
                          selected.map((option) => option.value)
                        );
                        if (selected.length === 0) {
                          setTopics([]);
                          formik.setFieldValue("topic_id", []);
                          setSelectedTopics([]);
                        }
                      }}
                      labelledBy="Select Service"
                      className="form-multi-select form-multi-select-sm border-1 rounded-1"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Topic</p>
                  </div>
                  <div className="col-7">
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
                      className="form-multi-select form-multi-select-sm border-1 rounded-1"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    {formik.values.type === "challenge" ? (
                      <label className="form-label">
                        Challenge Type<span className="text-danger">*</span>
                      </label>
                    ) : formik.values.type === "question" ? (
                      <label className="form-label">
                        Q/A Type<span className="text-danger">*</span>
                      </label>
                    ) : null}
                  </div>
                  <div className="col-7">
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
                      className={`form-multi-select form-multi-select-sm border-1 rounded-1 ${
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
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Difficulty Type</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <select
                      className={`form-select form-select-sm ${
                        formik.touched.difficult_level &&
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
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Total Scoree</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.total_score && formik.errors.total_score
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("total_score")}
                    />
                    {formik.touched.total_score &&
                      formik.errors.total_score && (
                        <div className="invalid-feedback">
                          {formik.errors.total_score}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Target Score</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.target_score &&
                        formik.errors.target_score
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("target_score")}
                    />
                    {formik.touched.target_score &&
                      formik.errors.target_score && (
                        <div className="invalid-feedback">
                          {formik.errors.target_score}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-4">
                  <div className="col-5 d-flex">
                    <p className="view-label-text">Reward</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className="col-7">
                    <input
                      placeholder="Enter Text"
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.reward && formik.errors.reward
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("reward")}
                    />
                    {formik.touched.reward && formik.errors.reward && (
                      <div className="invalid-feedback">
                        {formik.errors.reward}
                      </div>
                    )}
                  </div>
                </div>
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

export default WorkSheetAdd;
