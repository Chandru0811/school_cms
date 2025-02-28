import { Link, useNavigate, useParams } from "react-router-dom";
import WorkSheetAsign from "./WorkSheetAsign";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";

function WorkSheetView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  // const [centerList, setCenterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const schoolCMS_access = localStorage.getItem("schoolCMS_access");
  const assigned_id = id;
  console.log("idddss", assigned_id);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`worksheet/${id}`);
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

          // Check if question type is "closed"
          if (questionTypeObj?.questype.toLowerCase() === "closed") {
            return "Yes/No";
          }
          return row.original.options || "N/A";
        },
      },
    ],
    [data]
  );

  // Function to Toggle Status
  const handleStatusToggle = async () => {
    try {
      const response = await api.post(`worksheet/status/${id}`);
      if (response.status === 200) {
        toast.success("Status updated successfully!");
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
  const names = data.student_assigned?.map(student => student.student_names);
  console.log("names", names)
  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div className="container-fluid px-0 vh-100 mb-4">
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
          <Link to="/worksheet" className="custom-breadcrumb text-sm">
            &nbsp;Worksheet
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Worksheet View
        </li>
      </ol>
      <div className="card" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">View Worksheet</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/worksheet">
              <button type="button " className="btn btn-sm btn-back">
                Back
              </button>
            </Link>
            &nbsp;&nbsp;
            {schoolCMS_access === "Limited Access" ? (
              <></>
            ) : (
              <>
                <WorkSheetAsign
                  grade_ids={data.grade_id ? JSON.parse(data.grade_id) : []}
                  assignedId={assigned_id}
                />
              </>
            )}
            {schoolCMS_access === "Limited Access" ? (
              <></>
            ) : (
              <>
                <button
                  className={`btn btn-sm ${data.active === 1 ? "btn-danger" : "btn-success"
                    }`}
                  onClick={handleStatusToggle}
                >
                  {data.active === 1 ? "Deactivate" : "Activate"}
                </button>
              </>
            )}
            &nbsp;&nbsp;
            {schoolCMS_access === "Limited Access" ? (
              <>
                <Link to={`/doassessment?assignedId=${assigned_id}`}>
                  <button
                    type="button"
                    className="btn btn-success btn-sm me-2"
                    style={{ fontWeight: "600 !important" }}
                  >
                    Do Assessment
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
                  onClick={() => navigate(`/worksheet/edit/${id}`)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
        <>
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="container-fluid px-4 mb-5">
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
                      <p className="text-muted text-sm">                     :{" "}
                        {data.grade_names && data.grade_names.length > 0
                          ? data.grade_names.join(", ")
                          : "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Topic</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {Array.isArray(data.topic_names)
                          ? data.topic_names.join(", ")
                          : data.topic_names}
                      </p>
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
                      <p className="fw-medium text-sm">Type</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.type}</p>
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
                        {Array.isArray(data.subject_names)
                          ? data.subject_names.join(", ")
                          : data.subject_names}{" "}
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
                      <p className="fw-medium text-sm">Total Score</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm text-break ">
                        : {data.total_score}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Traget Score</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm text-break ">
                        : {data.target_score}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Reward</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm text-break ">
                        : {data.reward}
                      </p>
                    </div>
                  </div>
                </div>
                {data.student_assigned && data.student_assigned.length > 0 && (
                  <div className="col-md-12 col-12">
                    <h5 className="fw-bold">Student Assigned</h5>
                    <div className="row">
                      {data.student_assigned.map((student, index) => (
                        <div key={index}>
                          <div className="col-md-6 col-12 my-2">
                            <div className="row">
                              <div className="col-6">
                                <p className="fw-medium text-sm">
                                  Student Name
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm text-break ">
                                  : {student.student_names.join(", ")}
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
                                <p className="text-muted text-sm text-break ">
                                  : {student.grade_name}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <ThemeProvider theme={theme}>
                <MaterialReactTable columns={columns} data={data.questions} />
              </ThemeProvider>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

export default WorkSheetView;
