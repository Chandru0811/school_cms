import { Link, useParams } from "react-router-dom";
import WorkSheetAsign from "../WorkSheet/WorkSheetAsign";
import { useEffect, useState } from "react";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function HomeworkView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [centerList, setCenterList] = useState([]);
  const assigned_id = id;
  console.log("idddss", assigned_id)

  const getData = async () => {
    try {
      const response = await api.get(`homework/${id}`);
      setData(response.data.data);
    } catch (e) {
      const errorMessage =
        e?.response?.data?.error || "Error Fetching Data. Please try again.";
      toast.error(errorMessage);
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
          <Link to="/homework" className="custom-breadcrumb text-sm">
            &nbsp;Homework
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Homework View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
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
            <Link
              to={`/doassessment?grade_ids=${encodeURIComponent(
                JSON.stringify(data.grade_id ? JSON.parse(data.grade_id) : [])
              )}&assignedId=${assigned_id}`}
            >
              <button
                type="button"
                className="btn btn-success btn-sm me-2"
                style={{ fontWeight: "600 !important" }}
              >
                Do Assessment
              </button>
            </Link>
          </div>
        </div>
        <div className="container-fluid px-4">
          <div className="row pb-3">
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Centre</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.center_names || "--"}
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
                    : {JSON.parse(data.grade_id || "[]").join(", ") || "--"}
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
                  <p className="text-muted text-sm">
                    : {JSON.parse(data.topic_id || "[]").join(", ") || "--"}
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
                  <p className="fw-medium text-sm">Subject</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {JSON.parse(data.subject_id || "[]").join(", ") || "--"}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeworkView;
