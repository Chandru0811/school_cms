import { useFormik } from "formik";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import * as yup from "yup";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function CenterAdd({ onSuccess }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const validationSchema = yup.object().shape({
    name: yup.string().required("*Name is required"),
    location: yup.string().required("*Location is required"),
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
          navigate("/center");
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
      <div className="d-flex justify-content-end mb-3 me-2">
        <button
          type="button"
          className="btn btn-button btn-sm"
          onClick={handleShow}
        >
          &nbsp; Add &nbsp;&nbsp; <i className="bx bx-plus"></i>
        </button>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Centre Add</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Name<span className="text-danger">*</span>
                  </label>
                  <input
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
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                  Location<span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={5}
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
        <Modal.Footer>
          <Button className="btn btn-secondary btn-sm" onClick={handleClose}>
            Close
          </Button>
          <Button
            className="btn btn-button"
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
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

CenterAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default CenterAdd;
