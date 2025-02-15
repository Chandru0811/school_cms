import { useEffect, useState } from "react";
import { Link, useParams} from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

function EmployeeView() {
const [data,setData] = useState({});
const { id } = useParams();

const getEmployeeData = async () => {
  try {
    const response = await api.get(`employee/${id}`);
    setData(response.data.data);
  } catch (e) {
    const errorMessage = e?.response?.data?.error || "Error Fetching Data. Please try again.";
    toast.error(errorMessage);
  }
};


useEffect(() => {
  getEmployeeData();
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
          <Link to="/employee" className="custom-breadcrumb text-sm">
            &nbsp;Employee
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Employee View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">View Employee</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/employee">
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
                  <p className="text-muted text-sm">: {data.center_id}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Role</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.role_id}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Employee Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Employee Email</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.email}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Employee Email</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

EmployeeView.propTypes = {
  id: PropTypes.number.isRequired,
};

export default EmployeeView;
