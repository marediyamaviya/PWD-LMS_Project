import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import CreateTrainer from './pages/admin/CreateTrainer'
import CreateCoordinator from './pages/admin/CreateCoordinator'
import CourseManagement from './pages/admin/CourseManagement'
import CreateCourse from './pages/admin/CreateCourse'
import MyCourses from './pages/trainer/MyCourses'
import CandidateDashboard from './pages/admin/candidate/CandidateDashboard'
import CandidateCourses from './pages/admin/candidate/CandidateCourses'
import CandidateCourseDetails from './pages/admin/candidate/CandidateCourseDetails'
import CandidateNewCourses from './pages/admin/candidate/CandidateNewCourses'
import CandidateAttendance from './pages/admin/candidate/CandidateAttendance'
import CandidateQuizzes from './pages/admin/candidate/CandidateQuizzes'
import EditCourse from './pages/admin/EditCourse'
import Assessment from './pages/Assessment'
import ManageAssessment from './pages/ManageAssessment'
import CourseQuizzes from './pages/CourseQuizzes'
import Candidates from './pages/Candidates'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const dashboardByRole = {
  ADMIN: "/admin/dashboard",
  TRAINER: "/trainer/dashboard",
  CANDIDATE: "/candidate/dashboard",
};

function ProtectedRoute({ allowedRole, allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const roles = allowedRoles || (allowedRole ? [allowedRole] : []);

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(role)) {
    return <Navigate to={dashboardByRole[role] || "/login"} replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    return <Navigate to={dashboardByRole[role] || "/login"} replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute allowedRole="TRAINER">
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-trainer"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <CreateTrainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-coordinator"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <CreateCoordinator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-course"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/courses"
            element={
              <ProtectedRoute allowedRole="TRAINER">
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/courses/:courseId"
            element={
              <ProtectedRoute allowedRole="TRAINER">
                <CourseQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/candidates"
            element={
              <ProtectedRoute allowedRole="TRAINER">
                <Candidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRole="CANDIDATE">
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/courses"
            element={
              <ProtectedRoute allowedRole="CANDIDATE">
                <CandidateCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/course/:courseId"
            element={
              <ProtectedRoute allowedRole="CANDIDATE">
                <CandidateCourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/new-courses"
            element={
              <ProtectedRoute allowedRole="CANDIDATE">
                <CandidateNewCourses />
              </ProtectedRoute>
            }
          />
          {/* [Commented out - Attendance]
          <Route
            path="/candidate/attendance"
            element={
              <ProtectedRoute allowedRole="CANDIDATE">
                <CandidateAttendance />
              </ProtectedRoute>
            }
          />
          */}
          <Route
            path="/candidate/quizzes"
            element={
              <ProtectedRoute allowedRole="CANDIDATE">
                <CandidateQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-course/:courseId"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <EditCourse />
              </ProtectedRoute>
            }
          />  
          <Route
            path="/admin/courses/:courseId"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <CourseQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <Candidates />
              </ProtectedRoute>
            }
          />  
          <Route
            path="/assessment/manage"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "TRAINER"]}>
                <ManageAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/assessment"
            element={
              <ProtectedRoute allowedRole="CANDIDATE">
                <Assessment />
              </ProtectedRoute>
            }
          />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App