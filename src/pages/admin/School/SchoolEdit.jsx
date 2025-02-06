import { useState, } from "react";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import { useFormik } from "formik";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";

function SchoolEdit({ show, setShow,}) {
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
    schoolName: yup.string().required("*Selected a school name"),
    location: yup.string().required("*Location is required"),
  });

  const formik = useFormik({
    initialValues: {
      schoolName:  "School B",
      location: "MINT",
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
        <DialogTitle>Edit School</DialogTitle>
        <hr className="m-0"></hr>
        <DialogContent>
          <div className="row">
          <div className="col-md-6 col-12 mb-3">
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
                  <option value="School C" selected>School C</option>
                </select>
                {formik.touched.schoolName && formik.errors.schoolName && (
                  <div className="invalid-feedback">
                    {formik.errors.schoolName}
                  </div>
                )}
              </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
                Location<span className="text-danger">*</span>
              </label>
              <input
                type="text"
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
            className="btn btn-sm btn-back bg-light text-dark"
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

export default SchoolEdit;
