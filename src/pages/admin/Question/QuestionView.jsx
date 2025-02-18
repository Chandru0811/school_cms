import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

function QustionView() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [centerList, setCenterList] = useState([]);

  const getData = async () => {
    try {
      const response = await api.get(`question/${id}`);
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

  const centerFind = (name) => {
    const FName = [];
    try {
      const centerIds = JSON.parse(name);
      centerIds.forEach((id) => {
        const center = centerList.find((center) => center.id === id);
        if (center) {
          FName.push(center.name);
        }
      });
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
    return FName.join(", ");
  };

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-2 px-2"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/question" className="custom-breadcrumb text-sm">
            &nbsp;Question
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Question View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">View Question</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/question">
              <button type="button " className="btn btn-sm btn-back">
                Back
              </button>
            </Link>
            &nbsp;&nbsp;
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
                    : {centerFind(data.question?.center_id) || "--"}
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
                  <p className="text-muted text-sm">: {data.question?.grade_id}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Subject</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.question?.subject_id}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Topic</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.question?.topic_id}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Question Type</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.question?.ques_type}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Question</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.question?.question}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Options</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.question?.options}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Difficulty Level</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.question?.difficult_level}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Hint</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.question?.hint}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Answer Type</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.answer?.answer_type}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Answer</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.answer?.answer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default QustionView;