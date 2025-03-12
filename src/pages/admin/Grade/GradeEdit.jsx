import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { MultiSelect } from "react-multi-select-component";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import { Button, Modal } from "react-bootstrap";

function GradeEdit({ id, onSuccess }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const [open, setOpen] = useState(false);

  const handleShow = async () => {
    setOpen(true);
    setLoading(true);
    formik.resetForm();
    await getGradeData();
    getCenterList();
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
    formik.resetForm(); // Reset the form
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
  });

  const formik = useFormik({
    initialValues: {
      center_id: [],
      name: "",
      description: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const { created_by, updated_by, ...filteredValues } = values;
        const response = await api.put(`grade/update/${id}`, filteredValues);
        if (response.status === 200) {
          toast.success(response.data.message);
          setOpen(false);
          onSuccess();
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

  const getGradeData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`grade/${id}`);
      const { data } = response.data;

      const parsedCenterIds = JSON.parse(data.center_id);
      const parsedCenterNames = JSON.parse(data.center_names);

      const selectedCenters = parsedCenterIds.map((id, index) => ({
        value: id,
        label: parsedCenterNames[index] || "",
      }));

      setSelectedCenter(selectedCenters);
      const { created_by, updated_by, ...filteredData } = data;
      formik.setValues({
        ...filteredData,
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

  return (
    <>
      <button
        type="button"
        className="d-flex align-items-center"
        onClick={handleShow}
      >
        <TbEdit style={{ color: "#4F46E5", fontSize: "16px" }} />
      </button>

      <Modal show={open} onHide={handleClose} size="lg">
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <Modal.Header>
            <Modal.Title>Grade Edit</Modal.Title>
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
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Centre Name</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
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
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-4">
                    <div className="col-5 d-flex">
                      <p className="view-label-text">Name</p>{" "}
                      <span className="text-danger">*</span>
                    </div>
                    <div className="col-7">
                      <input
                        type="text"
                        placeholder="Enter Text"
                        onKeyDown={(e) => e.stopPropagation()}
                        className={`form-control form-control-sm ${
                          formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row mb-4">
                    <div className="col-2">
                      <p className="view-label-text">Description</p>
                    </div>
                    <div className="col-10">
                      <textarea
                        placeholder="Enter Text"
                        className={`form-control form-control-sm ${
                          formik.touched.description &&
                          formik.errors.description
                            ? "is-invalid"
                            : ""
                        }`}
                        rows="4"
                        {...formik.getFieldProps("description")}
                      />
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
GradeEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default GradeEdit;
