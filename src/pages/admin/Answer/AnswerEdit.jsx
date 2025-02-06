import { useState, } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import PropTypes from "prop-types";

function AnswerEdit({ show, setShow,}) {
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
    question_id: yup.string().required("*Selected a question id"),
    answer_type: yup.string().required("*Selected a answer type"),
    answer: yup.string().required("*Answer is required"),
  });

  const formik = useFormik({
    initialValues: {
      question_id:"1",
      answer_type:  "3",
      answer: "Dummy Answer",
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
        <DialogTitle>Edit Answer</DialogTitle>
        <hr className="m-0"></hr>
        <DialogContent>
          <div className="row">
            <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Question ID<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.question_id && formik.errors.question_id
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("question_id")}
                >
                  <option value="">Select a Question ID</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3" selected>3</option>
                </select>
                {formik.touched.question_id && formik.errors.question_id && (
                  <div className="invalid-feedback">
                    {formik.errors.question_id}
                  </div>
                )}
            </div>
            <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Answer Type<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.answer_type && formik.errors.answer_type
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("answer_type")}
                >
                  <option value="">Select a Answer Type</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                {formik.touched.answer_type && formik.errors.answer_type && (
                  <div className="invalid-feedback">
                    {formik.errors.answer_type}
                  </div>
                )}
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="form-label">
              Answer<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${
                  formik.touched.answer && formik.errors.answer
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("answer")}
              />
              {formik.touched.answer && formik.errors.answer && (
                <div className="invalid-feedback">
                  {formik.errors.answer}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <hr className="m-0"></hr>
        <DialogActions className="mt-3">
          <button
            className="btn btn-sm btn-back"
            onClick={handleClose}
          >
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
            Submit
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AnswerEdit.propTypes = {
  show: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default AnswerEdit;
