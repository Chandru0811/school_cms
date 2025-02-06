import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";

function RewardAdd() {
  const validationSchema = Yup.object({
    name: Yup.string().required("*Name is a required field"),
    reward_type: Yup.array().min(1, "*At least one reward type is required"),
    reward_value: Yup.string().required("*Reward Value is a required field"),
    target_archieved: Yup.string().required("*Target Achieved is a required field"),
    description: Yup.string()
      .notRequired()
      .max(250, "*The maximum length is 250 characters"),
    image: Yup.mixed().required("*Image is a required field"),
  });

  const formik = useFormik({
    initialValues: {
      target_archieved: "",
      name: "",
      description: "",
      reward_type: [],
      reward_value: "",
      image: null,
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
          <Link to="/rewards" className="custom-breadcrumb">
            &nbsp;Rewards
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Reward Add
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
              <span className="me-2 text-muted">Add Rewards</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/rewards">
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
                <label className="form-label">Name<span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`} {...formik.getFieldProps("name")} />
                {formik.touched.name && formik.errors.name && <div className="invalid-feedback">{formik.errors.name}</div>}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Reward Value<span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${formik.touched.reward_value && formik.errors.reward_value ? "is-invalid" : ""}`} {...formik.getFieldProps("reward_value")} />
                {formik.touched.reward_value && formik.errors.reward_value && <div className="invalid-feedback">{formik.errors.reward_value}</div>}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Image<span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files[0]);
                  }}
                />
                {formik.errors.image && <div className="invalid-feedback">{formik.errors.image}</div>}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Reward Type<span className="text-danger">*</span>
                </label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="cash"
                    value="cash"
                    checked={formik.values.reward_type.includes("cash")}
                    onChange={formik.handleChange}
                    name="reward_type"
                  />
                  <label className="form-check-label" htmlFor="cash">Cash</label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="voucher"
                    value="voucher"
                    checked={formik.values.reward_type.includes("voucher")}
                    onChange={formik.handleChange}
                    name="reward_type"
                  />
                  <label className="form-check-label" htmlFor="voucher">Voucher</label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="gift"
                    value="gift"
                    checked={formik.values.reward_type.includes("gift")}
                    onChange={formik.handleChange}
                    name="reward_type"
                  />
                  <label className="form-check-label" htmlFor="gift">Gift</label>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Target Achieved</label>
                <div className="d-flex gap-2">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="target_false"
                    value="0"
                    checked={formik.values.target_archieved === "0"}
                    onChange={formik.handleChange}
                    name="target_archieved"
                  />
                  <label className="form-check-label" htmlFor="target_false">False</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="target_true"
                    value="1"
                    checked={formik.values.target_archieved === "1"}
                    onChange={formik.handleChange}
                    name="target_archieved"
                  />
                  <label className="form-check-label" htmlFor="target_true">True</label>
                </div>
                </div>
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea rows={5} className={`form-control ${formik.touched.description && formik.errors.description ? "is-invalid" : ""}`} {...formik.getFieldProps("description")} maxLength={250} />
                {formik.touched.description && formik.errors.description && <div className="invalid-feedback">{formik.errors.description}</div>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RewardAdd;
