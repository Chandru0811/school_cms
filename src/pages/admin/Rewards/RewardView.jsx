import { Link } from "react-router-dom";

function RewardView() {
  const data = {
    target_archieved: 1,
    name: "Star of the Month",
    description: "Reward for best performance",
    reward_type: ["Gift Card", "Cash"],
    reward_value: "1000",
    image: null,
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
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li>
          <Link to="/rewards" className="custom-breadcrumb text-sm">
            &nbsp;Rewards
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Reward View
        </li>
      </ol>
      <div className="card vh-100" style={{ border: "1px solid #dbd9d0" }}>
        <div className="d-flex px-4 justify-content-between align-items-center card_header p-1 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex">
              <div className="dot active"></div>
            </div>
            <span className="me-2 text-muted text-sm">View Reward</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/rewards">
              <button type="button" className="btn btn-sm btn-back">
                Back
              </button>
            </Link>
            &nbsp;&nbsp;
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
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Target Achieved</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.target_archieved}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Reward Type</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.reward_type.join(", ")}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Reward Value</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.reward_value}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 my-2">
              <div className="row">
                <div className="col-6">
                  <p className="fw-medium text-sm">Description</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm text-break">
                    : {data.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 my-2">
              <div className="row">
                <div className="col-3">
                  <p className="fw-medium text-sm">Image</p>
                </div>
                <div className="col-3">
                  <img
                    src={data.image ? URL.createObjectURL(data.image) : ""}
                    alt="Reward"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RewardView;
