import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";

function SubjectEdit({ id, show, setShow, onSuccess }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    grade_id: yup.string().required("*Selected a grade"),
    name: yup.string().required("*Name is required"),
    description: yup.string().required("*Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      grade_id: "",
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`subject/update/${id}`, values);
        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          navigate("/subject");
        }
      } catch (e) {
        toast.error(
          `Error Fetching Data: ${e?.response?.data?.error || e.message}`
        );
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getSubjectData = async () => {
    try {
      const response = await api.get(`subject/${id}`);
      const { data } = response.data;

      const parsedCenterIds = JSON.parse(data.center_id);
      const parsedCenterNames = JSON.parse(data.center_names);
      const selectedCenters = parsedCenterIds.map((id, index) => ({
        value: id,
        label: parsedCenterNames[index] || "",
      }));

      setSelectedCenter(selectedCenters);

      formik.setValues({
        center_id: selectedCenters.map((center) => center.value),
        grade_id: data.grade_id || "",
        name: data.name || "",
        description: data.description || "",
      });
    } catch (e) {
      toast.error(
        `Error Fetching Data: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  const getCenterList = async () => {
    try {
      const response = await api.get("centers/list");
      const formattedCenters = response.data.data.map((center) => ({
        value: center.id,
        label: center.name,
      }));
      setCenterList(formattedCenters);
    } catch (e) {
      toast.error(`Error Fetching Data: ${e?.response?.data?.error || e.message}`);
    }
  };
  
  const getGradeList = async () => {
    try {
      const response = await api.get("grades/list");
      const formattedGrade = response.data.data.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));
      setGrades(formattedGrade);
    } catch (e) {
      toast.error(
        `Error Fetching Data: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  useEffect(() => {
    if (show) {
      getSubjectData();
      getCenterList();
      getGradeList();
    }
  }, [id, show]);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle>Edit Subject</DialogTitle>
        <hr className="m-0" />
        <DialogContent>
          <div className="row">
            <div className="col-md-6 col-12 mb-4">
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
                }}
                labelledBy="Select Center"
                className={
                  formik.touched.center_id && formik.errors.center_id
                    ? "is-invalid"
                    : ""
                }
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
                <option value="">Select Grade</option>
                {grades?.map((grade) => (
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
                className={`form-control ${
                  formik.touched.description && formik.errors.description
                    ? "is-invalid"
                    : ""
                }`}
                rows="4"
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
        <hr className="m-0" />
        <DialogActions className="mt-3">
          <button
            className="btn btn-sm btn-back"
            onClick={handleClose}
            type="button"
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
            Update
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

SubjectEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default SubjectEdit;
