
const AdminHeader = () => {
  return (
    <header className="border-bottom py-3 sticky-top-header">
    <div className="container-fluid">
      <div className="mb-npx">
        <div className="row align-items-center">
          <div className="col-sm-6 col-12 mb-4 mb-sm-0 admin-settings">
            {/* <span>
              <i className="bi bi-gear admin-icons"></i> Settings
            </span> */}
          </div>
          <div className="col-sm-6 col-12 text-sm-end">
            <div className="mx-n1">
              {/* <span className="position-relative mx-2">
                <i className="bi bi-bell admin-icons"></i>
                <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle icon-badge">
                  4
                </span>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className="position-relative mx-2">
                <i className="bi bi-question-circle admin-icons"></i>
                <span className="badge rounded-pill admin-icons2 position-absolute top-0 start-100 translate-middle icon-badge">
                  2
                </span>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className="position-relative mx-2">
                <i className="bi bi-megaphone admin-icons"></i>
                <span className="badge rounded-pill bg-primary position-absolute top-0 start-100 translate-middle icon-badge">
                  1
                </span>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className="position-relative mx-2">
                <i className="bi bi-journal admin-icons"></i>
              </span>
              &nbsp;&nbsp;&nbsp; */}
              {/* <span style={{ fontSize: "24px" }}>
                <img src={user} className="img-fluid header-user" alt="img" />
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  )
}

export default AdminHeader