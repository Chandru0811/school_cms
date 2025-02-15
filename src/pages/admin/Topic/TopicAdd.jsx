import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { MultiSelect } from "react-multi-select-component";
import api from "../../../config/URL";
import toast from "react-hot-toast";

function TopicAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const navigate = useNavigate();
  const [centerList, setCenterList] = useState([]);

  const validationSchema = yup.object().shape({
    center_id: yup
             .array()
             .min(1, "*Select at least one center")
             .required("*Select a center id"),
    grade: yup.string().required("*Select a grade"),
    subject_id: yup.string().required("*Select a subject"),
    name: yup.string().required("*Name is required"),
    description: yup.string().required("*Description is required"),
  });

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      center_id: [],
      // grade: "",
      subject_id: "",
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("admin/topic", values);
        console.log(response.status)

        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          formik.resetForm();
          navigate("/subject");
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

  const getSubjectList = async () => {
    try {
      const response = await api.get("subject/list");
      const formattedSubject = response.data.data.map((subject) => ({
        value: subject.id,
        label: subject.name,
      }));

      getSubjectList(formattedSubject);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  useEffect(() => {
    getCenterList();
    getSubjectList();
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-button btn-sm me-2"
        style={{ fontWeight: "600px !important" }}
        onClick={handleShow}
      >
        &nbsp; Add &nbsp;&nbsp; <i className="bi bi-plus-lg"></i>
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
              {/* <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Grade<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${
                    formik.touched.grade && formik.errors.grade
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("grade")}
                >
                  <option value=""></option>
                  <option value="1"> 1</option>
                  <option value="2"> 2</option>
                  <option value="3"> 3</option>
                </select>
                {formik.touched.grade && formik.errors.grade && (
                  <div className="invalid-feedback">{formik.errors.grade}</div>
                )}
              </div> */}
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
                  value={formik.values.subject_id} // Ensure it's bound to formik values
                  onChange={(e) =>
                    formik.setFieldValue("subject_id", e.target.value)
                  }
                >
                  <option value="">Select Subject</option>
                  {roles.map((subject) => (
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
                <label className="form-label">
                  Description<span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${
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
              Submit
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
