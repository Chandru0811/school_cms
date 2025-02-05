import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";

function SubscriptionAdd() {
  const validationSchema = Yup.object({
    name: Yup.string().required("*Name is a required field"),
    description: Yup.string()
      .notRequired()
      .max(250, "*The maximum length is 250 characters"),
    details: Yup.object().shape({
      start_date: Yup.string().required("*Start Date is a required field"),
      end_date: Yup.string().required("*End Date is a required field"),
    }),
    price: Yup.string().required("*Price is a required field"),
    duration: Yup.string().required("*Duration is a required field"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      details: {
        start_date: "",
        end_date: "",
      },
      price: "",
      duration: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async () => {},
    validateOnChange: false,
    validateOnBlur: true,
  });

  console.log(formik.values);

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-3 px-2"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/subscriptions" className="custom-breadcrumb">
            &nbsp;Subscriptions
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Subscriptions Add
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <div className="card">
          <div className="d-flex justify-content-between align-items-center card_header p-1 mb-4 px-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted">Add Subscriptions</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/subscriptions">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button type="submit" className="btn btn-button">
                Save
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("name")}
                  value={formik.values.name} 
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Price<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.price && formik.errors.price
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("price")}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="invalid-feedback">{formik.errors.price}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Start Date<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    formik.touched.details?.start_date &&
                    formik.errors.details?.start_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("details.start_date")}
                  value={formik.values.details.start_date}
                />
                {formik.touched.details?.start_date &&
                  formik.errors.details?.start_date && (
                    <div className="invalid-feedback">
                      {formik.errors.details?.start_date}
                    </div>
                  )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  End Date<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    formik.touched.details?.end_date &&
                    formik.errors.details?.end_date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("details.end_date")}
                  value={formik.values.details.end_date}
                />
                {formik.touched.details?.end_date &&
                  formik.errors.details?.end_date && (
                    <div className="invalid-feedback">
                      {formik.errors.details?.end_date}
                    </div>
                  )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Duration<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.duration && formik.errors.duration
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("duration")}
                  value={formik.values.duration}
                />
                {formik.touched.duration && formik.errors.duration && (
                  <div className="invalid-feedback">
                    {formik.errors.duration}
                  </div>
                )}
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-control ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("description")}
                  maxLength={250}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">
                    {formik.errors.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SubscriptionAdd;
