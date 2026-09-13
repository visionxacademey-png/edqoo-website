import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface EnquiryOptions {
  category?: string;
  courseId?: string;
  categories?: string[];
}

interface EnquiryContextType {
  isEnquiryModalOpen: boolean;
  selectedProgram: string;
  selectedCategory: string;
  selectedCourseId: string;
  openEnquiryModal: (program?: string, options?: EnquiryOptions | string) => void;
  closeEnquiryModal: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export const EnquiryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const openEnquiryModal = (program?: string, options?: EnquiryOptions | string) => {
    setSelectedProgram(program || '');
    if (typeof options === 'string') {
      setSelectedCategory(options);
      setSelectedCourseId('');
    } else if (options && typeof options === 'object') {
      setSelectedCategory(options.category || '');
      setSelectedCourseId(options.courseId || '');
    } else {
      setSelectedCategory('');
      setSelectedCourseId('');
    }
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
  };

  return (
    <EnquiryContext.Provider
      value={{
        isEnquiryModalOpen,
        selectedProgram,
        selectedCategory,
        selectedCourseId,
        openEnquiryModal,
        closeEnquiryModal
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
};
