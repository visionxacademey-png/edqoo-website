import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Guard components
import { ProtectedRoute, PublicRoute } from '../components/common/RouteGuards';

// Lazy Loaded Pages to optimize bundle size
const Home = React.lazy(() => import('../pages/Home').then(module => ({ default: module.Home })));
const Courses = React.lazy(() => import('../pages/Courses').then(module => ({ default: module.Courses })));
const CourseDetails = React.lazy(() => import('../pages/CourseDetails').then(module => ({ default: module.CourseDetails })));
const About = React.lazy(() => import('../pages/About').then(module => ({ default: module.About })));
const Contact = React.lazy(() => import('../pages/Contact').then(module => ({ default: module.Contact })));

// Auth Pages
const Login = React.lazy(() => import('../pages/Login').then(module => ({ default: module.Login })));
const Register = React.lazy(() => import('../pages/Register').then(module => ({ default: module.Register })));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));

// Checkout & LMS Pages
const Checkout = React.lazy(() => import('../pages/Checkout').then(module => ({ default: module.Checkout })));
const Learning = React.lazy(() => import('../pages/Learning').then(module => ({ default: module.Learning })));

// Resource/Blogs Pages
const Resources = React.lazy(() => import('../pages/Blog').then(module => ({ default: module.Resources })));
const ResourceDetails = React.lazy(() => import('../pages/Blog').then(module => ({ default: module.ResourceDetails })));

// Dashboard Subviews
const Dashboard = React.lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const MyCourses = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.MyCourses })));
const ProgressTracking = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.ProgressTracking })));
const Certificates = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.Certificates })));
const Settings = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.Settings })));

// Reusable Loading Skeleton for Suspense Fallbacks
const SuspenseLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center">
    <Loader2 className="w-8 h-8 text-royal-blue-900 animate-spin mb-2" />
    <span className="text-xs text-slate-400 font-semibold uppercase">Loading Workspace...</span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        {/* Public Website routes (Header + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ResourceDetails />} />
          
          {/* Categories index page defaults back to Courses listings */}
          <Route path="/categories" element={<Navigate to="/courses" replace />} />
          
          {/* Guest Only Routes (Login/Register/Recovery) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Secure Route: Checkout checkout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout/:courseId" element={<Checkout />} />
          </Route>
        </Route>

        {/* Secure LMS Dashboard Area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="progress" element={<ProgressTracking />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Standalone secure video learning page */}
          <Route path="/dashboard/learn/:courseId/:lessonId" element={<Learning />} />
        </Route>

        {/* Global Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
