import React, { FC } from 'react';
import { createPortal } from 'react-dom';

type LogoutDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutDialog: FC<LogoutDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  console.log("LogoutDialog render", { isOpen });
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
      style={{ minHeight: '100vh' }}
    >
      <div
        className="w-full max-w-sm p-6 mx-4 bg-white rounded-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 15px rgba(0,0,0,0.3)' }}
      >
        <h3 className="mb-4 text-lg font-semibold">Confirm Logout</h3>
        <p className="mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Logout button clicked inside dialog");
              if (typeof onConfirm === "function") onConfirm();
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 relative z-[9999] pointer-events-auto"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutDialog;
