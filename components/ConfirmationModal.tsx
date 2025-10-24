import React from 'react';

type ConfirmationModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-emerald-600 hover:bg-emerald-500',
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm p-6 text-gray-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Confirmation Required</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
