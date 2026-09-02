import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface EnquiryContextType {
  isEnquiryModalOpen: boolean;
  selectedProgram: string;
  openEnquiryModal: (program?: string) => void;
  closeEnquiryModal: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export const EnquiryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');

  const openEnquiryModal = (program?: string) => {
    setSelectedProgram(program || '');
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
