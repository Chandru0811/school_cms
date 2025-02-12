import { useState } from "react";
// import api from "../../config/URL";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../config/URL";

const validationSchema = Yup.object().shape({});

function RolePermission() {
  const [role, setRole] = useState("1");
  const userName = localStorage.getItem("userName");
  const [roleName, setRoleName] = useState("SMS_ADMIN");

  const roleMapping = {
    1: "SMS_ADMIN",
    2: "SMS_BRANCH_ADMIN",
    4: "SMS_STAFF",
    5: "SMS_STAFF_ADMIN",
    6: "SMS_TEACHER",
    7: "CENTER_MANAGER",
    8: "SMS_FREELANCER",
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setRoleName(roleMapping[selectedRole]);
  };

  const formik = useFormik({
    initialValues: {
      courseIndex: true,
      courseRead: true,
      courseCreate: true,
      courseUpdate: true,
      courseDelete: true,
      classIndex: true,
      classRead: true,
      classCreate: true,
      classUpdate: true,
      classDelete: true,
      levelIndex: true,
      levelRead: true,
      levelCreate: true,
      levelUpdate: true,
      levelDelete: true,
      subjectIndex: true,
      subjectRead: true,
      subjectCreate: true,
      subjectUpdate: true,
      subjectDelete: true,

      curriculumIndex: true,
      curriculumRead: true,
      curriculumCreate: true,
      curriculumUpdate: true,
      curriculumDelete: true,

      courseFeesIndex: true,
      courseFeesRead: true,
      courseFeesCreate: true,
      courseFeesUpdate: true,
      courseFeesDelete: true,

      subscriptionsIndex: true,
      subscriptionsRead: true,
      subscriptionsCreate: true,
      subscriptionsUpdate: true,
      subscriptionsDelete: true,

      rewardsIndex: true,
      rewardsRead: true,
      rewardsCreate: true,
      rewardsUpdate: true,
      rewardsDelete: true,

      homeworkIndex: true,
      homeworkRead: true,
      homeworkCreate: true,
      homeworkUpdate: true,
      homeworkDelete: true,

      worksheetIndex: true,
      worksheetRead: true,
      worksheetCreate: true,
      worksheetUpdate: true,
      worksheetDelete: true,

      employeeIndex: true,
      employeeRead: true,
      employeeCreate: true,
      employeeUpdate: true,
      employeeDelete: true,

      courseDepositFeesIndex: true,
      courseDepositFeesRead: true,
      courseDepositFeesCreate: true,
      courseDepositFeesUpdate: true,
      courseDepositFeesDelete: true,
      curriculumOutlineIndex: true,
      curriculumOutlineRead: true,
      curriculumOutlineCreate: true,
      curriculumOutlineUpdate: true,
      curriculumOutlineDelete: true,
      centerListingIndex: true,
      centerListingRead: true,
      centerListingCreate: true,
      centerListingUpdate: true,
      centerListingDelete: true,
      leadListingIndex: true,
      leadListingRead: true,
      leadListingCreate: true,
      leadListingUpdate: true,
      leadListingDelete: true,
      enrollmentIndex: true,
      enrollmentRead: true,
      enrollmentCreate: true,
      enrollmentUpdate: true,
      enrollmentDelete: true,
      staffIndex: true,
      staffRead: true,
      staffCreate: true,
      staffUpdate: true,
      staffDelete: true,
      teacherIndex: true,
      teacherRead: true,
      teacherCreate: true,
      teacherUpdate: true,
      teacherDelete: true,
      attendanceIndex: true,
      attendanceRead: true,
      attendanceCreate: true,
      attendanceUpdate: true,
      attendanceDelete: true,
      staffAttendanceCreate: true,
      staffAttendanceIndex: true,
      staffAttendanceRead: true,
      staffAttendanceUpdate: true,
      staffAttendanceDelete: true,
      leaveAdminIndex: true,
      leaveAdminRead: true,
      leaveAdminUpdate: true,
      leaveIndex: true,
      leaveCreate: true,
      holidayIndex: true,
      holidayRead: true,
      holidayCreate: true,
      holidayUpdate: true,
      holidayDelete: true,
      deductionIndex: true,
      deductionCreate: true,
      deductionRead: true,
      deductionUpdate: true,
      deductionDelete: true,

      payrollIndex: true,
      payrollRead: true,
      payrollCreate: true,
      payrollUpdate: true,
      payrollDelete: true,

      //   payrollIndex: true,
      //   payrollRead: true,
      //   payrollCreate: true,
      //   payrollUpdate: true,
      //   payrollDelete: true,

      payslipIndex: true,
      payslipRead: true,

      freeLancerIndex: true,
      freeLancerRead: true,
      freeLancerCreate: true,
      freeLancerUpdate: true,
      freeLancerDelete: true,

      leaveRequestIndex: true,
      leaveRequestRead: true,
      leaveRequestCreate: true,
      leaveRequestUpdate: true,
      leaveRequestDelete: true,
      rolesMatrixIndex: true,
      rolesMatrixRead: true,
      rolesMatrixCreate: true,
      rolesMatrixUpdate: true,
      rolesMatrixDelete: true,
      studentListingIndex: true,
      studentListingRead: true,
      studentListingCreate: true,
      studentListingUpdate: true,
      studentListingDelete: true,
      changeClassIndex: true,
      changeClassRead: true,
      changeClassCreate: true,
      changeClassUpdate: true,
      changeClassDelete: true,
      transferOutIndex: true,
      transferOutRead: true,
      transferOutCreate: true,
      transferOutUpdate: true,
      transferOutDelete: true,
      withdrawIndex: true,
      withdrawRead: true,
      withdrawCreate: true,
      withdrawUpdate: true,
      withdrawDelete: true,
      endClassIndex: true,
      endClassRead: true,
      endClassCreate: true,
      endClassUpdate: true,
      endClassDelete: true,
      registerNewIndex: true,
      registerNewRead: true,
      registerNewCreate: true,
      registerNewUpdate: true,
      registerNewDelete: true,
      deductDepositIndex: true,
      deductDepositRead: true,
      deductDepositCreate: true,
      deductDepositUpdate: true,
      deductDepositDelete: true,
      documentListingIndex: true,
      documentListingRead: true,
      documentListingCreate: true,
      documentListingUpdate: true,
      documentListingDelete: true,
      documentFileIndex: true,
      documentFileRead: true,
      documentFileCreate: true,
      documentFileUpdate: true,
      documentFileDelete: true,
      invoiceIndex: true,
      invoiceRead: true,
      invoiceCreate: true,
      invoiceUpdate: true,
      invoiceDelete: true,
      paymentIndex: true,
      paymentRead: true,
      paymentCreate: true,
      paymentUpdate: true,
      paymentDelete: true,
      scheduleTeacherIndex: true,
      scheduleTeacherRead: true,
      scheduleTeacherCreate: true,
      scheduleTeacherUpdate: true,
      scheduleTeacherDelete: true,
      documentReportIndex: true,
      documentReportRead: true,
      documentReportCreate: true,
      documentReportUpdate: true,
      documentReportDelete: true,
      attendanceReportIndex: true,
      attendanceReportRead: true,
      attendanceReportCreate: true,
      attendanceReportUpdate: true,
      attendanceReportDelete: true,
      studentReportIndex: true,
      studentReportRead: true,
      studentReportCreate: true,
      studentReportUpdate: true,
      studentReportDelete: true,
      assessmentReportIndex: true,
      assessmentReportRead: true,
      assessmentReportCreate: true,
      assessmentReportUpdate: true,
      assessmentReportDelete: true,
      enrollmentReportIndex: true,
      enrollmentReportRead: true,
      enrollmentReportCreate: true,
      enrollmentReportUpdate: true,
      enrollmentReportDelete: true,
      feeCollectionReportIndex: true,
      feeCollectionReportRead: true,
      feeCollectionReportCreate: true,
      feeCollectionReportUpdate: true,
      feeCollectionReportDelete: true,
      packageBalanceReportIndex: true,
      packageBalanceReportRead: true,
      packageBalanceReportCreate: true,
      packageBalanceReportUpdate: true,
      packageBalanceReportDelete: true,
      salesRevenueReportIndex: true,
      salesRevenueReportRead: true,
      salesRevenueReportCreate: true,
      salesRevenueReportUpdate: true,
      salesRevenueReportDelete: true,
      replaceClassLessonListIndex: true,
      replaceClassLessonListRead: true,
      replaceClassLessonListCreate: true,
      replaceClassLessonListUpdate: true,
      replaceClassLessonListDelete: true,
      timeScheduleIndex: true,
      timeScheduleDelete: true,
      timeScheduleBlock: true,
      timeScheduleUnBlock: true,
      timeScheduleAdd: true,
      timeScheduleApproved: true,
      sendNotificationIndex: true,
      sendNotificationCreate: true,
      sendNotificationUpdate: true,
      smsMessageIndex: true,
      smsMessageRead: true,
      smsMessageCreate: true,
      account_read: true,
      headerIndex: true,
      headerRead: true,
      headerCreate: true,
      headerUpdate: true,
      headerDelete: true,
      headerPublish: true,
      homeIndex: true,
      homeRead: true,
      homeCreate: true,
      homeUpdate: true,
      homeDelete: true,
      homePublish: true,
      testimonialIndex: true,
      testimonialRead: true,
      testimonialCreate: true,
      testimonialUpdate: true,
      testimonialDelete: true,
      testimonialPublish: true,
      aboutIndex: true,
      aboutRead: true,
      aboutCreate: true,
      aboutUpdate: true,
      aboutDelete: true,
      aboutPublish: true,
      englishCourseIndex: true,
      englishCourseRead: true,
      englishCourseCreate: true,
      englishCourseUpdate: true,
      englishCourseDelete: true,
      englishCoursePublish: true,
      chineseCourseIndex: true,
      chineseCourseRead: true,
      chineseCourseCreate: true,
      chineseCourseUpdate: true,
      chineseCourseDelete: true,
      chineseCoursePublish: true,
      teacherSaveCreate: true,
      teacherSaveIndex: true,
      teacherSaveUpdate: true,
      teacherSaveDelete: true,
      teacherSavePublish: true,
      teacherSaveRead: true,

      productSaveCreate: true,
      productSaveUpdate: true,
      productSaveRead: true,
      productSaveIndex: true,
      productSaveDelete: true,
      productSavePublish: true,
      productImageSaveCreate: true,
      productImageSaveUpdate: true,
      productImageSaveRead: true,
      productImageSaveIndex: true,
      productImageSaveDelete: true,
      productImageSavePublish: true,

      newsUpdatesIndex: true,
      newsUpdatesRead: true,
      newsUpdatesCreate: true,
      newsUpdatesUpdate: true,
      newsUpdatesDelete: true,
      newsUpdatesPublish: true,

      contactUsIndex: true,
      contactUsRead: true,
      contactUsCreate: true,
      contactUsUpdate: true,
      contactUsDelete: true,
      contactUsPublish: true,

      taxSettingIndex: true,
      taxSettingRead: true,
      taxSettingCreate: true,
      taxSettingUpdate: true,
      taxSettingDelete: true,

      raceSettingIndex: true,
      raceSettingRead: true,
      raceSettingCreate: true,
      raceSettingUpdate: true,
      raceSettingDelete: true,

      countrySettingIndex: true,
      countrySettingRead: true,
      countrySettingCreate: true,
      countrySettingUpdate: true,
      countrySettingDelete: true,

      shgSettingIndex: true,
      shgSettingRead: true,
      shgSettingCreate: true,
      shgSettingUpdate: true,
      shgSettingDelete: true,

      batchtimeSettingIndex: true,
      batchtimeSettingRead: true,
      batchtimeSettingCreate: true,
      batchtimeSettingUpdate: true,
      batchtimeSettingDelete: true,

      leaveSettingIndex: true,
      leaveSettingRead: true,
      leaveSettingCreate: true,
      leaveSettingUpdate: true,
      leaveSettingDelete: true,

      idTypeSettingIndex: true,
      idTypeSettingRead: true,
      idTypeSettingCreate: true,
      idTypeSettingUpdate: true,
      idTypeSettingDelete: true,

      salarySettingIndex: true,
      salarySettingRead: true,
      salarySettingCreate: true,
      salarySettingUpdate: true,
      salarySettingDelete: true,

      blogIndex: true,
      blogRead: true,
      blogCreate: true,
      blogUpdate: true,
      blogDelete: true,
      blogPublish: true,

      contactUsSettingIndex: true,
      contactUsSettingRead: true,
      contactUsSettingCreate: true,
      contactUsSettingUpdate: true,
      contactUsSettingDelete: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Api Data:", values);
      const payload = {
        ...values,
        roleName: roleName,
        id: role,
        updatedBy: userName,
        createdBy: userName,
        createdAt: "2025-01-10",
        updatedAt: "2025-01-10",
      };

      try {
        const response = await api.put(`/updateRoleInfo/${role}`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      }
    },
  });

  //   useEffect(() => {
  //     getRoleData();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [role]);

  const handleCheckboxChange = (fieldName) => {
    return (event) => {
      formik.setFieldValue(fieldName, event.target.checked);
    };
  };
  const handleCheckAll = () => {
    Object.keys(formik.values).map((key) => {
      formik.setFieldValue(key, true);
    });
  };

  const handleUncheckAll = () => {
    Object.keys(formik.values).map((key) => {
      formik.setFieldValue(key, false);
    });
  };

  const handleCheckAllCreate = () => {
    formik.setValues({
      ...formik.values,
      courseCreate: true,
      classCreate: true,
      levelCreate: true,
      subjectCreate: true,
      curriculumCreate: true,
      courseFeesCreate: true,
      courseDepositFeesCreate: true,
      curriculumOutlineCreate: true,
      centerListingCreate: true,
      leadListingCreate: true,
      leadListingUpdate: true,
      enrollmentCreate: true,
      staffCreate: true,
      teacherCreate: true,
      attendanceCreate: true,
      staffAttendanceCreate: true,
      leaveAdminCreate: true,
      leaveCreate: true,
      holidayCreate: true,
      deductionCreate: true,
      payrollCreate: true,
      payslipCreate: true,
      freeLancerCreate: true,
      leaveRequestCreate: true,
      rolesMatrixCreate: true,
      studentListingCreate: true,
      changeClassCreate: true,
      transferOutCreate: true,
      withdrawCreate: true,
      endClassCreate: true,
      registerNewCreate: true,
      deductDepositCreate: true,
      documentListingCreate: true,
      documentFileCreate: true,
      invoiceCreate: true,
      paymentCreate: true,
      scheduleTeacherCreate: true,
      documentReportCreate: true,
      attendanceReportCreate: true,
      studentReportCreate: true,
      assessmentReportCreate: true,
      enrollmentReportCreate: true,
      feeCollectionReportCreate: true,
      packageBalanceReportCreate: true,
      salesRevenueReportCreate: true,
      replaceClassLessonListCreate: true,
      timeScheduleAdd: true,
      sendNotificationCreate: true,
      smsMessageCreate: true,
      account_create: true,
      headerCreate: true,
      homeCreate: true,
      testimonialCreate: true,
      aboutCreate: true,
      englishCourseCreate: true,
      chineseCourseCreate: true,
      teacherSaveCreate: true,
      productSaveCreate: true,
      productImageSaveCreate: true,
      newsUpdatesCreate: true,
      contactUsCreate: true,
      taxSettingCreate: true,
      raceSettingCreate: true,
      countrySettingCreate: true,
      shgSettingCreate: true,
      batchtimeSettingCreate: true,
      leaveSettingCreate: true,
      idTypeSettingCreate: true,
      salarySettingCreate: true,
      blogCreate: true,
      contactUsSettingCreate: true,
      employeeCreate: true,
      worksheetCreate: true,
      homeworkCreate: true,
      rewardsCreate: true,
      subscriptionsCreate: true,
    });
  };
  const handleCheckAllRead = () => {
    formik.setValues({
      ...formik.values,
      courseRead: true,
      classRead: true,
      levelRead: true,
      subjectRead: true,
      curriculumRead: true,
      courseFeesRead: true,
      courseDepositFeesRead: true,
      curriculumOutlineRead: true,
      centerListingRead: true,
      leadListingRead: true,
      enrollmentRead: true,
      staffRead: true,
      teacherRead: true,
      attendanceRead: true,
      staffAttendanceRead: true,
      leaveAdminRead: true,
      leaveRead: true,
      holidayRead: true,
      deductionRead: true,
      payrollRead: true,
      payslipRead: true,
      freeLancerRead: true,
      leaveRequestRead: true,
      rolesMatrixRead: true,
      studentListingRead: true,
      changeClassRead: true,
      transferOutRead: true,
      withdrawRead: true,
      endClassRead: true,
      registerNewRead: true,
      deductDepositRead: true,
      documentListingRead: true,
      documentFileRead: true,
      invoiceRead: true,
      paymentRead: true,
      scheduleTeacherRead: true,
      documentReportRead: true,
      attendanceReportRead: true,
      studentReportRead: true,
      assessmentReportRead: true,
      enrollmentReportRead: true,
      feeCollectionReportRead: true,
      packageBalanceReportRead: true,
      salesRevenueReportRead: true,
      replaceClassLessonListRead: true,
      timeScheduleBlock: true,
      sendNotificationRead: true,
      smsMessageRead: true,
      account_read: true,
      headerRead: true,
      homeRead: true,
      testimonialRead: true,
      aboutRead: true,
      englishCourseRead: true,
      chineseCourseRead: true,
      teacherSaveRead: true,
      productSaveRead: true,
      productImageSaveRead: true,
      newsUpdatesRead: true,
      contactUsRead: true,
      taxSettingRead: true,
      raceSettingRead: true,
      countrySettingRead: true,
      shgSettingRead: true,
      batchtimeSettingRead: true,
      leaveSettingRead: true,
      idTypeSettingRead: true,
      salarySettingRead: true,
      blogRead: true,
      contactUsSettingRead: true,
      employeeRead: true,
      worksheetRead: true,
      homeworkRead: true,
      rewardsRead: true,
      subscriptionsRead: true,
    });
  };
  const handleCheckAllUpdate = () => {
    formik.setValues({
      ...formik.values,
      courseUpdate: true,
      classUpdate: true,
      levelUpdate: true,
      subjectUpdate: true,
      curriculumUpdate: true,
      courseFeesUpdate: true,
      courseDepositFeesUpdate: true,
      curriculumOutlineUpdate: true,
      centerListingUpdate: true,
      leadListingUpdate: true,
      enrollmentUpdate: true,
      staffUpdate: true,
      teacherUpdate: true,
      attendanceUpdate: true,
      staffAttendanceUpdate: true,
      leaveAdminUpdate: true,
      leaveUpdate: true,
      holidayUpdate: true,
      deductionUpdate: true,
      payrollUpdate: true,
      payslipUpdate: true,
      freeLancerUpdate: true,
      leaveRequestUpdate: true,
      rolesMatrixUpdate: true,
      studentListingUpdate: true,
      changeClassUpdate: true,
      transferOutUpdate: true,
      withdrawUpdate: true,
      endClassUpdate: true,
      registerNewUpdate: true,
      deductDepositUpdate: true,
      documentListingUpdate: true,
      documentFileUpdate: true,
      invoiceUpdate: true,
      paymentUpdate: true,
      scheduleTeacherUpdate: true,
      documentReportUpdate: true,
      attendanceReportUpdate: true,
      studentReportUpdate: true,
      assessmentReportUpdate: true,
      enrollmentReportUpdate: true,
      feeCollectionReportUpdate: true,
      packageBalanceReportUpdate: true,
      salesRevenueReportUpdate: true,
      replaceClassLessonListUpdate: true,
      timeScheduleBlockUpdate: true,
      sendNotificationUpdate: true,
      smsMessageUpdate: true,
      account_update: true,
      headerUpdate: true,
      homeUpdate: true,
      testimonialUpdate: true,
      aboutUpdate: true,
      englishCourseUpdate: true,
      chineseCourseUpdate: true,
      teacherSaveUpdate: true,
      productSaveUpdate: true,
      productImageSaveUpdate: true,
      newsUpdatesUpdate: true,
      contactUsUpdate: true,
      taxSettingUpdate: true,
      raceSettingUpdate: true,
      countrySettingUpdate: true,
      shgSettingUpdate: true,
      batchtimeSettingUpdate: true,
      leaveSettingUpdate: true,
      idTypeSettingUpdate: true,
      salarySettingUpdate: true,
      blogUpdate: true,
      contactUsSettingUpdate: true,
      employeeUpdate: true,
      worksheetUpdate: true,
      homeworkUpdate: true,
      rewardsUpdate: true,
      subscriptionsUpdate: true,
    });
  };
  const handleCheckAllDelete = () => {
    formik.setValues({
      ...formik.values,
      courseDelete: true,
      classDelete: true,
      levelDelete: true,
      subjectDelete: true,
      curriculumDelete: true,
      courseFeesDelete: true,
      courseDepositFeesDelete: true,
      curriculumOutlineDelete: true,
      centerListingDelete: true,
      leadListingDelete: true,
      enrollmentDelete: true,
      staffDelete: true,
      teacherDelete: true,
      attendanceDelete: true,
      staffAttendanceDelete: true,
      leaveAdminDelete: true,
      leaveDelete: true,
      holidayDelete: true,
      deductionDelete: true,
      payrollDelete: true,
      payslipDelete: true,
      freeLancerDelete: true,
      leaveRequestDelete: true,
      rolesMatrixDelete: true,
      studentListingDelete: true,
      changeClassDelete: true,
      transferOutDelete: true,
      withdrawDelete: true,
      endClassDelete: true,
      registerNewDelete: true,
      deductDepositDelete: true,
      documentListingDelete: true,
      documentFileDelete: true,
      invoiceDelete: true,
      paymentDelete: true,
      scheduleTeacherDelete: true,
      documentReportDelete: true,
      attendanceReportDelete: true,
      studentReportDelete: true,
      assessmentReportDelete: true,
      enrollmentReportDelete: true,
      feeCollectionReportDelete: true,
      packageBalanceReportDelete: true,
      salesRevenueReportDelete: true,
      replaceClassLessonListDelete: true,
      timeScheduleBlockDelete: true,
      sendNotificationDelete: true,
      smsMessageDelete: true,
      account_delete: true,
      headerDelete: true,
      homeDelete: true,
      testimonialDelete: true,
      aboutDelete: true,
      englishCourseDelete: true,
      chineseCourseDelete: true,
      teacherSaveDelete: true,
      productSaveDelete: true,
      productImageSaveDelete: true,
      newsUpdatesDelete: true,
      contactUsDelete: true,
      taxSettingDelete: true,
      raceSettingDelete: true,
      countrySettingDelete: true,
      shgSettingDelete: true,
      batchtimeSettingDelete: true,
      leaveSettingDelete: true,
      idTypeSettingDelete: true,
      salarySettingDelete: true,
      blogDelete: true,
      contactUsSettingDelete: true,
      employeeDelete: true,
      worksheetDelete: true,
      homeworkDelete: true,
      rewardsDelete: true,
      subscriptionsDelete: true,
    });
  };
  const handleCheckAllIndex = () => {
    formik.setValues({
      ...formik.values,
      courseIndex: true,
      classIndex: true,
      levelIndex: true,
      subjectIndex: true,
      curriculumIndex: true,
      courseFeesIndex: true,
      courseDepositFeesIndex: true,
      curriculumOutlineIndex: true,
      centerListingIndex: true,
      leadListingIndex: true,
      enrollmentIndex: true,
      staffIndex: true,
      teacherIndex: true,
      attendanceIndex: true,
      staffAttendanceIndex: true,
      leaveAdminIndex: true,
      leaveIndex: true,
      holidayIndex: true,
      deductionIndex: true,
      payrollIndex: true,
      payslipIndex: true,
      freeLancerIndex: true,
      leaveRequestIndex: true,
      rolesMatrixIndex: true,
      studentListingIndex: true,
      changeClassIndex: true,
      transferOutIndex: true,
      withdrawIndex: true,
      endClassIndex: true,
      registerNewIndex: true,
      deductDepositIndex: true,
      documentListingIndex: true,
      documentFileIndex: true,
      invoiceIndex: true,
      paymentIndex: true,
      scheduleTeacherIndex: true,
      documentReportIndex: true,
      attendanceReportIndex: true,
      studentReportIndex: true,
      assessmentReportIndex: true,
      enrollmentReportIndex: true,
      feeCollectionReportIndex: true,
      packageBalanceReportIndex: true,
      salesRevenueReportIndex: true,
      replaceClassLessonListIndex: true,
      timeScheduleBlockIndex: true,
      sendNotificationIndex: true,
      smsMessageIndex: true,
      account_index: true,
      headerIndex: true,
      homeIndex: true,
      testimonialIndex: true,
      aboutIndex: true,
      englishCourseIndex: true,
      chineseCourseIndex: true,
      teacherSaveIndex: true,
      productSaveIndex: true,
      productImageSaveIndex: true,
      newsUpdatesIndex: true,
      contactUsIndex: true,
      taxSettingIndex: true,
      raceSettingIndex: true,
      countrySettingIndex: true,
      shgSettingIndex: true,
      batchtimeSettingIndex: true,
      leaveSettingIndex: true,
      idTypeSettingIndex: true,
      salarySettingIndex: true,
      blogIndex: true,
      contactUsSettingIndex: true,
      employeeIndex: true,
      worksheetIndex: true,
      homeworkIndex: true,
      rewardsIndex: true,
      subscriptionsIndex: true,
    });
  };

  //   const getRoleData = async () => {
  //     try {
  //       const response = await api.get(`/getAllRoleInfoById/${role}`);
  //       formik.setValues(response.data);
  //       // console.log(response.data, "getroleData");
  //     } catch (error) {
  //       console.error("Error fetching role data:", error);
  //     }
  //   };

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
        <div className="">
          <div className="row d-flex align-items-start p-2">
            <div className="col-md-7 col-12">
              <lable className="form-lable">
                User Role <span className="text-danger">*</span>
              </lable>
              <div className="input-group mb-3">
                <select
                  className="form-select form-select-sm iconInput "
                  aria-label="Default select example"
                  onChange={handleRoleChange}
                >
                  <option value="1">Admin</option>
                  <option value="2">Branch Admin</option>
                  <option value="4">Staff</option>
                  <option value="5">Staff Admin</option>
                  <option value="6">Teacher</option>
                  <option value="7">Centre Manager</option>
                  <option value="8">Freelancer</option>
                </select>
              </div>
            </div>
            <div className="col-md-5 col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-button btn-sm ">
                Save
              </button>
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-start align-items-center p-2">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button
                  type="button"
                  className="btn find_roll"
                  onClick={handleCheckAllIndex}
                >
                  Index
                </button>
                <button
                  type="button"
                  className="btn find_roll"
                  onClick={handleCheckAllRead}
                >
                  Read
                </button>
                <button
                  type="button"
                  className="btn find_roll"
                  onClick={handleCheckAllCreate}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="btn find_roll"
                  onClick={handleCheckAllUpdate}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn find_roll"
                  onClick={handleCheckAllDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn find_roll"
                  onClick={handleCheckAll}
                >
                  Check All
                </button>
                <button
                  type="button"
                  className="btn find_roll"
                  onClick={handleUncheckAll}
                >
                  Uncheck All
                </button>
              </div>
            </div>
            <div className="row">
              <div className="clo-12">
                <div className="table-responsive">
                  <div
                    id="datatable"
                    style={{ maxHeight: "460px", overflowY: "auto" }}
                  >
                    <table className="table table-hover">
                      <thead className="bg-light" style={{ position: "sticky", top: 0, zIndex: 1 ,}}>
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
                              name="courseIndex"
                              checked={formik.values.courseIndex}
                              onChange={handleCheckboxChange(`courseIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseRead"
                              checked={formik.values.courseRead}
                              onChange={handleCheckboxChange(`courseRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseCreate"
                              checked={formik.values.courseCreate}
                              onChange={handleCheckboxChange(`courseCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseUpdate"
                              checked={formik.values.courseUpdate}
                              onChange={handleCheckboxChange(`courseUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseDelete"
                              checked={formik.values.courseDelete}
                              onChange={handleCheckboxChange(`courseDelete`)}
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
                              name="employeeIndex"
                              checked={formik.values.employeeIndex}
                              onChange={handleCheckboxChange(`employeeIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="employeeRead"
                              checked={formik.values.employeeRead}
                              onChange={handleCheckboxChange(`employeeRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="employeeCreate"
                              checked={formik.values.employeeCreate}
                              onChange={handleCheckboxChange(`employeeCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="employeeUpdate"
                              checked={formik.values.employeeUpdate}
                              onChange={handleCheckboxChange(`employeeUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="employeeDelete"
                              checked={formik.values.employeeDelete}
                              onChange={handleCheckboxChange(`employeeDelete`)}
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
                              name="classIndex"
                              checked={formik.values.classIndex}
                              onChange={handleCheckboxChange(`classIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="classRead"
                              checked={formik.values.classRead}
                              onChange={handleCheckboxChange(`classRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="classCreate"
                              checked={formik.values.classCreate}
                              onChange={handleCheckboxChange(`classCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="classUpdate"
                              checked={formik.values.classUpdate}
                              onChange={handleCheckboxChange(`classUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="classDelete"
                              checked={formik.values.classDelete}
                              onChange={handleCheckboxChange(`classDelete`)}
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
                              name="levelIndex"
                              checked={formik.values.levelIndex}
                              onChange={handleCheckboxChange(`levelIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="levelRead"
                              checked={formik.values.levelRead}
                              onChange={handleCheckboxChange(`levelRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="levelCreate"
                              checked={formik.values.levelCreate}
                              onChange={handleCheckboxChange(`levelCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="levelUpdate"
                              checked={formik.values.levelUpdate}
                              onChange={handleCheckboxChange(`levelUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="levelDelete"
                              checked={formik.values.levelDelete}
                              onChange={handleCheckboxChange(`levelDelete`)}
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
                              name="subjectIndex"
                              checked={formik.values.subjectIndex}
                              onChange={handleCheckboxChange(`subjectIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subjectRead"
                              checked={formik.values.subjectRead}
                              onChange={handleCheckboxChange(`subjectRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subjectCreate"
                              checked={formik.values.subjectCreate}
                              onChange={handleCheckboxChange(`subjectCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subjectUpdate"
                              checked={formik.values.subjectUpdate}
                              onChange={handleCheckboxChange(`subjectUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subjectDelete"
                              checked={formik.values.subjectDelete}
                              onChange={handleCheckboxChange(`subjectDelete`)}
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
                              name="curriculumIndex"
                              checked={formik.values.curriculumIndex}
                              onChange={handleCheckboxChange(`curriculumIndex`)}
                            />
                          </td>
                          <td>
                            {/* <input
                          className="form-check-input"
                          type="checkbox"
                          name="curriculumRead"
                          checked={formik.values.curriculumRead}
                          onChange={handleCheckboxChange(`curriculumRead`)}
                        /> */}
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="curriculumCreate"
                              checked={formik.values.curriculumCreate}
                              onChange={handleCheckboxChange(
                                `curriculumCreate`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="curriculumUpdate"
                              checked={formik.values.curriculumUpdate}
                              onChange={handleCheckboxChange(
                                `curriculumUpdate`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="curriculumDelete"
                              checked={formik.values.curriculumDelete}
                              onChange={handleCheckboxChange(
                                `curriculumDelete`
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
                              name="courseFeesIndex"
                              checked={formik.values.courseFeesIndex}
                              onChange={handleCheckboxChange(`courseFeesIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseFeesRead"
                              checked={formik.values.courseFeesRead}
                              onChange={handleCheckboxChange(`courseFeesRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseFeesCreate"
                              checked={formik.values.courseFeesCreate}
                              onChange={handleCheckboxChange(
                                `courseFeesCreate`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseFeesUpdate"
                              checked={formik.values.courseFeesUpdate}
                              onChange={handleCheckboxChange(
                                `courseFeesUpdate`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseFeesDelete"
                              checked={formik.values.courseFeesDelete}
                              onChange={handleCheckboxChange(
                                `courseFeesDelete`
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
                              name="worksheetIndex"
                              checked={formik.values.worksheetIndex}
                              onChange={handleCheckboxChange(`worksheetIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="worksheetRead"
                              checked={formik.values.worksheetRead}
                              onChange={handleCheckboxChange(`worksheetRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="worksheetCreate"
                              checked={formik.values.worksheetCreate}
                              onChange={handleCheckboxChange(`worksheetCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="worksheetUpdate"
                              checked={formik.values.worksheetUpdate}
                              onChange={handleCheckboxChange(`worksheetUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="worksheetDelete"
                              checked={formik.values.worksheetDelete}
                              onChange={handleCheckboxChange(`worksheetDelete`)}
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
                              name="homeworkIndex"
                              checked={formik.values.homeworkIndex}
                              onChange={handleCheckboxChange(`homeworkIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="homeworkRead"
                              checked={formik.values.homeworkRead}
                              onChange={handleCheckboxChange(`homeworkRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="homeworkCreate"
                              checked={formik.values.homeworkCreate}
                              onChange={handleCheckboxChange(`homeworkCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="homeworkUpdate"
                              checked={formik.values.homeworkUpdate}
                              onChange={handleCheckboxChange(`homeworkUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="homeworkDelete"
                              checked={formik.values.homeworkDelete}
                              onChange={handleCheckboxChange(`homeworkDelete`)}
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
                              name="courseDepositFeesIndex"
                              checked={formik.values.courseDepositFeesIndex}
                              onChange={handleCheckboxChange(
                                `courseDepositFeesIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseDepositFeesRead"
                              checked={formik.values.courseDepositFeesRead}
                              onChange={handleCheckboxChange(
                                `courseDepositFeesRead`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseDepositFeesCreate"
                              checked={formik.values.courseDepositFeesCreate}
                              onChange={handleCheckboxChange(
                                `courseDepositFeesCreate`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseDepositFeesUpdate"
                              checked={formik.values.courseDepositFeesUpdate}
                              onChange={handleCheckboxChange(
                                `courseDepositFeesUpdate`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseDepositFeesDelete"
                              checked={formik.values.courseFeesDelete}
                              onChange={handleCheckboxChange(
                                `courseDepositFeesDelete`
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
                              Rewards
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="rewardsIndex"
                              checked={formik.values.rewardsIndex}
                              onChange={handleCheckboxChange(`rewardsIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="rewardsRead"
                              checked={formik.values.rewardsRead}
                              onChange={handleCheckboxChange(`rewardsRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="rewardsCreate"
                              checked={formik.values.rewardsCreate}
                              onChange={handleCheckboxChange(`rewardsCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="rewardsUpdate"
                              checked={formik.values.rewardsUpdate}
                              onChange={handleCheckboxChange(`rewardsUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="rewardsDelete"
                              checked={formik.values.rewardsDelete}
                              onChange={handleCheckboxChange(`rewardsDelete`)}
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
                              name="subscriptionsIndex"
                              checked={formik.values.subscriptionsIndex}
                              onChange={handleCheckboxChange(`subscriptionsIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subscriptionsRead"
                              checked={formik.values.subscriptionsRead}
                              onChange={handleCheckboxChange(`subscriptionsRead`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subscriptionsCreate"
                              checked={formik.values.subscriptionsCreate}
                              onChange={handleCheckboxChange(`subscriptionsCreate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subscriptionsUpdate"
                              checked={formik.values.subscriptionsUpdate}
                              onChange={handleCheckboxChange(`subscriptionsUpdate`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subscriptionsDelete"
                              checked={formik.values.subscriptionsDelete}
                              onChange={handleCheckboxChange(`subscriptionsDelete`)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RolePermission;
