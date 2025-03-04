import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import HomeworkAssign from "./HomeworkAssign";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";

function HomeworkView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const assigned_id = id;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const schoolCMS_access = localStorage.getItem("schoolCMS_access");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`homework/${id}`);
      setData(response.data.data);
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error || "Error Fetching Data. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  //Question table
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
    },
  });

  const columnsstudent = useMemo(
    () => [
      {
        accessorKey: "sno",
        header: "S.NO",
        size: 40,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "student_names",
        header: "Student Name",
      },
      {
        accessorKey: "grade_name",
        header: "Grade",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    [data]
  );
  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        size: 40,
      },
      {
        accessorKey: "question",
        header: "Question",
      },
      {
        accessorKey: "questype",
        header: "Quest Type",
        Cell: ({ row }) => {
          const quesIdWithType = JSON.parse(data.ques_id_with_type);
          const questionTypeObj = quesIdWithType.find(
            (q) => q.id === row.original.id
          );
          return questionTypeObj ? questionTypeObj.questype : "N/A";
        },
      },
      {
        accessorKey: "options",
        header: "Options",
        Cell: ({ row }) => {
          const quesIdWithType = JSON.parse(data.ques_id_with_type);
          const questionTypeObj = quesIdWithType.find(
            (q) => q.id === row.original.id
          );
          if (!questionTypeObj) {
            return "--";
          }
          if (questionTypeObj.questype.toLowerCase() === "closed") {
            return "Yes/No";
          }
          if (questionTypeObj.questype.toLowerCase() === "multichoice") {
            return row.original.options || "--";
          }
          return "--";
        },
      },
    ],
    [data]
  );

  // Function to Toggle Status
  const handleStatusToggle = async () => {
    try {
      const response = await api.post(`homework/status/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setData((prevData) => ({
          ...prevData,
          active: prevData.active === 1 ? 0 : 1,
        }));
      }
    } catch (error) {
      toast.error("Error updating status!");
      console.error("Status Update Error:", error);
    }
  };

  // const getCenterList = async () => {
  //   try {
  //     const response = await api.get("centers/list");
  //     setCenterList(response.data.data);
  //   } catch (e) {
  //     toast.error(
  //       `Error Fetching Centers: ${e?.response?.data?.error || e.message}`
  //     );
  //   }
  // };

  useEffect(() => {
    getData();
    // getCenterList();
  }, [id]);

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-2 px-2 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li>
          <Link to="/homework" className="custom-breadcrumb text-sm">
            &nbsp;Homework
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Homework View
        </li>
      </ol>
      <div className="card" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">View Homework</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/homework">
              <button type="button " className="btn btn-sm btn-back">
                Back
              </button>
            </Link>
            &nbsp;&nbsp;
            {schoolCMS_access === "Limited Access" ? (
              <></>
            ) : (
              <>
                <HomeworkAssign
                  grade_ids={data.grade_id ? JSON.parse(data.grade_id) : []}
                  assignedId={assigned_id}
                  onSuccess={getData}
                />
              </>
            )}
            {schoolCMS_access === "Limited Access" ? (
              <></>
            ) : (
              <>
                <button
                  className={`btn btn-sm ${
                    data.active === 1 ? "btn-danger" : "btn-success"
                  }`}
                  onClick={handleStatusToggle}
                >
                  {data.active === 1 ? "Deactivate" : "Activate"}
                </button>
              </>
            )}
            &nbsp;&nbsp;
            {schoolCMS_access === "Limited Access" && data.active === 1 ? (
              <>
                <Link to={`/homedoassessment?assignedId=${assigned_id}`}>
                  <button
                    type="button"
                    className="btn btn-success btn-sm me-2"
                    style={{ fontWeight: "600 !important" }}
                  >
                    Do Homework
                  </button>
                </Link>
              </>
            ) : (
              <></>
            )}
            {/* &nbsp;&nbsp; */}
            {schoolCMS_access === "Limited Access" ? (
              <></>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-button"
                  onClick={() => navigate(`/homework/edit/${id}`)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="container-fluid px-4 mb-2">
              <div className="row pb-3">
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Centre</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.center_names && data.center_names.length > 0
                          ? data.center_names.join(", ")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Grade</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.grade_names && data.grade_names.length > 0
                          ? data.grade_names.join(", ")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Topic</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.topic_names}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Title</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.title}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Subject</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.subject_names && data.subject_names.length > 0
                          ? data.subject_names.join(", ")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Question Type</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.ques_type
                          ? JSON.parse(data.ques_type).join(", ")
                          : ""}
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Difficult Level</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm text-break ">
                        : {data.difficult_level}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Due Date</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm text-break ">
                        : {data.due_date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Total Score</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm text-break ">
                        : {data.total_score}
                      </p>
                    </div>
                  </div>
                </div>
                {schoolCMS_access === "Limited Access" ? (
                  <></>
                ) : (
                  <>
                    <ThemeProvider theme={theme}>
                      <MaterialReactTable
                        columns={columnsstudent}
                        data={data.student_assigned || []}
                      />
                    </ThemeProvider>

                    <ThemeProvider theme={theme}>
                      <MaterialReactTable
                        columns={columns}
                        data={data.questions}
                        enableColumnActions={false}
                        enableColumnFilters={false}
                        enableDensityToggle={false}
                        enableFullScreenToggle={false}
                        muiTableBodyRowProps={({ row }) => ({
                          onClick: () =>
                            navigate(`/question/view/${row.original.id}`),
                          style: { cursor: "pointer" },
                        })}
                      />
                    </ThemeProvider>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomeworkView;
