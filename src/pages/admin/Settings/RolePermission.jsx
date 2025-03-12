import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../config/URL";
import { FiSave } from "react-icons/fi";

const validationSchema = Yup.object().shape({});

function RolePermission({ key }) {
  const role = localStorage.getItem("schoolCMS_role");
  const userName = localStorage.getItem("userName");
  const [roleName, setRoleName] = useState([]);
  console.log("roless", roleName);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const role_id = selectedRoleId;
  console.log("selectedRole", selectedRole);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const fetchRole = async () => {
    try {
      setLoading(true);
      const response = await api.get("admin/roles/list");
      console.log("API Response: ", response);
      if (response.data.data && response.data.data.length > 0) {
        setRoleName(response.data.data);
        // setSelectedRoleId(response.data.data[0].id);
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error("Don't have access to this page");
      } else {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [key,selectedRoleId]);

  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;
    const selectedRole = roleName.find(
      (role) => role.id === parseInt(selectedRoleId)
    );
    setSelectedRole(selectedRole?.name || "");
    setSelectedRoleId(selectedRoleId);
  };
  

  const formik = useFormik({
    initialValues: {
      centers: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      employees: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      grades: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      students: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      subjects: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      topics: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      questions: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      challenges: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      worksheets: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      homeworks: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      student_assigneds: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      student_attempts: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      rewards: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      subscriptions: {
        canAccess: false,
        canCreate: false,
        canView: false,
        canEdit: false,
        canDelete: false,
      },
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Api Data:", values);

      const transformedValues = Object.keys(values).map((moduleName) => ({
        module_name: moduleName,
        can_access: values[moduleName].canAccess,
        can_view: values[moduleName].canView,
        can_create: values[moduleName].canCreate,
        can_edit: values[moduleName].canEdit,
        can_delete: values[moduleName].canDelete,
      }));
      try {
        setLoadIndicator(true);
        const response = await api.put(
          `admin/role_permission/update/${role_id}`,
          transformedValues,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  useEffect(() => {
    getRoleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role_id]);

  const handleCheckboxChange = (name) => (event) => {
    const { checked } = event.target;
    formik.setFieldValue(name, checked);
  };
  const handleCheckAll = () => {
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldValue(key, {
        canAccess: true,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      });
    });
  };

  const handleUncheckAll = () => {
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldValue(key, {
        canAccess: false,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      });
    });
  };

  const handleCheckAllCreate = () => {
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldValue(`${key}.canCreate`, true);
    });
  };

  const handleCheckAllRead = () => {
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldValue(`${key}.canView`, true);
    });
  };

  const handleCheckAllUpdate = () => {
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldValue(`${key}.canEdit`, true);
    });
  };

  const handleCheckAllDelete = () => {
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldValue(`${key}.canDelete`, true);
    });
  };

  const handleCheckAllIndex = () => {
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldValue(`${key}.canAccess`, true);
    });
  };

  const getRoleData = async () => {
    try {
      if(role_id){
        const response = await api.get(`admin/role_permission/${role_id}`);
        console.log(response.data, "response.data");
        const permissions = response.data.data;
        if (!Array.isArray(permissions)) {
          throw new Error("permissions is not an array");
        }
        const transformedPermissions = permissions.reduce((acc, permission) => {
          acc[permission.module_name] = {
            canAccess: permission.can_access,
            canView: permission.can_view,
            canCreate: permission.can_create,
            canEdit: permission.can_edit,
            canDelete: permission.can_delete,
          };
          return acc;
        }, {});

        formik.setValues(transformedPermissions);
        console.log(transformedPermissions, "transformedPermissions");
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  return (
    <div className="container-fluid">
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
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
          <div className="">
            <div className="d-flex justify-content-end align-items-end">
              <button
                type="submit"
                className="btn add-btn btn-sm"
                disabled={loadIndicator}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm button-spinner me-2 text-light"
                    aria-hidden="true"
                  ></span>
                )}
                <FiSave className="trash-icon" /> Save
              </button>
            </div>
            <div className="row d-flex align-items-start">
              <div className="col-md-3 col-12">
                <label className="form-label">
                  User Role <span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <select
                    className="form-select form-select-sm iconInput"
                    aria-label="Select Role"
                    onChange={handleRoleChange}
                    value={selectedRoleId}
                  >
                    <option selected>Select Role</option>
                    {roleName &&
                      roleName.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-md-9 col-12 d-flex align-items-center py-3">
                <div
                  className="btn-group btn-group-sm my-5"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    className="btn add-btn"
                    onClick={handleCheckAllIndex}
                  >
                    Index
                  </button>
                  <button
                    type="button"
                    className="btn add-btn"
                    onClick={handleCheckAllRead}
                  >
                    Read
                  </button>
                  <button
                    type="button"
                    className="btn add-btn"
                    onClick={handleCheckAllCreate}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn add-btn"
                    onClick={handleCheckAllUpdate}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn add-btn"
                    onClick={handleCheckAllDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn add-btn"
                    onClick={handleCheckAll}
                  >
                    Check All
                  </button>
                  <button
                    type="button"
                    className="btn add-btn"
                    onClick={handleUncheckAll}
                  >
                    Uncheck All
                  </button>
                </div>
              </div>
            </div>
            <div>
            {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
            >
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
              <div className="row">
                <div className="clo-12">
                  <div className="table-responsive">
                    <div
                      id="datatable"
                      style={{ maxHeight: "460px", overflowY: "auto" }}
                    >
                        <table className="table table-hover">
                          <thead
                            className="bg-light"
                            style={{ position: "sticky", top: 0, zIndex: 1 }}
                          >
                            <tr>
                              <th scope="col" className="cms-header">
                                Module Permission
                              </th>
                              <th scope="col" className="cms-header">
                                Index
                              </th>
                              <th scope="col" className="cms-header">
                                Read
                              </th>
                              <th scope="col" className="cms-header">
                                Create
                              </th>
                              <th scope="col" className="cms-header">
                                Update
                              </th>
                              <th scope="col" className="cms-header">
                                Delete
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Center
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="centers.canAccess"
                                  checked={formik.values?.centers?.canAccess}
                                  onChange={handleCheckboxChange(
                                    "centers.canAccess"
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="centers.canView"
                                  checked={formik.values?.centers?.canView}
                                  onChange={handleCheckboxChange(
                                    "centers.canView"
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="centers.canCreate"
                                  checked={formik.values?.centers?.canCreate}
                                  onChange={handleCheckboxChange(
                                    "centers.canCreate"
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="centers.canEdit"
                                  checked={formik.values?.centers?.canEdit}
                                  onChange={handleCheckboxChange(
                                    "centers.canEdit"
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="centers.canDelete"
                                  checked={formik.values?.centers?.canDelete}
                                  onChange={handleCheckboxChange(
                                    "centers.canDelete"
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Employee
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="employees.canAccess"
                                  checked={formik.values?.employees?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `employees.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="employees.canView"
                                  checked={formik.values?.employees?.canView}
                                  onChange={handleCheckboxChange(
                                    `employees.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="employees.canCreate"
                                  checked={formik.values?.employees?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `employees.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="employees.canEdit"
                                  checked={formik.values?.employees?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `employees.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="employees.canDelete"
                                  checked={formik.values?.employees?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `employees.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Grade
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="grades.canAccess"
                                  checked={formik.values?.grades?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `grades.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="grades.canView"
                                  checked={formik.values?.grades?.canView}
                                  onChange={handleCheckboxChange(
                                    `grades.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="grades.canCreate"
                                  checked={formik.values?.grades?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `grades.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="grades.canEdit"
                                  checked={formik.values?.grades?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `grades.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="grades.canDelete"
                                  checked={formik.values?.grades?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `grades.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Student
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="students.canAccess"
                                  checked={formik.values?.students?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `students.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="students.canView"
                                  checked={formik.values?.students?.canView}
                                  onChange={handleCheckboxChange(
                                    `students.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="students.canCreate"
                                  checked={formik.values?.students?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `students.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="students.canEdit"
                                  checked={formik.values?.students?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `students.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="students.canDelete"
                                  checked={formik.values?.students?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `students.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Subject
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subjects.canAccess"
                                  checked={formik.values?.subjects?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `subjects.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subjects.canView"
                                  checked={formik.values?.subjects?.canView}
                                  onChange={handleCheckboxChange(
                                    `subjects.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subjects.canCreate"
                                  checked={formik.values?.subjects?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `subjects.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subjects.canEdit"
                                  checked={formik.values?.subjects?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `subjects.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subjects.canDelete"
                                  checked={formik.values?.subjects?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `subjects.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Topic
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="topics.canAccess"
                                  checked={formik.values?.topics?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `topics.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="topics.canView"
                                  checked={formik.values?.topics?.canView}
                                  onChange={handleCheckboxChange(
                                    `topics.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="topics.canCreate"
                                  checked={formik.values?.topics?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `topics.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="topics.canEdit"
                                  checked={formik.values?.topics?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `topics.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="topics.canDelete"
                                  checked={formik.values?.topics?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `topics.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Question & Answer
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="questions.canAccess"
                                  checked={formik.values?.questions?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `questions.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="questions.canView"
                                  checked={formik.values?.questions?.canView}
                                  onChange={handleCheckboxChange(
                                    `questions.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="questions.canCreate"
                                  checked={formik.values?.questions?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `questions.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="questions.canEdit"
                                  checked={formik.values?.questions?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `questions.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="questions.canDelete"
                                  checked={formik.values?.questions?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `questions.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Challenges
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="challenges.canAccess"
                                  checked={formik.values?.challenges?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `challenges.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="challenges.canView"
                                  checked={formik.values?.challenges?.canView}
                                  onChange={handleCheckboxChange(
                                    `challenges.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="challenges.canCreate"
                                  checked={formik.values?.challenges?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `challenges.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="challenges.canEdit"
                                  checked={formik.values?.challenges?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `challenges.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="challenges.canDelete"
                                  checked={formik.values?.challenges?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `challenges.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Worksheet
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="worksheets.canAccess"
                                  checked={formik.values?.worksheets?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `worksheets.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="worksheets.canView"
                                  checked={formik.values?.worksheets?.canView}
                                  onChange={handleCheckboxChange(
                                    `worksheets.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="worksheets.canCreate"
                                  checked={formik.values?.worksheets?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `worksheets.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="worksheets.canEdit"
                                  checked={formik.values?.worksheets?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `worksheets.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="worksheets.canDelete"
                                  checked={formik.values?.worksheets?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `worksheets.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Homework
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="homeworks.canAccess"
                                  checked={formik.values?.homeworks?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `homeworks.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="homeworks.canView"
                                  checked={formik.values?.homeworks?.canView}
                                  onChange={handleCheckboxChange(
                                    `homeworks.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="homeworks.canCreate"
                                  checked={formik.values?.homeworks?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `homeworks.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="homeworks.canEdit"
                                  checked={formik.values?.homeworks?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `homeworks.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="homeworks.canDelete"
                                  checked={formik.values?.homeworks?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `homeworks.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Assessment Assign
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_assigneds.canAccess"
                                  checked={
                                    formik.values?.student_assigneds?.canAccess
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_assigneds.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_assigneds.canView"
                                  checked={
                                    formik.values?.student_assigneds?.canView
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_assigneds.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_assigneds.canCreate"
                                  checked={
                                    formik.values?.student_assigneds?.canCreate
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_assigneds.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_assigneds.canEdit"
                                  checked={
                                    formik.values?.student_assigneds?.canEdit
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_assigneds.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_assigneds.canDelete"
                                  checked={
                                    formik.values?.student_assigneds?.canDelete
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_assigneds.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Do Assessment
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_attempts.canAccess"
                                  checked={
                                    formik.values?.student_attempts?.canAccess
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_attempts.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_attempts.canView"
                                  checked={
                                    formik.values?.student_attempts?.canView
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_attempts.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_attempts.canCreate"
                                  checked={
                                    formik.values?.student_attempts?.canCreate
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_attempts.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_attempts.canEdit"
                                  checked={
                                    formik.values?.student_attempts?.canEdit
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_attempts.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="student_attempts.canDelete"
                                  checked={
                                    formik.values?.student_attempts?.canDelete
                                  }
                                  onChange={handleCheckboxChange(
                                    `student_attempts.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  rewards
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="rewards.canAccess"
                                  checked={formik.values?.rewards?.canAccess}
                                  onChange={handleCheckboxChange(
                                    `rewards.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="rewards.canView"
                                  checked={formik.values?.rewards?.canView}
                                  onChange={handleCheckboxChange(
                                    `rewards.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="rewards.canCreate"
                                  checked={formik.values?.rewards?.canCreate}
                                  onChange={handleCheckboxChange(
                                    `rewards.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="rewards.canEdit"
                                  checked={formik.values?.rewards?.canEdit}
                                  onChange={handleCheckboxChange(
                                    `rewards.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="rewards.canDelete"
                                  checked={formik.values?.rewards?.canDelete}
                                  onChange={handleCheckboxChange(
                                    `rewards.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p
                                  style={{
                                    marginLeft: "30px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  Subscriptions
                                </p>
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subscriptions.canAccess"
                                  checked={
                                    formik.values?.subscriptions?.canAccess
                                  }
                                  onChange={handleCheckboxChange(
                                    `subscriptions.canAccess`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subscriptions.canView"
                                  checked={
                                    formik.values?.subscriptions?.canView
                                  }
                                  onChange={handleCheckboxChange(
                                    `subscriptions.canView`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subscriptions.canCreate"
                                  checked={
                                    formik.values?.subscriptions?.canCreate
                                  }
                                  onChange={handleCheckboxChange(
                                    `subscriptions.canCreate`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subscriptions.canEdit"
                                  checked={
                                    formik.values?.subscriptions?.canEdit
                                  }
                                  onChange={handleCheckboxChange(
                                    `subscriptions.canEdit`
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="subscriptions.canDelete"
                                  checked={
                                    formik.values?.subscriptions?.canDelete
                                  }
                                  onChange={handleCheckboxChange(
                                    `subscriptions.canDelete`
                                  )}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                    </div>
                  </div>
                </div>
              </div>
          )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default RolePermission;
