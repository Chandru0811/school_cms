import { useState, } from "react";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import { useFormik } from "formik";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";

function TopicEdit({ show, setShow,}) {
  const [loadIndicator, setLoadIndicator] = useState(false);
//   const [selectedSchool, setSelectedSchool] = useState(null);

  // Find the selected school data when modal opens
//   useEffect(() => {
//     if (selectedId) {
//       const school = data.find((item) => item.id === selectedId);
//       setSelectedSchool(school || {});
//     }
//   }, [selectedId, data]);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const validationSchema = yup.object().shape({
    subject_id: yup.string().required("*Selected a subject id"),
    name: yup.string().required("*Name is required"),
    description: yup.string().required("*Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      subject_id:"3",
      name:  "Demo Subject",
      description: "MINT",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form values:", values);
      setTimeout(() => {
        setLoadIndicator(false);
        setShow(false);
      }, 1000);
    },
  });

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle>Edit Topic</DialogTitle>
        <hr className="m-0"></hr>
        <DialogContent>
          <div className="row">
            <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Subject ID<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.subject_id && formik.errors.subject_id
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("subject_id")}
                >
                  <option value="">Select Subject ID</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3" selected>3</option>
                </select>
                {formik.touched.subject_id && formik.errors.subject_id && (
                  <div className="invalid-feedback">
                    {formik.errors.subject_id}
                  </div>
                )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
                Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${
                  formik.touched.name && formik.errors.name
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">
                  {formik.errors.name}
                </div>
              )}
            </div>
            <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Description<span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control form-control-sm ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                  rows="4" // Adjust the rows for better visibility
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">{formik.errors.description}</div>
                )}
              </div>
          </div>
        </DialogContent>
        <hr className="m-0"></hr>
        <DialogActions className="mt-3">
          <Button
            className="btn btn-sm btn-border bg-light text-dark"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn btn-button btn-sm"
            disabled={loadIndicator}
          >
            {loadIndicator && (
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
            )}
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TopicEdit;
