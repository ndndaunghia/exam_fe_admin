import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TableUsers from './pages/Tables/TableUsers';
import TableCourses from './pages/Tables/TableCourses';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import ProtectedRoute from './components/ProtectectedRoute';
import { TableSubjects } from './pages/Tables/TableSubjects';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

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
        {/* Public Routes */}
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />

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
          path="/tables/tables-courses"
          element={
            <ProtectedRoute>
              <PageTitle title="Tables Courses" />
              <TableCourses />
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
