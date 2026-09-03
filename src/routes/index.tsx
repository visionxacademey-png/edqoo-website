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

// Resource/Blogs Pages
const Resources = React.lazy(() => import('../pages/Blog').then(module => ({ default: module.Resources })));
const ResourceDetails = React.lazy(() => import('../pages/Blog').then(module => ({ default: module.ResourceDetails })));

// Dashboard Subviews
const Dashboard = React.lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const MyEnquiries = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.MyEnquiries })));
const Settings = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.Settings })));
const AdminLeadManagement = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.AdminLeadManagement })));

// Reusable Loading Skeleton for Suspense Fallbacks
const SuspenseLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center">
    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
    <span className="text-xs text-slate-400 font-semibold uppercase">Loading Page...</span>
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
        </Route>

        {/* Secure User Profile & Enquiry Dashboard Area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="enquiries" element={<MyEnquiries />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin-leads" element={<AdminLeadManagement />} />
            
            {/* Legacy LMS route fallbacks redirected to enquiries & dashboard */}
            <Route path="my-courses" element={<Navigate to="/dashboard/enquiries" replace />} />
            <Route path="progress" element={<Navigate to="/dashboard/enquiries" replace />} />
            <Route path="certificates" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Global Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
