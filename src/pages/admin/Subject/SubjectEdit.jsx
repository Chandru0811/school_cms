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

function SubjectEdit({ show, setShow,id,onSuccess }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);


  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const validationSchema = yup.object().shape({
   center_id: yup
            .array()
            .min(1, "*Select at least one center")
            .required("*Select a center id"),
    grade_id: yup.string().required("*Select a grade"),
    name: yup.string().required("*Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      centre_id: [],
      grade_id: "",
      name: "",
      description: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`admin/subject/update/${id}`, values);

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

  const getSubjectData = async () => {
    try {
      const response = await api.get(`admin/subject/${id}`);
      const { data } = response.data;

      const parsedCenterIds = JSON.parse(data.center_id);
      const parsedCenterNames = JSON.parse(data.center_names);

      const selectedCenters = parsedCenterIds.map((id, index) => ({
        value: id,
        label: parsedCenterNames[index] || "",
      }));

      setSelectedCenter(selectedCenters);

      formik.setValues({
        ...data,
        center_id: selectedCenters.map((center) => center.value),
      });
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
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
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  const getGradeList = async () => {
    try {
      const response = await api.get("grade/list");
      const formattedGrades = response.data.data.map((grade) => ({
        value: grade.id,
        label: grade.name,
      }));

      getGradeList(formattedGrades);
    } catch (e) {
      toast.error("Error Fetching Data ", e?.response?.data?.error);
    }
  };

  useEffect(() => {
    if (show) {
      getSubjectData();
      getCenterList();
      getGradeList();
    }
  }, [id, show]);

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
        <DialogTitle>Edit Subject</DialogTitle>
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
                  value={formik.values.grade_id} // Ensure it's bound to formik values
                  onChange={(e) =>
                    formik.setFieldValue("grade_id", e.target.value)
                  }
                >
                  <option value="">Select Grade</option>
                  {roles.map((grade) => (
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
                Description
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
  );
}

SubjectEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default SubjectEdit;
