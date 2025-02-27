import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { MultiSelect } from "react-multi-select-component";
import api from "../../../config/URL";

function TopicAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const navigate = useNavigate();
  const [centerList, setCenterList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center"),
    // grade_id: yup.string().required("*Select a Grade"),
    subject_id: yup.string().required("*Select a Subject"),
    name: yup
      .string()
      .max(255, "*Topic Name must not exceed 255 characters")
      .required("*Topic Name is required"),
  });

  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setSelectedCenter([]);
  };

  const formik = useFormik({
    initialValues: {
      center_id: [],
      // grade_id: "",
      subject_id: "",
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("topic", values);
        console.log(response.status);

        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          formik.resetForm();
          navigate("/topic");
        }
      } catch (e) {
        toast.error("Error Fetching Data ", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      const formattedCenters = response.data.data.map((center) => ({
        value: center.id,
        label: center.name,
      }));

      setCenterList(formattedCenters);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  const getGradeList = async () => {
    try {
      if (selectedCenter.length === 0) {
        setGrades([]);
        formik.setFieldValue("grade_id", "");
        return;
      }

      const centerIds = selectedCenter.map(center => `center_id[]=${center.value}`).join("&");
      const response = await api.get(`filter/grades?${centerIds}`);

      const formattedGrades = response.data?.data?.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));

      setGrades(formattedGrades);

      // Reset grade & subject if current values are no longer valid
      if (!formattedGrades.some(g => g.value === formik.values.grade_id)) {
        formik.setFieldValue("grade_id", "");
        formik.setFieldValue("subject_id", "");
      }
    } catch (e) {
      toast.error(`Error Fetching Grades: ${e?.response?.data?.error || e.message}`);
    }
  };
  const getSubjectList = async () => {
    try {
      if (!formik.values.grade_id) {
        setSubjects([]);
        formik.setFieldValue("subject_id", "");
        return;
      }
      const response = await api.get(`filter/subjects?grade_id[]=${formik.values.grade_id}`);
      const formattedSubjects = response.data?.data?.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }));
      setSubjects(formattedSubjects);
      if (!formattedSubjects.some(s => s.value === formik.values.subject_id)) {
        formik.setFieldValue("subject_id", "");
      }
    } catch (e) {
      toast.error(`Error Fetching Subjects: ${e?.response?.data?.error || e.message}`);
    }
  };

  useEffect(() => {
    if (show) {
      getCenterList();
    }
  }, [show]);

  useEffect(() => {
    getGradeList();
  }, [selectedCenter]);

  useEffect(() => {
    getSubjectList();
  }, [formik.values.grade_id]);


  return (
    <>
      <button
        type="button"
        className="btn btn-button btn-sm d-flex align-items-center"
        onClick={handleShow}
      >
        Add
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
                  className={`form-multi-select form-multi-select-sm ${formik.touched.center_id && formik.errors.center_id ? "is-invalid" : ""
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
                  className={`form-select form-select-sm ${formik.touched.grade_id && formik.errors.grade_id
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
                  className={`form-select form-select-sm ${formik.touched.subject_id && formik.errors.subject_id
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
                  className={`form-control form-control-sm ${formik.touched.name && formik.errors.name
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
                  className={`form-control ${formik.touched.description && formik.errors.description
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

TopicAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default TopicAdd;
