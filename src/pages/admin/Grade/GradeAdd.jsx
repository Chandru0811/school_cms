import { useState } from "react";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

function GradeAdd() {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const validationSchema = yup.object().shape({
    schoolName: yup.string().required("*School Name is required"),
    location: yup.string().required("*Location is required"),
  });

  const formik = useFormik({
    initialValues: {
      schoolName: "",
      location: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form values:", values);
    },
  });

  return (
    <>
      <button
        className="btn btn-primary" onClick={handleShow}>
        Add Classroom
      </button>

      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <DialogTitle>
            <p className="headColor">Add School</p>
          </DialogTitle>
          <hr className="m-0"></hr>
          <DialogContent>
            <div className="row">
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  School Name<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.schoolName && formik.errors.schoolName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("schoolName")}
                >
                  <option value="">Select School</option>
                  <option value="School A">School A</option>
                  <option value="School B">School B</option>
                  <option value="School C">School C</option>
                </select>
                {formik.touched.schoolName && formik.errors.schoolName && (
                  <div className="invalid-feedback">
                    {formik.errors.schoolName}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Location<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.location && formik.errors.location
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("location")}
                />
                {formik.touched.location && formik.errors.location && (
                  <div className="invalid-feedback">{formik.errors.location}</div>
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
    </>
  );
}

export default GradeAdd;
