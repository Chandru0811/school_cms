import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { MultiSelect } from "react-multi-select-component";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
function AddTopic({ id, show, setShow }) {
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);

  const handleClose = () => setShow(false);
  // Formik configuration
  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
      subject_id: "",
      name: "",
    },
    validationSchema: yup.object().shape({
      center_id: yup.array().min(1, "*Select at least one center").required(),
      grade_id: yup.string().required("*Select a grade"),
      subject_id: yup.string().required("*Select a subject"),
      name: yup.string().required("*Topic Name is required"),
    }),
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("topic", values);
        if (response.status === 201) {
          toast.success("Topic added successfully!");
          navigate("/topics");
        }
      } catch (e) {
        toast.error(`Error: ${e?.response?.data?.error || e.message}`);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  // Fetch centers
  useEffect(() => {
    const getCenterList = async () => {
      try {
        const response = await api.get("centers/list");
        setCenterList(
          response.data.data.map((center) => ({
            value: center.id,
            label: center.name,
          }))
        );
      } catch (e) {
        toast.error(`Error Fetching Centers: ${e.message}`);
      }
    };
    getCenterList();
  }, [id, show]);

  // Fetch grades based on selected centers
  useEffect(() => {
    const getGradeList = async () => {
      if (selectedCenter.length === 0) return;

      try {
        const centerIds = selectedCenter
          .map((c) => `center_id[]=${c.value}`)
          .join("&");
        const response = await api.get(`filter/grades?${centerIds}`);
        setGrades(
          response.data?.data?.map((grade) => ({
            value: grade.id,
            label: grade.name,
          }))
        );
      } catch (e) {
        toast.error(`Error Fetching Grades: ${e.message}`);
      }
    };
    getGradeList();
  }, [selectedCenter]);

  // Fetch subjects based on selected grade
  useEffect(() => {
    const getSubjectList = async () => {
      if (!formik.values.grade_id) return;

      try {
        const response = await api.get(
          `filter/subjects?grade_id=${formik.values.grade_id}`
        );
        setSubjects(
          response.data?.data?.map((subject) => ({
            value: subject.id,
            label: subject.name,
          }))
        );
      } catch (e) {
        toast.error(`Error Fetching Subjects: ${e.message}`);
      }
    };
    getSubjectList();
  }, [formik.values.grade_id]);

  return (
    <>
      <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Add Topic</DialogTitle>
          <hr className="m-0"></hr>
          <DialogContent>
            <div className="row">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Centre Name<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={centerList}
                  value={selectedCenter}
                  onChange={(selected) => {
                    setSelectedCenter(selected);
                    formik.setFieldValue(
                      "center_id",
                      selected.map((option) => option.value)
                    );
                    if (selected.length === 0) {
                      setGrades([]);
                      setSubjects([]);
                      formik.setFieldValue("grade_id", "");
                      formik.setFieldValue("subject_id", "");
                    }
                  }}
                  labelledBy="Select Center"
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
                  Grade<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.grade_id && formik.errors.grade_id
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.grade_id}
                  onChange={(e) =>
                    formik.setFieldValue("grade_id", e.target.value)
                  }
                >
                  <option value="">Select grade</option>
                  {grades.map((grade) => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
                {formik.touched.grade_id && formik.errors.grade_id && (
                  <div className="invalid-feedback">
                    {formik.errors.grade_id}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Subject<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.subject_id && formik.errors.subject_id
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.subject_id}
                  onChange={(e) =>
                    formik.setFieldValue("subject_id", e.target.value)
                  }
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
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
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-control ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                  rows="3"
                  {...formik.getFieldProps("description")}
                />
              </div>
            </div>
          </DialogContent>
          <hr className="m-0"></hr>
          <DialogActions className="mt-3">
            <button
              type="button"
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
              Save
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
// AddTopic.propTypes = {
//   show: PropTypes.bool.isRequired,
//   setShow: PropTypes.func.isRequired,
//   id: PropTypes.number.isRequired,
//   onSuccess: PropTypes.func.isRequired,
// };

AddTopic.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  id: PropTypes.number, // Ensure correct prop name
  onSuccess: PropTypes.func.isRequired,
};

export default AddTopic;
