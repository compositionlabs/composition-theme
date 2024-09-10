'use client';

import React, { useState } from 'react';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('idle');
    try {
      console.log('Submitting form data:', formData);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 3000);
      } else {
        console.error('Server responded with an error:', data.error);
        console.error('Error details:', data.details);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      setSubmitStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg text-black">
        <button onClick={onClose} className="float-right text-xl text-black">&times;</button>
        <h2 className="text-2xl mb-4 text-black">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full p-2 mb-4 border rounded text-black"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-2 mb-4 border rounded text-black"
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Message"
            required
            className="w-full p-2 mb-4 border rounded text-black"
            onChange={handleChange}
          ></textarea>
          <button type="submit" className="w-full p-2 bg-black text-white rounded">Submit</button>
        </form>
        {submitStatus === 'success' && (
          <p className="mt-4 text-green-600">Message sent successfully!</p>
        )}
        {submitStatus === 'error' && (
          <p className="mt-4 text-red-600">Error sending message. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default ContactModal;