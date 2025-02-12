function DoAssessment() {
  return (
    <section>
      <div className="container-fluid ">
        <div className="row" style={{ background: "white" }}>
          <div className="col-md-2 col-12"></div>
          <div
            className="col-md-8 col-12 d-flex align-items-center justify-content-center flex-column"
            style={{ minHeight: "80vh" }}
          >
            <h4 className="text-center my-5">Worksheet </h4>
            <div className="card custom-card p-3 m-5" style={{ width: "100%" }}>
              <p className="mb-3">
                <strong>Question 1</strong>:
              </p>
              <p className="mb-3">What is your name?</p>
              <textarea
                className="form-control mb-3"
                placeholder="Write your answer here..."
                rows={4}
              />
              <div className="d-flex justify-content-between mb-4">
                <p>
                  Time spent : <span className="text-muted">30 sec</span>
                </p>
                <p className="text-danger">
                  Time left : <span>1 min</span>
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <button type="button " className="btn btn-previous">
                  Previous
                </button>
                &nbsp;&nbsp;
                <button type="button" className="btn btn-next">
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-12"></div>
        </div>
      </div>
    </section>
  );
}

export default DoAssessment;
