import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import { MultiSelect } from "react-multi-select-component";

function GradeEdit({ show, setShow }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const serviceOption = [
    { value: "1", label: "SRDK" },
    { value: "2", label: "KVM" },
    { value: "3", label: "KCS" },
    { value: "4", label: "PAK" },
  ];
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
    center_id: yup.string().required("*Select a center name"),
    name: yup.string().required("*Name is required"),
    description: yup.string().required("*Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: "",
      name: "Demo Grade",
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
        <DialogTitle>Edit Grade</DialogTitle>
        <hr className="m-0"></hr>
        <DialogContent>
          <div className="row">
            <div className="col-md-6 col-12 mb-4">
              <label className="form-label">
                Centre Name<span className="text-danger">*</span>
              </label>
              <MultiSelect
                options={serviceOption}
                value={selectedServices}
                onChange={(selected) => {
                  setSelectedServices(selected);
                  formik.setFieldValue(
                    "center_id",
                    selected.map((option) => option.value)
                  );
                }}
                labelledBy="Select Service"
                className={`form-multi-select form-multi-select-sm ${
                  formik.touched.center_id && formik.errors.center_id
                    ? "is-invalid"
                    : ""
                }`}
              />
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
                  formik.touched.name && formik.errors.name ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
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
                <div className="invalid-feedback">
                  {formik.errors.description}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <hr className="m-0"></hr>
        <DialogActions className="mt-3">
          <button className="btn btn-sm btn-back" onClick={handleClose}>
            Cancel
          </button>
          <button
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
            Update
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
GradeEdit.propTypes = {
  show: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default GradeEdit;
