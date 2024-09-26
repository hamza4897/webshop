import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa'; 

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-lg mx-auto">
        <span
          className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </span>
        <div className="flex items-center mb-4">
          <FaExclamationCircle className="text-yellow-500 w-8 h-8 mr-2" />
          <h2 className="text-lg font-bold text-gray-800">Note :</h2>
        </div>
        <p className="text-gray-700 text-center">{message}</p>
      </div>
    </div>
  );
};

export default Popup;
