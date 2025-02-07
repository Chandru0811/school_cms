import PropTypes from "prop-types";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import StudentSideBar from "../components/Student/StudentSideBar";
import StudentHeader from "../components/Student/StudentHeader";
import StudentFooter from "../components/Student/StudentFooter";
import Profile from "../pages/student/Profile/Profile";
import Worksheet from "../pages/student/Worksheet/Worksheet";
import WorksheetAdd from "../pages/student/Worksheet/WorksheetAdd";
import WorksheetEdit from "../pages/student/Worksheet/WorksheetEdit";
import WorksheetView from "../pages/student/Worksheet/WorksheetView";
import Homework from "../pages/student/Homework/Homework";
import HomeworkAdd from "../pages/student/Homework/HomeworkAdd";
import HomeworkEdit from "../pages/student/Homework/HomeworkEdit";
import HomeworkView from "../pages/student/Homework/HomeworkView";
import Challenges from "../pages/student/Challenges/Challenges";
import ChallengesAdd from "../pages/student/Challenges/ChallengesAdd";
import ChallengesEdit from "../pages/student/Challenges/ChallengesEdit";
import ChallengesView from "../pages/student/Challenges/ChallengesView";
import Rewards from "../pages/student/Rewards/Rewards";
import RewardAdd from "../pages/student/Rewards/RewardAdd";
import RewardEdit from "../pages/student/Rewards/RewardEdit";
import RewardView from "../pages/student/Rewards/RewardView";

function Student({ handleLogout }) {
  return (
    <div>
      <div>
        <BrowserRouter basename="/schoolCms">
          <div className="d-flex flex-column flex-lg-row bg-surface-secondary ">
            <StudentSideBar />

            <div className="flex-grow-1 h-screen overflow-y-lg-auto">
              <StudentHeader handleLogout={handleLogout} />
              <main className="pt-2 bg-surface-secondary">
                <div className="px-2" style={{ minHeight: "80vh" }}>
                  <Routes>
                    <Route path="/" element={<SuperAdminDashboard />} />
                    <Route path="*" element={<SuperAdminDashboard />} />

                    {/* Profile  */}
                    <Route path="/profile" element={<Profile />} />

                    {/* Worksheet  */}
                    <Route path="/worksheet" element={<Worksheet />} />
                    <Route path="/worksheet/Add" element={<WorksheetAdd />} />
                    <Route path="/worksheet/edit" element={<WorksheetEdit />} />
                    <Route path="/worksheet/view" element={<WorksheetView />} />

                    {/* Homework  */}
                    <Route path="/homework" element={<Homework />} />
                    <Route path="/homework/add" element={<HomeworkAdd />} />
                    <Route path="/homework/edit" element={<HomeworkEdit />} />
                    <Route path="/homework/view" element={<HomeworkView />} />

                    {/* Challenges  */}
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenges/add" element={<ChallengesAdd />} />
                    <Route
                      path="/challenges/edit"
                      element={<ChallengesEdit />}
                    />
                    <Route
                      path="/challenges/view"
                      element={<ChallengesView />}
                    />

                    {/*  rewards  */}
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/reward/add" element={<RewardAdd />} />
                    <Route path="/reward/edit" element={<RewardEdit />} />
                    <Route path="/reward/view" element={<RewardView />} />
                  </Routes>
                </div>
                <StudentFooter />
              </main>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

Student.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Student;
