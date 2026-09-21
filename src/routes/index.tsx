import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Guard components
import { ProtectedRoute, PublicRoute, AdminRoute } from '../components/common/RouteGuards';

// Public & Info Pages
const Home = React.lazy(() => import('../pages/Home').then(module => ({ default: module.Home })));
const Courses = React.lazy(() => import('../pages/Courses').then(module => ({ default: module.Courses })));
const CourseDetails = React.lazy(() => import('../pages/CourseDetails').then(module => ({ default: module.CourseDetails })));
const About = React.lazy(() => import('../pages/About').then(module => ({ default: module.About })));
const Contact = React.lazy(() => import('../pages/Contact').then(module => ({ default: module.Contact })));
const TermsAndConditions = React.lazy(() => import('../pages/TermsAndConditions').then(module => ({ default: module.TermsAndConditions })));
const PrivacyPolicy = React.lazy(() => import('../pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const Instructors = React.lazy(() => import('../pages/Instructors').then(module => ({ default: module.Instructors })));
const InstructorDetail = React.lazy(() => import('../pages/Instructors/InstructorDetail').then(module => ({ default: module.InstructorDetail })));

// 4 New Professional Pages
const HireFromUs = React.lazy(() => import('../pages/HireFromUs').then(module => ({ default: module.HireFromUs })));
const BecomeInstructor = React.lazy(() => import('../pages/BecomeInstructor').then(module => ({ default: module.BecomeInstructor })));
const BecomePartner = React.lazy(() => import('../pages/BecomePartner').then(module => ({ default: module.BecomePartner })));
const LeadershipCouncil = React.lazy(() => import('../pages/LeadershipCouncil').then(module => ({ default: module.LeadershipCouncil })));

// Auth Pages
const Login = React.lazy(() => import('../pages/Login').then(module => ({ default: module.Login })));
const Register = React.lazy(() => import('../pages/Register').then(module => ({ default: module.Register })));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));

// Dashboard Subviews
const Dashboard = React.lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const MyEnquiries = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.MyEnquiries })));
const Settings = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.Settings })));
const AdminLeadManagement = React.lazy(() => import('../pages/Dashboard/DashboardViews').then(module => ({ default: module.AdminLeadManagement })));

// Admin Console Pages
const AdminOverview = React.lazy(() => import('../pages/Admin/AdminOverview').then(module => ({ default: module.AdminOverview })));
const AdminUsers = React.lazy(() => import('../pages/Admin/AdminUsers').then(module => ({ default: module.AdminUsers })));
const AdminCourses = React.lazy(() => import('../pages/Admin/AdminCourses').then(module => ({ default: module.AdminCourses })));
const AdminCourseForm = React.lazy(() => import('../pages/Admin/AdminCourseForm').then(module => ({ default: module.AdminCourseForm })));
const AdminInstructors = React.lazy(() => import('../pages/Admin/AdminInstructors').then(module => ({ default: module.AdminInstructors })));
const AdminInstructorForm = React.lazy(() => import('../pages/Admin/AdminInstructorForm').then(module => ({ default: module.AdminInstructorForm })));
const AdminLeads = React.lazy(() => import('../pages/Admin/AdminLeads').then(module => ({ default: module.AdminLeads })));
const AdminHiringRequests = React.lazy(() => import('../pages/Admin/AdminHiringRequests').then(module => ({ default: module.AdminHiringRequests })));
const AdminInstructorApplications = React.lazy(() => import('../pages/Admin/AdminInstructorApplications').then(module => ({ default: module.AdminInstructorApplications })));
const AdminPartnerRequests = React.lazy(() => import('../pages/Admin/AdminPartnerRequests').then(module => ({ default: module.AdminPartnerRequests })));
const AdminLeadership = React.lazy(() => import('../pages/Admin/AdminLeadership').then(module => ({ default: module.AdminLeadership })));
const AdminLeadershipForm = React.lazy(() => import('../pages/Admin/AdminLeadershipForm').then(module => ({ default: module.AdminLeadershipForm })));

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
          <Route path="/free-learning/:slug" element={<CourseDetails />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/instructors/:id" element={<InstructorDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          
          {/* 4 Dedicated Professional Routes */}
          <Route path="/hire-from-us" element={<HireFromUs />} />
          <Route path="/become-an-instructor" element={<BecomeInstructor />} />
          <Route path="/become-a-partner" element={<BecomePartner />} />
          <Route path="/leadership-council" element={<LeadershipCouncil />} />
          
          {/* Resources / Blog fallbacks redirected to Courses */}
          <Route path="/resources" element={<Navigate to="/courses" replace />} />
          <Route path="/resources/*" element={<Navigate to="/courses" replace />} />
          <Route path="/blog" element={<Navigate to="/courses" replace />} />
          <Route path="/blog/*" element={<Navigate to="/courses" replace />} />
          
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

        {/* Secure High-Privilege Admin Portal Area */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/new" element={<AdminCourseForm />} />
            <Route path="courses/edit/:id" element={<AdminCourseForm />} />
            <Route path="instructors" element={<AdminInstructors />} />
            <Route path="instructors/new" element={<AdminInstructorForm />} />
            <Route path="instructors/edit/:id" element={<AdminInstructorForm />} />
            <Route path="leadership" element={<AdminLeadership />} />
            <Route path="leadership/new" element={<AdminLeadershipForm />} />
            <Route path="leadership/edit/:id" element={<AdminLeadershipForm />} />
            <Route path="hiring" element={<AdminHiringRequests />} />
            <Route path="instructor-applications" element={<AdminInstructorApplications />} />
            <Route path="partners" element={<AdminPartnerRequests />} />
            <Route path="leads" element={<AdminLeads />} />
          </Route>
        </Route>

        {/* Global Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
