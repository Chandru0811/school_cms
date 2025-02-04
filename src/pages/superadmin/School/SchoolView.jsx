import { Link } from "react-router-dom";

function SchoolView() {
  const data = {
    school_name: "SRDK",
    school_location: "Thiruvottuyur",
    admin_name: "Suriya",
    admin_email: "suriya@gmail.com",
    admin_password: "12345678",
    admin_cpassword: "12345678",
  };

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-2 px-2"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/school" className="custom-breadcrumb">
            &nbsp;School
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;School View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">View School</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/school">
              <button type="button " className="btn btn-sm btn-border">
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
                  <p className="fw-medium text-sm">School Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.school_name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">School Location</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.school_location}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Admin Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.admin_name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Admin Email</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.admin_email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolView;
