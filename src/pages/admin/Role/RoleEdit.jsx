import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { MultiSelect } from "react-multi-select-component";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { Button, Modal } from "react-bootstrap";
import { BsFillInfoCircleFill } from "react-icons/bs";
``;
function RoleEdit({ id, onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };
  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const validationSchema = yup.object().shape({
    center_id: yup
      .array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    name: yup
      .string()
      .max(255, "*Name must not exceed 255 characters")
      .required("*Name is required"),
    access: yup
      .string()
      .max(255, "*Access must not exceed 255 characters")
      .required("*Select a access"),
  });

  const formik = useFormik({
    initialValues: {
      center_id: "",
      name: "",
      description: "",
      access: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`admin/role/update/${id}`, values);

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

  const getRoleData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`admin/role/${id}`);
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
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (show) {
      getRoleData();
      getCenterList();
    }
  }, [id, show]);

  return (
    <>
      <button
        type="button"
        className="d-flex align-items-center"
        onClick={handleShow}
      >
        <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
      </button>
      <Modal show={show} onHide={handleClose} size="lg">
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <Modal.Header>
            <Modal.Title>Role Edit</Modal.Title>
            <div className="d-flex gap-3">
              <Button
                className="btn btn-secondary btn-sm py-0"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                className="btn add-btn button-spinner"
                type="submit"
                disabled={loadIndicator}
                onClick={formik.handleSubmit}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                <small>Update</small>
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "500px" }}
              >
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
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
                    }}
                    labelledBy="Select Service"
                    className={`form-multi-select form-multi-select-sm border-1 rounded-1 ${
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
                  <label className="form-label">Description</label>
                  <textarea
                    type="text"
                    onKeyDown={(e) => e.stopPropagation()}
                    className={`form-control form-control-sm
                  }`}
                    rows={4}
                    {...formik.getFieldProps("description")}
                  />
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
                  <div className="row m-0">
                    <div className="col-12">
                      {formik.values.access && (
                        <>
                          <small className="text-muted">
                            <BsFillInfoCircleFill
                              style={{ marginBottom: "2px" }}
                            />{" "}
                            {formik.values.access === "Full Access"
                              ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi culpa, debitis accusantium cupiditate."
                              : formik.values.access === "Minimal Access"
                              ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi culpa, debitis accusantium cupiditate."
                              : formik.values.access === "Limited Access"
                              ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi culpa, debitis accusantium cupiditate."
                              : null}
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

RoleEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default RoleEdit;
