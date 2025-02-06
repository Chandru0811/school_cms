function Center() {
    const data = {
      school_name: "SRDK",
      location: "Washermenpet",
    };
  
    return (
      <div className="container-fluid px-4">
        <div className="row pb-3">
          <div className="col-md-6 col-12 my-2">
            <div className="row">
              <div className="col-6">
                <p className="fw-medium text-sm">Centre Name</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.school_name}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 my-2">
            <div className="row">
              <div className="col-6">
                <p className="fw-medium text-sm">Location</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Center;
  