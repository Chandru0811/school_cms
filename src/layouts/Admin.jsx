import PropTypes from "prop-types";
import AdminDashboard from "../pages/admin/AdminDashboard";
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

function Admin({ handleLogout }) {
  return (
    <div>
      <div>
        <BrowserRouter>
          <div className="d-flex flex-column flex-lg-row bg-surface-secondary ">
            <AdminSideBar />

            <div className="flex-grow-1 h-screen overflow-y-lg-auto">
              <AdminHeader handleLogout={handleLogout}/>
              <main className="pt-2" style={{ backgroundColor: "#f2f2f2" }}>
                <div style={{ minHeight: "90vh" }} className="px-2">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="*" element={<AdminDashboard />} />

                    {/* Center  */}
                    <Route path="/center" element={<Center />} />

                    {/* Grade */}
                    <Route path="/grade" element={<Grade />} />
                    <Route path="/grade/add" element={<GradeAdd />} />
                    <Route path="/grade/edit" element={<GradeEdit />} />
                    <Route path="/grade/view" element={<GradeView />} />

                    {/* Student */}
                    <Route path="/student" element={<Student />} />
                    <Route path="/student/add" element={<StudentAdd />} />
                    <Route path="/student/edit" element={<StudentEdit />} />
                    <Route path="/student/view" element={<StudentView />} />

                    {/* Subject */}
                    <Route path="/subject" element={<Subject />} />
                    <Route path="/subject/add" element={<SubjectAdd />} />
                    <Route path="/subject/edit" element={<SubjectEdit />} />
                    <Route path="/subject/view" element={<SubjectView />} />

                    {/* Topic  */}
                    <Route path="/topic" element={<Topic />} />
                    <Route path="/topic/add" element={<TopicAdd />} />
                    <Route path="/topic/edit" element={<TopicEdit />} />
                    <Route path="/topic/view" element={<TopicView />} />

                    {/* Question  */}
                    <Route path="/question" element={<Question />} />
                    <Route path="/question/add" element={<QuestionAdd />} />
                    <Route path="/question/edit" element={<QuestionEdit />} />
                    <Route path="/question/view" element={<QuestionView />} />

                    {/* Answer  */}
                    <Route path="/answer" element={<Answer />} />

                    {/* School  */}
                    <Route path="/school" element={<School />} />

                    {/* Roll  */}
                    <Route path="/role" element={<Role />} />

                    {/* Work Sheet  */}
                    <Route path="/worksheet" element={<WorkSheet />} />
                    <Route path="/worksheet/add" element={<WorkSheetAdd />} />
                    <Route path="/worksheet/edit" element={<WorkSheetEdit />} />
                    <Route path="/worksheet/view" element={<WorkSheetView />} />

                     {/* Home Work  */}
                     <Route path="/homework" element={<Homework />} />
                    <Route path="/homework/add" element={<HomeworkAdd />} />
                    <Route path="/homework/edit" element={<HomeworkEdit />} />
                    <Route path="/homework/view" element={<HomeworkView />} />

                    {/* Challenges  */}
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenges/add" element={<ChallengesAdd />} />
                    <Route path="/challenges/edit" element={<ChallengesEdit />} />
                    <Route path="/challenges/view" element={<ChallengesView />} />

                    {/*  rewards  */}
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/reward/add" element={<RewardAdd />} />
                    <Route path="/reward/edit" element={<RewardEdit />} />
                    <Route path="/reward/view" element={<RewardView />} />


                    {/* Subscriptions  */}
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/subscription/add" element={<SubscriptionAdd />} />
                    <Route path="/subscription/edit" element={<SubscriptionEdit />} />
                    <Route path="/subscription/view" element={<SubscriptionView />} />

                     {/* Profile   */}
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/role_permission" element={<RolePermission />} />
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
