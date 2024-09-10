'use client';

import React, { useState } from 'react';
import ContactModal from './ContactModal';

const AutomateButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        className="mt-5 px-8 py-3 bg-[#6200ea] text-white border-none rounded-full text-2xl cursor-pointer"
        onClick={openModal}
      >
        automate it
      </button>
      {isModalOpen && <ContactModal onClose={closeModal} />}
    </>
  );
};

export default AutomateButton;