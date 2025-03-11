import PropTypes from "prop-types";
import AdminDashboard from "../pages/admin/AdminDashboard";
import StudentDashboard from "../pages/admin/StudentDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminSideBar from "../components/admin/AdminSideBar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";
import School from "../pages/admin/School/School";
import Center from "../pages/admin/Center/Center";
import Role from "../pages/admin/Role/Role";
import Student from "../pages/admin/Student/Student";
import StudentAdd from "../pages/admin/Student/StudentAdd";
import StudentEdit from "../pages/admin/Student/StudentEdit";
import StudentView from "../pages/admin/Student/StudentView";
import Grade from "../pages/admin/Grade/Grade";
import GradeAdd from "../pages/admin/Grade/GradeAdd";
import GradeEdit from "../pages/admin/Grade/GradeEdit";
import GradeView from "../pages/admin/Grade/GradeView";
import Subject from "../pages/admin/Subject/Subject";
import SubjectAdd from "../pages/admin/Subject/SubjectAdd";
import SubjectEdit from "../pages/admin/Subject/SubjectEdit";
import SubjectView from "../pages/admin/Subject/SubjectView";
import Topic from "../pages/admin/Topic/Topic";
import TopicAdd from "../pages/admin/Topic/TopicAdd";
import TopicEdit from "../pages/admin/Topic/TopicEdit";
import TopicView from "../pages/admin/Topic/TopicView";
import Question from "../pages/admin/Question/Question";
import QuestionAdd from "../pages/admin/Question/QuestionAdd";
import QuestionEdit from "../pages/admin/Question/QuestionEdit";
import QuestionView from "../pages/admin/Question/QuestionView";
import Answer from "../pages/admin/Answer/Answer";
import Challenges from "../pages/admin/Challenges/Challenges";
import ChallengesAdd from "../pages/admin/Challenges/ChallengesAdd";
import ChallengesEdit from "../pages/admin/Challenges/ChallengesEdit";
import ChallengesView from "../pages/admin/Challenges/ChallengesView";
import WorkSheet from "../pages/admin/WorkSheet/WorkSheet";
import WorkSheetAdd from "../pages/admin/WorkSheet/WorkSheetAdd";
import WorkSheetEdit from "../pages/admin/WorkSheet/WorkSheetEdit";
import WorkSheetView from "../pages/admin/WorkSheet/WorkSheetView";
import Homework from "../pages/admin/Homework/Homework";
import HomeworkAdd from "../pages/admin/Homework/HomeworkAdd";
import HomeworkEdit from "../pages/admin/Homework/HomeworkEdit";
import HomeworkView from "../pages/admin/Homework/HomeworkView";
import RewardAdd from "../pages/admin/Rewards/RewardAdd";
import RewardEdit from "../pages/admin/Rewards/RewardEdit";
import RewardView from "../pages/admin/Rewards/RewardView";
import Rewards from "../pages/admin/Rewards/Rewards";
import Subscriptions from "../pages/admin/Subscriptions/Subscriptions";
import SubscriptionAdd from "../pages/admin/Subscriptions/SubscriptionAdd";
import SubscriptionEdit from "../pages/admin/Subscriptions/SubscriptionEdit";
import SubscriptionView from "../pages/admin/Subscriptions/SubscriptionView";
import Settings from "../pages/admin/Settings/Settings";
import RolePermission from "../pages/admin/Settings/RolePermission";
import Employee from "../pages/admin/Employee/Employee";
import EmployeeAdd from "../pages/admin/Employee/EmployeeAdd";
import EmployeeEdit from "../pages/admin/Employee/EmployeeEdit";
import EmployeeView from "../pages/admin/Employee/EmployeeView";
import DoAssessment from "../pages/admin/DoAssessment";
import CenterAdd from "../pages/admin/Center/CenterAdd";
import CenterEdit from "../pages/admin/Center/CenterEdit";
import CenterView from "../pages/admin/Center/CenterView";
import HomeDoAssessment from "../pages/admin/Homework/HomeDoAssessment";
import Successfull from "../pages/admin/WorkSheet/Successfull";
import HomeSuccessfull from "../pages/admin/Homework/HomeSuccessfull";
import AvatarProfile from "../pages/admin/AvatarProfile/AvatarProfile";
import AvatarProfileAdd from "../pages/admin/AvatarProfile/AvatarProfileAdd";
import AvatarProfileEdit from "../pages/admin/AvatarProfile/AvatarProfileEdit";
import AvatarProfileView from "../pages/admin/AvatarProfile/AvatarProfileView";

function Admin({ handleLogout }) {
  return (
    <div>
      <div>
        <BrowserRouter basename="/schoolCms">
          <div className="d-flex flex-column flex-lg-row bg-surface-secondary ">
            <AdminSideBar />

            <div className="flex-grow-1 h-screen overflow-y-auto">
              <AdminHeader handleLogout={handleLogout} />
              <main className="pt-2 bg-surface-secondary">
                <div style={{ minHeight: "80vh" }} className="px-2">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="*" element={<AdminDashboard />} />
                    <Route path="/studentdash" element={<StudentDashboard />} />

                    {/* Center  */}
                    <Route path="/centre" element={<Center />} />
                    <Route path="/centre/add" element={<CenterAdd />} />
                    <Route path="/centre/edit" element={<CenterEdit />} />
                    <Route path="/centre/view" element={<CenterView />} />

                    {/* Avatar  */}
                    <Route path="/avatar" element={<AvatarProfile />} />
                    <Route path="/avatar/add" element={<AvatarProfileAdd />} />
                    <Route
                      path="/avatar/edit"
                      element={<AvatarProfileEdit />}
                    />
                    <Route
                      path="/avatar/view/:id"
                      element={<AvatarProfileView />}
                    />
                    {/* Grade */}
                    <Route path="/grade" element={<Grade />} />
                    <Route path="/grade/add" element={<GradeAdd />} />
                    <Route path="/grade/edit" element={<GradeEdit />} />
                    <Route path="/grade/view" element={<GradeView />} />

                    {/* Employee */}
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/employee/add" element={<EmployeeAdd />} />
                    <Route
                      path="/employee/edit/:id"
                      element={<EmployeeEdit />}
                    />
                    <Route
                      path="/employee/view/:id"
                      element={<EmployeeView />}
                    />

                    {/* Student */}
                    <Route path="/student" element={<Student />} />
                    <Route path="/student/add" element={<StudentAdd />} />
                    <Route path="/student/edit/:id" element={<StudentEdit />} />
                    <Route path="/student/view/:id" element={<StudentView />} />

                    {/* Subject */}
                    <Route path="/subject" element={<Subject />} />
                    <Route path="/subject/add" element={<SubjectAdd />} />
                    <Route path="/subject/edit" element={<SubjectEdit />} />
                    <Route path="/subject/view/:id" element={<SubjectView />} />

                    {/* Topic  */}
                    <Route path="/topic" element={<Topic />} />
                    <Route path="/topic/add" element={<TopicAdd />} />
                    <Route path="/topic/edit" element={<TopicEdit />} />
                    <Route path="/topic/view" element={<TopicView />} />

                    {/* Question  */}
                    <Route path="/question" element={<Question />} />
                    <Route path="/question/add" element={<QuestionAdd />} />
                    <Route
                      path="/question/edit/:id"
                      element={<QuestionEdit />}
                    />
                    <Route
                      path="/question/view/:id"
                      element={<QuestionView />}
                    />

                    {/* Answer  */}
                    <Route path="/answer" element={<Answer />} />

                    {/* School  */}
                    <Route path="/school" element={<School />} />

                    {/* Roll  */}
                    <Route path="/role" element={<Role />} />

                    {/* Work Sheet  */}
                    <Route path="/worksheet" element={<WorkSheet />} />
                    <Route path="/worksheet/add" element={<WorkSheetAdd />} />
                    <Route
                      path="/worksheet/edit/:id"
                      element={<WorkSheetEdit />}
                    />
                    <Route
                      path="/worksheet/view/:id"
                      element={<WorkSheetView />}
                    />
                    <Route path="/doassessment" element={<DoAssessment />} />
                    <Route
                      path="/homedoassessment"
                      element={<HomeDoAssessment />}
                    />
                    <Route path="/successfull" element={<Successfull />} />
                    <Route
                      path="/homesuccessfull"
                      element={<HomeSuccessfull />}
                    />

                    {/* Home Work  */}
                    <Route path="/homework" element={<Homework />} />
                    <Route path="/homework/add" element={<HomeworkAdd />} />
                    <Route
                      path="/homework/edit/:id"
                      element={<HomeworkEdit />}
                    />
                    <Route
                      path="/homework/view/:id"
                      element={<HomeworkView />}
                    />

                    {/* Challenges  */}
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenges/add" element={<ChallengesAdd />} />
                    <Route
                      path="/challenges/edit/:id"
                      element={<ChallengesEdit />}
                    />
                    <Route
                      path="/challenges/view/:id"
                      element={<ChallengesView />}
                    />

                    {/*  rewards  */}
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/reward/add" element={<RewardAdd />} />
                    <Route path="/reward/edit/:id" element={<RewardEdit />} />
                    <Route path="/reward/view/:id" element={<RewardView />} />

                    {/* Subscriptions  */}
                    <Route path="/subscription" element={<Subscriptions />} />
                    <Route
                      path="/subscription/add"
                      element={<SubscriptionAdd />}
                    />
                    <Route
                      path="/subscription/edit/:id"
                      element={<SubscriptionEdit />}
                    />
                    <Route
                      path="/subscription/view/:id"
                      element={<SubscriptionView />}
                    />

                    {/* Profile   */}
                    <Route path="/settings" element={<Settings />} />

                    <Route
                      path="/role_permission"
                      element={<RolePermission />}
                    />
                  </Routes>
                </div>
                <AdminFooter />
              </main>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

Admin.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Admin;
