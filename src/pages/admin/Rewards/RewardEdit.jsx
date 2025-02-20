import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import api from "../../../config/URL";
import PropTypes from "prop-types";
import { MultiSelect } from "react-multi-select-component";
import ImageURL from "../../../config/ImageURL";

function RewardEdit() {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();
  const [centerList, setCenterList] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState([]);
  const { id } = useParams();

  const validationSchema = Yup.object({
    center_id: Yup.array()
      .min(1, "*Select at least one center")
      .required("*Select a center id"),
    name: Yup.string().required("*Name is a required field"),
    reward_type: Yup.string().required("*Reward Type is a required field"),
    reward_value: Yup.string().required("*Reward Value is a required field"),
    target_archieved: Yup.string().required(
      "*Target Achieved is a required field"
    ),
    description: Yup.string()
      .required()
      .max(250, "*The maximum length is 250 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      reward_type: "",
      reward_value: "",
      image: null,
      center_id: [],
      target_archieved: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);

      const formData = new FormData();
      const fieldsToConvert = ["center_id"];

      fieldsToConvert.forEach((field) => {
        if (Array.isArray(values[field])) {
          values[field].forEach((item) => {
            formData.append(`${field}[]`, item);
          });
        } else {
          formData.append(`${field}[]`, values[field]);
        }
      });

      formData.append("_method", "PUT"); // Required for Laravel
      formData.append("target_archieved", values.target_archieved);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("reward_type", values.reward_type);
      formData.append("reward_value", values.reward_value);

      // Ensure image is a file
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      try {
        const response = await api.post(`reward/update/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/rewards");
        }
      } catch (e) {
        if (e?.response?.data?.error) {
          Object.values(e.response.data.error).forEach((errorMessages) => {
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage);
            });
          });
        } else {
          toast.error("Error Fetching Data");
        }
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getData = async () => {
    try {
        const response = await api.get(`reward/${id}`);
        const { data } = response.data;

        // Ensure center_id and center_names are parsed correctly
        const parsedCenterIds = Array.isArray(data.center_id)
            ? data.center_id
            : JSON.parse(data.center_id || "[]");

        const parsedCenterNames = Array.isArray(data.center_names)
            ? data.center_names
            : JSON.parse(data.center_names || "[]");

        // Map parsed centers properly
        const selectedCenters = parsedCenterIds.map((id, index) => ({
            value: id,
            label: parsedCenterNames[index] || "",
        }));

        setSelectedCenter(selectedCenters);

        // Properly format the data for formik
        formik.setValues({
            center_id: selectedCenters.map((center) => center.value),
            name: data.name,
            description: data.description,
            reward_type: data.reward_type,
            reward_value: data.reward_value,
            target_archieved: String(data.target_archieved),
            image: data.image ? `${ImageURL}${data.image}` : "",
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch reward details.");
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
    getCenterList();
    getData();
  }, [id]);

  return (
    <div className="container-fluid px-0">
      <ol
        className="breadcrumb my-3 px-2 d-flex align-items-center"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb text-sm">
            Home
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li>
          <Link to="/rewards" className="custom-breadcrumb text-sm">
            &nbsp;Rewards
          </Link>
          <span className="breadcrumb-separator text-sm"> &gt; </span>
        </li>
        <li className="breadcrumb-item active text-sm" aria-current="page">
          &nbsp;Reward Edit
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <div className="card">
          <div className="d-flex justify-content-between align-items-center card_header p-1 mb-4 px-4">
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted text-sm">Add Rewards</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/rewards">
                <button type="button " className="btn btn-sm btn-back">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
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
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row py-4">
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
                  className={`form-multi-select form-multi-select-sm ${formik.touched.center_id && formik.errors.center_id
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
                  Reward Value<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.reward_value && formik.errors.reward_value
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("reward_value")}
                />
                {formik.touched.reward_value && formik.errors.reward_value && (
                  <div className="invalid-feedback">
                    {formik.errors.reward_value}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Image
                </label>
                <input
                  type="file"
                  className={`form-control form-control-sm ${
                    formik.touched.image && formik.errors.image
                      ? "is-invalid"
                      : ""
                  }`}
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("image", file || null);
                  }}
                />
                {formik.touched.image && formik.errors.image && (
                  <div className="invalid-feedback">{formik.errors.image}</div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Reward Type<span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="cash"
                      value="cash"
                      checked={formik.values.reward_type === "cash"}
                      onChange={(e) =>
                        formik.setFieldValue("reward_type", e.target.value)
                      }
                      name="reward_type"
                    />
                    <label className="form-check-label" htmlFor="cash">
                      Cash
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="voucher"
                      value="voucher"
                      checked={formik.values.reward_type === "voucher"}
                      onChange={(e) =>
                        formik.setFieldValue("reward_type", e.target.value)
                      }
                      name="reward_type"
                    />
                    <label className="form-check-label" htmlFor="voucher">
                      Voucher
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="gift"
                      value="gift"
                      checked={formik.values.reward_type === "gift"}
                      onChange={(e) =>
                        formik.setFieldValue("reward_type", e.target.value)
                      }
                      name="reward_type"
                    />
                    <label className="form-check-label" htmlFor="gift">
                      Gift
                    </label>
                  </div>
                </div>
                {formik.touched.reward_type && formik.errors.reward_type && (
                  <div className="invalid-feedback d-block">
                    {formik.errors.reward_type}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="target_achieved"
                    checked={formik.values.target_archieved === "1"}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "target_archieved",
                        e.target.checked ? "1" : "0"
                      )
                    }
                    name="target_archieved"
                  />
                  <label className="form-check-label" htmlFor="target_achieved">
                    Target Achieved
                  </label>
                </div>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <textarea
                  rows={5}
                  className={`form-control form-control-sm ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("description")}
                  maxLength={250}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">
                    {formik.errors.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

RewardEdit.propTypes = {
  id: PropTypes.number.isRequired,
};

export default RewardEdit;
