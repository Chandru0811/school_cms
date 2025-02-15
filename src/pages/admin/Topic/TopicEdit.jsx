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

function TopicEdit({ id, show, setShow, onSuccess }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    // grade: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Selected a subject"),
    name: yup.string().required("*Name is required"),
    description: yup.string().required("*Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      // grade: "",
      subject_id: "",
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`topic/update/${id}`, values);
        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          navigate("/topic");
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

  const getTopicData = async () => {
    try {
      const response = await api.get(`topic/${id}`);
      const { data } = response.data;
      const centerIds = JSON.parse(data.center_id);
      await getCenterList();

      const selectedCenters = centerList.filter((center) =>
        centerIds.includes(center.value)
      );

      setSelectedCenter(selectedCenters);
      formik.setValues({
        center_id: centerIds,
        // grade: data.grade || "",
        subject_id: data.subject_id || "",
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
  

  const getSubjectList = async () => {
    try {
      const response = await api.get("subjects/list");
      const formattedSubject = response.data.data.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }));
      setSubjects(formattedSubject);
    } catch (e) {
      toast.error(
        `Error Fetching Data: ${e?.response?.data?.error || e.message}`
      );
    }
  };

  useEffect(() => {
    if (show) {
      getTopicData();
      getCenterList();
      getSubjectList();
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
        <DialogTitle>Edit Topic</DialogTitle>
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
                {subjects?.map((subject) => (
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

TopicEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default TopicEdit;
