import { Link, useNavigate, useParams } from "react-router-dom";
import WorkSheetAsign from "./WorkSheetAsign";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function WorkSheetView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [centerList, setCenterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      setCenterList(response.data.data);
    } catch (e) {
      toast.error(
        `Error Fetching Centers: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  useEffect(() => {
    getData();
    getCenterList();
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
          <Link to="/worksheet" className="custom-breadcrumb text-sm">
            &nbsp;Worksheet
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Worksheet View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
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
            <WorkSheetAsign
              grade_ids={data.grade_id ? JSON.parse(data.grade_id) : []}
              assignedId={assigned_id}
            />
            <button
              type="button"
              className="btn btn-success btn-sm me-2"
              style={{ fontWeight: "600px !important" }}
            >
              Activate
            </button>
            <Link to={`/doassessment?assignedId=${assigned_id}`}>
              <button
                type="button"
                className="btn btn-success btn-sm me-2"
                style={{ fontWeight: "600 !important" }}
              >
                Do Assessment
              </button>
            </Link>
            &nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-sm btn-button"
              onClick={() => navigate(`/worksheet/edit/${id}`)}
            >
              Edit
            </button>
          </div>
        </div>
        <>
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="container-fluid px-4">
              <div className="row pb-3">
                <div className="col-md-6 col-12 my-2">
                  <div className="row">
                    <div className="col-6">
                      <p className="fw-medium text-sm">Centre</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.center_names}
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
                      <p className="text-muted text-sm">: {data.grade_names}</p>
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
                      <p className="text-muted text-sm">: {data.ques_type}</p>
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
              </div>

              <div class="container-fluid mt-4">
                {/* <h3 class="mb-3">Questions Table</h3> */}
                <table className="table">
                  <thead className="table-dark">
                    <tr>
                      <th>Question</th>
                      <th>Quest Type</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.questions.map((question, index) => {
                      // Parse ques_id_with_type JSON and find the matching question type based on ID
                      const quesIdWithType = JSON.parse(data.ques_id_with_type);
                      const questionTypeObj = quesIdWithType.find(
                        (q) => q.id === question.id
                      );
                      const questionType = questionTypeObj
                        ? questionTypeObj.questype
                        : "N/A"; // Default fallback

                      return (
                        <tr key={question.id}>
                          <td>{question.question}</td>
                          <td>{questionType}</td>
                          <td>{question.options ? question.options : "N/A"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

export default WorkSheetView;
