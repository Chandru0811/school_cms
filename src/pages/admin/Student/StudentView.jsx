import { Link,  } from "react-router-dom";

function StudentView() {
  return (
    <div className="container card p-3">
      <ol
              className="breadcrumb my-3"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              <li>
                <Link to="/" className="custom-breadcrumb">
                  Home
                </Link>
                <span className="breadcrumb-separator"> &gt; </span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              <Link to="/student" className="custom-breadcrumb">
                &nbsp;Student
                </Link>
              </li>
              <span className="breadcrumb-separator"> &gt; </span>
              <li className="breadcrumb-item active" aria-current="page">
                &nbsp;Student View
              </li>
            </ol>
            <div className="d-flex justify-content-between align-items-center card_header p-2">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted">&nbsp;
              <span className="database_name">View Student</span>
            </span>
          </div>
          <div className="mb-3 d-flex justify-content-end">
          <Link to="/student" className="custom-breadcrumb">
          <button
              type="button"
              className="btn btn-sm btn-back me-2"
              style={{ fontWeight: "600px !important" }} >
               Back
            </button>
            </Link>
        </div>
        </div>
      <div className="row gx-3">
        <div className="col-md-6 col-12">
          <div className="row mt-3  mb-2">
            <div className="col-6 ">
              <p className="">Centre Name</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">:</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Student First Name</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Student Middle Name</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Student Last Name</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Student Email</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Student Mobile Number</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Parent Name</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Parent Email</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Parent Mobile Number</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Grader List</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Roll Number</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Admission Number</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="row  mb-2 mt-3">
            <div className="col-6  ">
              <p className="">Admission Date</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">: </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentView;
