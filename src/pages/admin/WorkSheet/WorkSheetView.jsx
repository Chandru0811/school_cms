import { Link, useNavigate, useParams } from "react-router-dom";
import WorkSheetAsign from "./WorkSheetAsign";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { GoTrash } from "react-icons/go";
import { MdChevronRight, MdKeyboardArrowLeft } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { FaArrowRight, FaExternalLinkAlt, FaRegClock } from "react-icons/fa";
import icon from "../../../assets/images/Icon.svg";
import icon1 from "../../../assets/images/Icon (1).svg";
import icon2 from "../../../assets/images/Icon (2).svg";
import icon3 from "../../../assets/images/Icon (3).svg";
import { RiContractLeftLine } from "react-icons/ri";

function WorkSheetView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const schoolCMS_access = localStorage.getItem("schoolCMS_access");
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const storedScreens = JSON.parse(
    localStorage.getItem("schoolCMS_Permissions") || "{}"
  );

  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`worksheet/${id}`);
      setData(response.data.data);
      setQuizData(response.data.data.student_attempts || []);
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

  // const columnsstudent = useMemo(
  //   () => [
  //     {
  //       accessorKey: "sno",
  //       header: "S.NO",
  //       size: 40,
  //       Cell: ({ row }) => row.index + 1,
  //     },
  //     {
  //       accessorKey: "student_names",
  //       header: "Student Name",
  //     },
  //     {
  //       accessorKey: "grade_name",
  //       header: "Grade",
  //     },
  //     {
  //       accessorKey: "status",
  //       header: "Status",
  //     },
  //   ],
  //   [data]
  // );

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        size: 40,
      },
      {
        accessorKey: "title",
        header: "Type",
        Cell: ({ row }) => {
          return row.original.title || row.original.question || "N/A";
        },
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
      const response = await api.post(`worksheet/status/${id}`);
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
  const names = data.student_assigned?.map((student) => student.student_names);
  console.log("names", names);
  useEffect(() => {
    getData();
  }, [id]);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  return (
    // <div className="container-fluid px-0 vh-100 mb-4">
    //   <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
    //     <div className="d-flex align-items-center">
    //       <div>
    //         <Link to="/worksheet">
    //           <button type="button " className="btn btn-sm add-btn">
    //             <MdKeyboardArrowLeft size={20} />
    //           </button>
    //         </Link>
    //         &nbsp;&nbsp;
    //       </div>
    //       <span className="mx-3 table-heading">
    //         Worksheet Details -&nbsp;
    //         <span className="table-subheading">
    //           Details of Selected Worksheet
    //         </span>
    //       </span>
    //     </div>
    //     <div className="my-2 d-flex align-items-center">
    //       {storedScreens?.data[1]?.can_delete === 1 && (
    //         <button
    //           className="btn view-delete-btn"
    //           onClick={() => {
    //             handleDeleteClick(id);
    //           }}
    //         >
    //           <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Worksheet
    //         </button>
    //       )}
    //     </div>
    //   </div>
    //   <div className="card" style={{ border: "1px solid #dbd9d0" }}>
    //     <div
    //       className="card-header d-flex justify-content-between"
    //       style={{ marginBottom: "1px solid #F4F4F4" }}
    //     >
    //       <p className="view-header">Worksheet Info</p>
    //       <div className="d-flex justify-content-end">
    //         {schoolCMS_access === "Limited Access" ? (
    //           <></>
    //         ) : (
    //           <>
    //             <button
    //               className={`btn btn-sm ${
    //                 data.active === 1 ? "btn-danger" : "btn-success"
    //               }`}
    //               onClick={handleStatusToggle}
    //             >
    //               {data.active === 1 ? "Deactivate" : "Activate"}
    //             </button>
    //           </>
    //         )}
    //         &nbsp;&nbsp;
    //         {schoolCMS_access === "Limited Access" && data.active === 1 ? (
    //           <>
    //             <Link to={`/doassessment?assignedId=${id}`}>
    //               <button
    //                 type="button"
    //                 className="btn btn-success btn-sm me-2"
    //                 style={{ fontWeight: "600 !important" }}
    //               >
    //                 Try Worksheet
    //               </button>
    //             </Link>
    //           </>
    //         ) : (
    //           <></>
    //         )}
    //         {/* &nbsp;&nbsp; */}
    //         {schoolCMS_access === "Limited Access" ? (
    //           <></>
    //         ) : (
    //           <>
    //             <button
    //               type="button"
    //               className="add-btn rounded-2"
    //               onClick={() => navigate(`/worksheet/edit/${id}`)}
    //             >
    //               <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
    //             </button>
    //           </>
    //         )}
    //         {/* {storedScreens?.data[1]?.can_edit === 1 && (
    //           <button
    //             className="btn edit-btn ms-2"
    //             onClick={() => {
    //               navigate(`/worksheet/edit/${id}`);
    //             }}
    //           >
    //             <TbEdit style={{ color: "#C0C0C0", fontSize: "16px" }} />
    //           </button>
    //         )} */}
    //       </div>
    //     </div>

    //     <>
    //       {loading ? (
    //         <div
    //           className="d-flex justify-content-center align-items-center"
    //           style={{ height: "500px" }}
    //         >
    //           <div className="spinner-border" role="status">
    //             <span className="visually-hidden">Loading...</span>
    //           </div>
    //         </div>
    //       ) : (
    //         <div className="container-fluid px-4 mb-5">
    //           <div className="row pb-3">
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Centre</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value">
    //                     :{" "}
    //                     {data.center_names && data.center_names.length > 0
    //                       ? data.center_names.join(", ")
    //                       : "N/A"}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Grade</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value">
    //                     {" "}
    //                     :{" "}
    //                     {data.grade_names && data.grade_names.length > 0
    //                       ? data.grade_names.join(", ")
    //                       : "N/A"}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Topic</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value">
    //                     :{" "}
    //                     {Array.isArray(data.topic_names)
    //                       ? data.topic_names.join(", ")
    //                       : data.topic_names}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Title</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value">: {data.title}</p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Type</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value">: {data.type}</p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Subject</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value">
    //                     :{" "}
    //                     {Array.isArray(data.subject_names)
    //                       ? data.subject_names.join(", ")
    //                       : data.subject_names}{" "}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Question Type</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value">
    //                     :{" "}
    //                     {data.ques_type
    //                       ? JSON.parse(data.ques_type).join(", ")
    //                       : ""}
    //                   </p>{" "}
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Difficult Level</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value text-break ">
    //                     : {data.difficult_level}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Total Score</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value text-break ">
    //                     : {data.total_score}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Traget Score</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value text-break ">
    //                     : {data.target_score}
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6 col-12 my-2 mb-5">
    //               <div className="row">
    //                 <div className="col-6">
    //                   <p className="view-label-text">Reward</p>
    //                 </div>
    //                 <div className="col-6">
    //                   <p className="view-value text-break ">: {data.reward}</p>
    //                 </div>
    //               </div>
    //             </div>
    //             {schoolCMS_access === "Limited Access" ? (
    //               <></>
    //             ) : (
    //               <>
    //                 {/* <ThemeProvider theme={theme}>
    //                   <MaterialReactTable columns={columnsstudent} data={data.student_assigned || []} />
    //                 </ThemeProvider> */}

    //                 <ThemeProvider theme={theme}>
    //                   <MaterialReactTable
    //                     columns={columns}
    //                     data={data.questions}
    //                     enableColumnActions={false}
    //                     enableColumnFilters={false}
    //                     enableDensityToggle={false}
    //                     enableFullScreenToggle={false}
    //                     muiTableBodyRowProps={({ row }) => ({
    //                       onClick: () =>
    //                         data.type === "challenge"
    //                           ? navigate(`/challenges/view/${row.original.id}`)
    //                           : navigate(`/question/view/${row.original.id}`),
    //                       style: { cursor: "pointer" },
    //                     })}
    //                   />
    //                 </ThemeProvider>
    //               </>
    //             )}
    //           </div>
    //         </div>
    //       )}
    //     </>
    //   </div>
    // </div>
    <div className="container-lg container-fluid px-1 px-md-5">
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
          <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
            <div className="d-flex align-items-center">
              <div>
                <Link to="/worksheet">
                  <button type="button " className="btn btn-sm add-btn">
                    <MdKeyboardArrowLeft size={20} />
                  </button>
                </Link>
                &nbsp;&nbsp;
              </div>
              <span className="mx-3 table-heading">
                Worksheet Details -&nbsp;
                <span className="table-subheading">
                  Details of Selected Worksheet
                </span>
              </span>
            </div>
            <div
              className="card-header d-flex justify-content-between"
              style={{ marginBottom: "1px solid #F4F4F4" }}
            ></div>
            {/* <div className="my-2 d-flex align-items-center">
          {storedScreens?.data[1]?.can_delete === 1 && (
            <button
              className="btn view-delete-btn"
              onClick={() => {
                handleDeleteClick(id);
              }}
            >
              <GoTrash className="trash-icon" /> &nbsp;&nbsp; Delete Worksheet
            </button>
          )}
        </div> */}
          </div>
          <div className="worksheet-header">
            <div className="left-section">
              <h5 className="worksheet-title">Worksheet Name</h5>
            </div>
            <div
              className="right-section"
              style={{
                padding:
                  schoolCMS_access === "Limited Access" &&
                  data?.worksheet?.active === 1 &&
                  id
                    ? "25px"
                    : "40px",
              }}
            >
              {schoolCMS_access === "Limited Access" &&
                data?.worksheet?.active === 1 &&
                id && (
                  <Link to={`/doassessment?assignedId=${id}`}>
                    <button className="start-btn" type="button">
                      Start Answering{" "}
                      <MdChevronRight size={20} style={{ paddingTop: "3px" }} />
                    </button>
                  </Link>
                )}
            </div>
          </div>
          <div className="card border-0 card-shw">
            <div className="row">
              <div className="col-md-6 col-12 my-2">
                <div className="row px-5">
                  <div className="col-12 my-2">
                    <div className="row">
                      <div className="col-4">
                        <p className="view-label-text">Subject</p>
                      </div>
                      <div className="col-8">
                        <p className="view-value">Neet</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 my-2">
                    <div className="row">
                      <div className="col-4">
                        <p className="view-label-text">Difficulty</p>
                      </div>
                      <div className="col-8">
                        <p className="view-value">
                          {data?.worksheet?.difficult_level}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 my-2">
                    <div className="row">
                      <div className="col-4">
                        <p className="view-label-text">Type</p>
                      </div>
                      <div className="col-8">
                        <p className="view-value">Multiple Choice Questions</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 my-2">
                    <div className="row">
                      <div className="col-4">
                        <p className="view-label-text">Creator</p>
                      </div>
                      <div className="col-8">
                        <p className="view-value">{data?.worksheet?.created_by?.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 my-5">
                <div className="row">
                  <div className="col-md-6 col-lg-6 col-sm-6">
                    <div className="d-flex gap-3">
                      <div className=" ">
                        <img
                          src={icon}
                          alt=""
                          className="ms-2 py-3"
                          style={{ minWidth: "50px", minHeight: "auto" }}
                        />
                      </div>
                      <div className="py-3">
                        <p className="dash-font" style={{ fontSize: "12px" }}>
                          TOTAL
                        </p>
                        <p
                          className="dash-font heading-color fw-bold"
                          style={{ fontSize: "14px" }}
                        >
                          {data?.worksheet?.total_score} Questions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-sm-6">
                    <div className="d-flex gap-3">
                      <div className="">
                        <img
                          src={icon1}
                          alt=""
                          className="ms-2 py-3"
                          style={{ minWidth: "50px", minHeight: "auto" }}
                        />
                      </div>
                      <div className="py-3">
                        <p className="dash-font" style={{ fontSize: "12px" }}>
                          TARGET
                        </p>
                        <p
                          className="dash-font heading-color fw-bold"
                          style={{ fontSize: "14px" }}
                        >
                          {data?.worksheet?.target_score} Questions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-sm-6">
                    <div className="d-flex gap-3">
                      <div className=" ">
                        <img
                          src={icon2}
                          alt=""
                          className="ms-2 py-3"
                          style={{ minWidth: "50px", minHeight: "auto" }}
                        />
                      </div>
                      <div className="py-3">
                        <p className="dash-font" style={{ fontSize: "12px" }}>
                          TIME
                        </p>
                        <p
                          className="dash-font heading-color fw-bold"
                          style={{ fontSize: "14px" }}
                        >
                          15:00 Mins
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-sm-6">
                    <div className="d-flex gap-3">
                      <div className=" ">
                        <img
                          src={icon3}
                          alt=""
                          className="ms-2 py-3"
                          style={{ minWidth: "50px", minHeight: "auto" }}
                        />
                      </div>
                      <div className="py-3">
                        <p className="dash-font" style={{ fontSize: "12px" }}>
                          REWARD
                        </p>
                        <p
                          className="dash-font heading-color fw-bold"
                          style={{ fontSize: "14px" }}
                        >
                          + {data?.worksheet?.reward} Points
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-5">
            <h6 className="fs-5 fw-semibold dash-font border-bottom heading-color pb-4 my-5">
              Past Attempts
            </h6>
            <div
              className="row g-4 overflow-y-auto view-scroll"
              style={{ maxHeight: "350px" }}
            >
              {quizData.length > 0 ? (
                quizData.map((quiz, index) => (
                  <div key={index} className="col-md-6 col-xl-4 col-sm-6">
                    <div className="card p-3 shadow-sm border-0 rounded-4">
                      <div className="d-flex align-items-center mb-2 ms-1">
                        <FaRegClock className="me-2" />
                        <span>
                          {new Date(quiz.created_at).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className="row mb-4">
                        {[
                          { label: "TOTAL", value: quiz.total_questions },
                          {
                            label: "CORRECT",
                            value: quiz.total_correct_answers,
                          },
                          {
                            label: "SKIPPED",
                            value: quiz.total_skipped_questions,
                          },
                          { label: "WRONG", value: quiz.total_wrong_answers },
                        ].map((item, idx) => (
                          <div key={idx} className="col-3">
                            <p
                              className="mb-1 text-muted fw-semibold"
                              style={{ fontSize: "10px" }}
                            >
                              {item.label}
                            </p>
                            <h3 className="fw-bold">{item.value}</h3>
                          </div>
                        ))}
                      </div>
                      <p className="border-bottom"></p>
                      <div className="d-flex justify-content-around align-items-center py-1 view-answer mx-3 mt-2">
                        <p>View Answers</p>
                        <p>
                          <FaExternalLinkAlt className="ms-2" />
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No past attempts available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkSheetView;
