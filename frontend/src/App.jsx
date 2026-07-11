import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast/Toast';
import Loader from './components/common/Loader/Loader';
import ProtectedRoute from './components/layout/ProtectedRoute/ProtectedRoute';

/* === Global CSS Imports === */
import './App.css';
import './components/common/common.css';
import './components/course/course.css';
import './components/ai/ai.css';
import './components/profile/profile.css';

/* === Layouts === */
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';

/* === Lazy Loaded Pages === */
// Public
const Landing = lazy(() => import('./pages/public/Landing'));
const Login = lazy(() => import('./pages/public/Login'));
const RegisterStudent = lazy(() => import('./pages/public/RegisterStudent'));
const RegisterInstructor = lazy(() => import('./pages/public/RegisterInstructor'));
const AccessDenied = lazy(() => import('./pages/public/AccessDenied'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Student
const Courses = lazy(() => import('./pages/student/Courses'));
const CourseDetail = lazy(() => import('./pages/student/CourseDetail'));
const LessonViewer = lazy(() => import('./pages/student/LessonViewer'));

// Instructor
const InstructorDashboard = lazy(() => import('./pages/instructor/InstructorDashboard'));
const CourseBuilder = lazy(() => import('./pages/instructor/CourseBuilder'));

// Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));

/* === Fallback Loading === */
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Loader rows={3} />
  </div>
);

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            
            {/* === PUBLIC ROUTES === */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/student" element={<RegisterStudent />} />
              <Route path="/register/instructor" element={<RegisterInstructor />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* === STUDENT ROUTES === */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route element={<AppLayout />}>
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/learn/:courseId/:lessonId" element={<LessonViewer />} />
              </Route>
            </Route>

            {/* === INSTRUCTOR ROUTES === */}
            <Route element={<ProtectedRoute allowedRoles={['INSTRUCTOR']} />}>
              <Route element={<AppLayout />}>
                <Route path="/instructor" element={<InstructorDashboard />} />
                <Route path="/instructor/courses/new" element={<CourseBuilder />} />
              </Route>
            </Route>

            {/* === ADMIN ROUTES === */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
}
