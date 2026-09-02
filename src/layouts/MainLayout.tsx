import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FloatingSupport } from '../components/ui/FloatingSupport';
import { EnquiryModal } from '../components/ui/EnquiryModal';
import { motion } from 'framer-motion';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Navbar */}
      <Navbar />

      {/* Page Content wrapper with Framer Motion transitions */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-grow pt-[64px]" // Offset for sticky navbar
      >
        <Outlet />
      </motion.main>

      {/* Global Advisory / Enquiry Modal */}
      <EnquiryModal />

      {/* Floating Customer Helpdesk */}
      <FloatingSupport />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
