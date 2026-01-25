'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ReceiptTypeCard from './components/ReceiptTypeCard';

export default function ReceiptTypeSelectionPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'physiotherapy' | 'pilates' | null>(null);

  const handleTypeSelect = (type: 'physiotherapy' | 'pilates') => {
    setSelectedType(type);
    // Navigate to the appropriate form
    if (type === 'physiotherapy') {
      router.push('/physiotherapy-receipt-form');
    } else {
      router.push('/pilates-receipt-form');
    }
  };

  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create New Receipt
            </h1>
            <p className="text-xl text-gray-600">
              Select the type of receipt you would like to generate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ReceiptTypeCard
              type="physiotherapy"
              title="Physiotherapy Receipt"
              description="Generate detailed receipts for physiotherapy treatments and sessions"
              icon="DocumentTextIcon"
              isSelected={selectedType === 'physiotherapy'}
              onClick={() => handleTypeSelect('physiotherapy')}
            />
            <ReceiptTypeCard
              type="pilates"
              title="Pilates Receipt"
              description="Create receipts for Pilates classes and membership packages"
              icon="ClockIcon"
              isSelected={selectedType === 'pilates'}
              onClick={() => handleTypeSelect('pilates')}
            />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}