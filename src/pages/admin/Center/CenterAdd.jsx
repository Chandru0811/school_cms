import { useFormik } from "formik";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import * as yup from "yup";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { MdKeyboardArrowLeft } from "react-icons/md";

function CenterAdd({ onSuccess }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  // const [loadingAdd, setLoadingAdd] = useState(false);

  // const handleShowWithLoading = () => {
  //   setLoadingAdd(true);
  //   setTimeout(() => {
  //     handleShow();
  //     setLoadingAdd(false);
  //   }, 1500);
  // };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, "*Name must not exceed 255 characters")
      .required("*Name is required"),

    location: yup
      .string()
      .max(255, "*Location must not exceed 255 characters")
      .required("*Location is required"),
  });

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("center", values);
        if (response.status === 200) {
          toast.success(response.data.message);
          if (onSuccess) onSuccess();
          if (handleClose) handleClose();
          formik.resetForm();
          navigate("/centre");
        } else {
          toast.error(response.data.message || "An unexpected error occurred.");
        }
      } catch (e) {
        console.error("Error Fetching Data:", e);
        toast.error(e?.response?.data?.error || "Error Fetching Data");
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  return (
    <>
      <div className="d-flex justify-content-end me-2">
        <button
          type="button"
          className="btn add-btn btn-sm d-flex align-items-center"
          onClick={handleShow}
        >
          <FaPlus fontSize={12} className="me-1" /> Add Centre
        </button>
      </div>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton className="justify-content-start gap-2">
          <div>
            <button type="button " className="btn btn-sm add-btn" onClick={handleClose}>
              <MdKeyboardArrowLeft size={20} />
            </button>
            &nbsp;&nbsp;
          </div>
          <Modal.Title>Centre Add</Modal.Title>
          <div className="d-flex gap-3 ms-auto">
            {/* <Button className="btn btn-secondary btn-sm " onClick={handleClose}>
              Close
            </Button> */}
            <Button
              className="btn add-btn"
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
              <FiSave className="trash-icon" />
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="container">
              <div className="row">
                <div className="col-12 mb-4 px-0">
                  <label className="form-label mb-0" htmlFor="name">
                    Name
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    placeholder="Enter Text"
                    aria-label="Default select example"
                    className={`form-control ${
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
                <div className="col-12 mb-4 px-0">
                  <label className="form-label mb-0" htmlFor="location">
                    Location
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Enter Text"
                    className={`form-control ${
                      formik.touched.location && formik.errors.location
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("location")}
                    maxLength={825}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <div className="invalid-feedback">
                      {formik.errors.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

CenterAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default CenterAdd;
