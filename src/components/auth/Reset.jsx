import { Link } from "react-router-dom";
import headerlogo from "../../assets/images/logo.webp";

function Reset() {
  return (
    <section
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ backgroundColor: "#f2f2f2", minHeight: "100vh" }}
  >
    <div
      className="d-flex justify-content-center align-items-center mb-3"
      style={{ backgroundColor: "rgb(242, 242, 242)" }}
    >
      <img src={headerlogo} className="img-fluid" alt="img" />
    </div>
    <h2
      className="d-flex justify-content-center mb-5"
      style={{ color: "#1555ff" }}
    >
      School CMS
    </h2>
    <div className="wizard-container p-5 text-center">
      <h2 className="p-3">Password Reset Link Sent</h2>
      <p className="p-1">
        We’ve sent a password reset link to your registered email address.
        Please check your inbox and follow the instructions to reset your
        password.
      </p>
      <p className="p-1">
        If you don’t receive the email within a few minutes, please check your
        spam folder or request another reset link.
      </p>
      <div className="button-group mt-4">
        <Link to={`/`}>
          <button className="wellcome-btn" style={{ width: "250px" }}>
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  </section>
  )
}

export default Reset