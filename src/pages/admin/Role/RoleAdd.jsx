import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { MultiSelect } from "react-multi-select-component";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function RoleAdd({onSuccess}) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const navigate = useNavigate();
  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const [centerList, setCenterList] = useState([]);

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    name: yup.string().required("*Name is required"),
    description: yup.string().required("*Description is required"),
    access: yup.string().required("*Select a access"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      name: "",
      description: "",
      access: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("admin/role", values);
        console.log(response.status)

        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
          formik.resetForm();
          navigate("/settings");
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

  useEffect(() => {
    getCenterList();
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-button btn-sm me-2 m-3"
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
          <DialogTitle>
            <p className="headColor">Add Role</p>
          </DialogTitle>
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
                  type="text"
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`form-control form-control-sm ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                  rows={4}
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">
                    {formik.errors.description}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Access<span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      name="access"
                      value="Full Access"
                      className="form-check-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.access === "Full Access"}
                    />
                    <label className="form-check-label">Full Accesss</label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      name="access"
                      value="Minimal Access"
                      className="form-check-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.access === "Minimal Access"}
                    />
                    <label className="form-check-label">Minimal Access</label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      name="access"
                      value="Limited Access"
                      className="form-check-input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.access === "Limited Access"}
                    />
                    <label className="form-check-label">Limited Access</label>
                  </div>
                </div>

                {formik.touched.access && formik.errors.access && (
                  <div className="invalid-feedback d-block">
                    {formik.errors.access}
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

RoleAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default RoleAdd;
