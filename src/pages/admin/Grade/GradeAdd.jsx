import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { FiSave } from "react-icons/fi";
import { MdKeyboardArrowLeft } from "react-icons/md";

function GradeAdd({ onSuccess }) {
  const [selectedCenter, setSelectedCenter] = useState([]);
  const [centerList, setCenterList] = useState([]);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [isModified, setIsModified] = useState(false);

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

  const handleShow = () => {
    setShow(true);
    getCenterList();
    formik.resetForm();
    setIsModified(false);
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedCenter([]);
    setShow(false);
  };

  const formik = useFormik({
    initialValues: {
      center_id: [],
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("grade", values);
        console.log(response.status);

        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          formik.resetForm();
          handleClose();
          navigate("/grade");
        }
      } catch (e) {
        if (e.response?.data?.errors) {
          const errors = e.response.data.errors;
          Object.keys(errors).forEach((key) => {
            errors[key].forEach((errMsg) => {
              toast.error(errMsg);
            });
          });
        } else {
          toast.error(e.response?.data?.message || "Something went wrong!");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validate: (values) => {
      if (
        Object.values(values).some(
          (value) => typeof value === "string" && value.trim() !== ""
        )
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
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

  return (
    <>
      <button
        type="button"
        className="btn btn-sm d-flex align-items-center add-btn"
        onClick={handleShow}
      >
        <FaPlus fontSize={12} className="me-1" /> Add Grade
      </button>

      <Modal show={show} onHide={handleClose} size="md">
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <Modal.Header closeButton className="justify-content-start gap-2">
            <div>
              <button
                type="button "
                className="btn btn-sm add-btn"
                onClick={handleClose}
              >
                <MdKeyboardArrowLeft size={20} />
              </button>
              &nbsp;&nbsp;
            </div>
            <Modal.Title>Grade Add</Modal.Title>
            <div className="d-flex gap-3 ms-auto">
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
                <FiSave className="trash-icon" />
              </Button>
            </div>
          </Modal.Header>

          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="row mb-4">
                  <div className="col-12 d-flex">
                    <p className="view-label-text">Centre Name</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className=" col-12">
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
              <div className="col-12">
                <div className="row mb-4">
                  <div className="col-12 d-flex">
                    <p className="view-label-text">Name</p>{" "}
                    <span className="text-danger">*</span>
                  </div>
                  <div className=" col-12">
                    <input
                      type="text"
                      placeholder="Enter Name"
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`form-control  ${
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
                  <div className="col-12">
                    <p className="view-label-text mb-1">Description</p>
                  </div>
                  <div className=" col-12">
                    <textarea
                      placeholder="Enter Text"
                      className={`form-control  ${
                        formik.touched.description && formik.errors.description
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
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}
GradeAdd.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default GradeAdd;
