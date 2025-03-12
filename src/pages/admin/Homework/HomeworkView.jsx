import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import HomeworkAssign from "./HomeworkAssign";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import DeleteChange from "../../../components/common/DeleteChange";

function HomeworkView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const assigned_id = id;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const schoolCMS_access = localStorage.getItem("schoolCMS_access");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );
  const [selectedId, setSelectedId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

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
      <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/homework">
              <button type="button " className="btn btn-sm add-btn">
                <MdKeyboardArrowLeft size={20} />
              </button>
            </Link>
            &nbsp;&nbsp;
          </div>
          <span className="mx-3 table-heading">
            Home Work Details -&nbsp;
            <span className="table-subheading">
              Details of Selected Home Work
            </span>
          </span>
        </div>
        <div className="my-2 d-flex align-items-center">
          {storedScreens?.data[1]?.can_delete === 1 && (
            <button
              className="btn view-delete-btn"
              onClick={() => {
                handleDeleteClick(id);
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Home Work
            </button>
          )}
        </div>
      </div>
      <div className="mx-4 card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div
          className="card-header d-flex justify-content-between"
          style={{ marginBottom: "1px solid #F4F4F4" }}
        >
          <p className="view-header">Home Work Info</p>
          <div className="d-flex justify-content-end">
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
                  className="btn btn-sm add-btn"
                  onClick={() => navigate(`/homework/edit/${id}`)}
                >
                  <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
                </button>
              </>
            )}
            {/* {storedScreens?.data[1]?.can_edit === 1 && (
                    <button
                      className="btn edit-btn ms-2"
                      onClick={() => {
                        navigate(`/Home Work/edit/${id}`);
                      }}
                    >
                      <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
                    </button>
                  )} */}
          </div>
        </div>
        {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "500px" }}
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
          <>
            <div className="container-fluid px-4 mb-2">
              <div className="row pb-3">
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Centre</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">
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
                      <p className="view-label-text">Grade</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">
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
                      <p className="view-label-text">Topic</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">: {data.topic_names}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Title</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">: {data.title}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Subject</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">
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
                      <p className="view-label-text">Question Type</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value">
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
                      <p className="view-label-text">Difficult Level</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value text-break ">
                        : {data.difficult_level}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Due Date</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value text-break ">
                        : {data.due_date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="view-label-text">Total Score</p>
                    </div>
                    <div className="col-6">
                      <p className="view-value text-break ">
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
                {deleteModalOpen && selectedId && (
                  <DeleteChange
                    path={`homework/delete/${id}`}
                    onDeleteSuccess={() => {
                      setDeleteModalOpen(false);
                      navigate("/student");
                    }}
                    onClose={() => setDeleteModalOpen(false)}
                  />
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
