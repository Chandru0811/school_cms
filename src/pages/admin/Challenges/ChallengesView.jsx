import { Link } from "react-router-dom";
import ChallengesAssign from "./ChallengesAssign";

function ChallengesView() {
  const data = {
    centre_id: "SRDK",
    grade_id: "10 Grade",
    subject_topic: "Science",
    type: "Math",
    title: "Solving for x",
    description: "Solve for x in the equation 3x - 4 = 11",
    level: "Medium",
    hint: "First, add 4 to both sides, then divide by 3.",
    time_limit: 20,
    ques_type: "Filled",
  };

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
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/challenges" className="custom-breadcrumb text-sm">
            &nbsp;Challenges
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Challenges View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">View Challenges</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/challenges">
              <button type="button " className="btn btn-sm btn-back">
                Back
              </button>
            </Link>
            &nbsp;&nbsp;
            <ChallengesAssign />
            <button
              type="button"
              className="btn btn-success btn-sm me-2"
              style={{ fontWeight: "600px !important" }}
            >
              Activate
            </button>
          </div>
        </div>
        <div className="container-fluid px-4">
          <div className="row pb-3">
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Centre Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.centre_id}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Grade</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.grade_id}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Subject Topic</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.subject_topic}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Level</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.level}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Challenge Title</p>
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
                  <p className="fw-medium text-sm">Time Limit</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.time_limit}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Hint</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-break ">
                    : {data.hint}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Challenge Description</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-break ">
                    : {data.description}
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

export default ChallengesView;
