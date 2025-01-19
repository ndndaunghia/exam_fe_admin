import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import TableUsers from './pages/Tables/TableUsers';
import TableCourses from './pages/Tables/TableCourses';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectectedRoute';
import { TableSubjects } from './pages/Tables/TableSubjects';
import { TableAuthors } from './pages/Tables/TableAuthors';
import { CourseDetail } from './pages/CourseDetail/CourseDetail';
import { TableExams } from './pages/Tables/TableExams';
import ExamDetail from './pages/ExamDetail';
import ExamHistoryTable from './pages/Tables/TableHistoryExam';
import PurchasedCoursesTable from './pages/Tables/PurchasedCourseTable';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        {/* Public Routes - bảo vệ bởi PublicRoute */}
        <Route
          path="/auth/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageTitle title="eCommerce Dashboard" />
              <ECommerce />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTitle title="Profile" />
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <PageTitle title="Calendar" />
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <ProtectedRoute>
              <PageTitle title="Form Elements" />
              <FormElements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <ProtectedRoute>
              <PageTitle title="Form Layout" />
              <FormLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables/tables-users"
          element={
            <ProtectedRoute>
              <PageTitle title="Tables Users" />
              <TableUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables/tables-authors"
          element={
            <ProtectedRoute>
              <PageTitle title="Tables Authors" />
              <TableAuthors />
            </ProtectedRoute>
          }
        />
          <Route
          path="/tables/tables-history-exams"
          element={
            <ProtectedRoute>
              <PageTitle title="History Exams" />
              <ExamHistoryTable />
            </ProtectedRoute>
          }
        />
           <Route
          path="/tables/tables-purchased-courses"
          element={
            <ProtectedRoute>
              <PageTitle title="Purchased Courses" />
              <PurchasedCoursesTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables/tables-courses"
          element={
            <ProtectedRoute>
              <PageTitle title="Tables Courses" />
              <TableCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables/tables-courses/:id"
          element={
            <ProtectedRoute>
              <PageTitle title="Tables Courses Detail" />
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables/tables-subjects"
          element={
            <ProtectedRoute>
              <PageTitle title="Tables Subjects" />
              <TableSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables/tables-exams"
          element={
            <ProtectedRoute>
              <PageTitle title="Tables Exams" />
              <TableExams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tables/tables-exams/:id"
          element={
            <ProtectedRoute>
              <PageTitle title="Tables Exams Detail" />
              <ExamDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTitle title="Settings" />
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chart"
          element={
            <ProtectedRoute>
              <PageTitle title="Basic Chart" />
              <Chart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <ProtectedRoute>
              <PageTitle title="Alerts" />
              <Alerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <ProtectedRoute>
              <PageTitle title="Buttons" />
              <Buttons />
            </ProtectedRoute>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
