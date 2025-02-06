import { useState, } from "react";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import { useFormik } from "formik";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";

function RoleEdit({ show, setShow,}) {
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
    school_id: yup.string().required("*Selected a school id"),
    center_id: yup.string().required("*Selected a center id"),
    name: yup.string().required("*Name is required"),
    description: yup.string().required("*Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      school_id:"School C",
      center_id:"Center A",
      name:  "DEMO Roll",
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
        <DialogTitle>Edit School</DialogTitle>
        <hr className="m-0"></hr>
        <DialogContent>
          <div className="row">
            <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  School ID<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.school_id && formik.errors.school_id
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("school_id")}
                >
                  <option value="">Select School</option>
                  <option value="School A">School A</option>
                  <option value="School B">School B</option>
                  <option value="School C" selected>School C</option>
                </select>
                {formik.touched.school_id && formik.errors.school_id && (
                  <div className="invalid-feedback">
                    {formik.errors.school_id}
                  </div>
                )}
            </div>
            <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Center ID<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.center_id && formik.errors.center_id
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("center_id")}
                >
                  <option value="">Select School</option>
                  <option value="Center A" selected>Center A</option>
                  <option value="Center B">Center B</option>
                  <option value="Center C">Center C</option>
                </select>
                {formik.touched.center_id && formik.errors.center_id && (
                  <div className="invalid-feedback">
                    {formik.errors.center_id}
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
            className="btn btn-sm btn-back"
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

export default RoleEdit;
