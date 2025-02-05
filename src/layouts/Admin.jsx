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
                    <Route path="/gradeAdd" element={<GradeAdd />} />
                    <Route path="/gradeEdit" element={<GradeEdit />} />
                    <Route path="/gradeView" element={<GradeView />} />

                    {/* Student */}
                    <Route path="/student" element={<Student />} />
                    <Route path="/studentAdd" element={<StudentAdd />} />
                    <Route path="/studentEdit" element={<StudentEdit />} />
                    <Route path="/studentView" element={<StudentView />} />

                    {/* Subject */}
                    <Route path="/subject" element={<Subject />} />
                    <Route path="/subjectAdd" element={<SubjectAdd />} />
                    <Route path="/subjectEdit" element={<SubjectEdit />} />
                    <Route path="/subjectView" element={<SubjectView />} />

                    {/* Topic  */}
                    <Route path="/topic" element={<Topic />} />
                    <Route path="/topicAdd" element={<TopicAdd />} />
                    <Route path="/topicEdit" element={<TopicEdit />} />
                    <Route path="/topicView" element={<TopicView />} />

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

                    {/* Challenges  */}
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenges/add" element={<ChallengesAdd />} />
                    <Route path="/challenges/edit" element={<ChallengesEdit />} />
                    <Route path="/challenges/view" element={<ChallengesView />} />
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
