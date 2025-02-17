import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function StudentView() {
  const [data, setData] = useState({});
  const { id } = useParams();

  const getData = async () => {
    try {
      const response = await api.get(`student/${id}`);
      const studentData = response.data.data; // Get student data
      setData(studentData); // Set student data to state
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch student details.");
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

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
          <Link to="/student" className="custom-breadcrumb text-sm">
            &nbsp;Student
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Student View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">View Student</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/student">
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
                  <p className="text-muted text-sm">: {data.center_name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Role</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data?.student?.role?.name || "No Role Available"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Student First Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.first_name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Student Middle Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.middle_name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Student Last Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.last_name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
            <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Student Email</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-break">
                    : {data?.student?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Student Mobile Number</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-break">
                    :  {data?.student?.mobile}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Parent Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-break">
                    : {data?.parent?.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Parent Email</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-break">
                    :  {data?.parent?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Parent Mobile Number</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-break">
                    :  {data?.parent?.mobile}
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
                    :{data.grade_name}
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

export default StudentView;
