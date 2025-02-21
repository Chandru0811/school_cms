import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { MultiSelect } from "react-multi-select-component";

function WorkSheetAsign({ grade_ids, assignedId }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [grades, setGrades] = useState([]);
  const [studentsList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  console.log("gradeID::", grade_ids)

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const validationSchema = yup.object().shape({
    grade_id: yup.string().required("*Select a grade id"),
  });

  const formik = useFormik({
    initialValues: {
      assigned_id: assignedId,
      grade_id: "",
      student_id: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form values:", values);
      try {
        const response = await api.post("worksheet/assign", values);
        console.log(response.status)

        if (response.status === 200) {
          toast.success(response.data.message);
          handleClose();
        }
      } catch (e) {
        toast.error("Error Fetching Data ", e?.response?.data?.error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const getStudentList = async (selectId) => {
    try {
      const response = await api.get(`filter/students?grade_id=${selectId}`);
      const formattedStudent = response.data?.data?.map((student) => ({
        value: student.id,
        label: student.first_name,
      }));
      console.log("studrnt \\", formattedStudent)
      setStudentList(formattedStudent);
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  const getGradeList = async () => {
    try {
      const response = await api.get("grades/list");
      const formattedGrades = response.data?.data
        ?.filter((grade) => grade_ids.includes(grade.id))
        .map((grade) => ({
          value: grade.id,
          label: grade.name,
        }));
      setGrades(formattedGrades);
    } catch (e) {
      console.error("Error Fetching Data", e);
      toast.error("Error Fetching Data", e?.response?.data?.error || e.message);
    }
  };

  useEffect(() => {
    getGradeList();
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-button btn-sm me-2"
        style={{ fontWeight: "600px !important" }}
        onClick={handleShow}
      >
        Assign
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
            <p className="headColor">Assign Worksheet</p>
          </DialogTitle>
          <hr className="m-0"></hr>
          <DialogContent>
            <div className="row">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Grade ID<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-sm ${formik.touched.grade_id && formik.errors.grade_id ? "is-invalid" : ""
                    }`}
                  value={formik.values.grade_id}
                  onChange={(e) => {
                    const selectedGradeId = e.target.value;
                    formik.setFieldValue("grade_id", selectedGradeId);
                    getStudentList(selectedGradeId);
                  }}
                >
                  <option value="">Select Grade ID</option>
                  {grades.map((grade) => (
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
                  Student ID
                </label>
                <MultiSelect
                  options={studentsList}
                  value={selectedStudent}
                  onChange={(selected) => {
                    setSelectedStudent(selected);
                    formik.setFieldValue(
                      "student_id",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Center"
                  className={`form-multi-select form-multi-select-sm ${formik.touched.center_id && formik.errors.center_id
                    ? "is-invalid"
                    : ""
                    }`}
                />
                {formik.touched.student_id && formik.errors.student_id && (
                  <div className="invalid-feedback">
                    {formik.errors.student_id}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
          <hr className="m-0"></hr>
          <DialogActions className="mt-3">
            <button
              type="button"
              className="btn btn-sm btn-back"
              onClick={handleClose}>
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

export default WorkSheetAsign;