'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ReceiptTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptTypeModal({ isOpen, onClose }: ReceiptTypeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleTypeSelect = (type: 'physiotherapy' | 'pilates') => {
    onClose();
    if (type === 'physiotherapy') {
      router.push('/physiotherapy-receipt-form');
    } else {
      router.push('/pilates-receipt-form');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl transform transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Select Receipt Type</h2>
            <p className="mt-2 text-sm text-gray-600">Choose the type of receipt you want to create</p>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Physiotherapy Receipt */}
            <button
              onClick={() => handleTypeSelect('physiotherapy')}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Physiotherapy Receipt
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                For individual physiotherapy sessions and treatments
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                Create Receipt
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Pilates Receipt */}
            <button
              onClick={() => handleTypeSelect('pilates')}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                  <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Pilates Receipt
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                For pilates memberships and class packages
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                Create Receipt
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <p className="text-xs text-gray-500 text-center">
              Select the appropriate receipt type for your client
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}