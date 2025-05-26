'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LoanDetailHeader from './components/LoanDetailHeader';
import PersonalInformationCard from './components/PersonalInformationCard';
import EmploymentInformationCard from './components/EmploymentInformationCard';
import LoanDetailsCard from './components/LoanDetailsCard';
import ApplicationSummaryCard from './components/ApplicationSummaryCard';
import FinancialOverviewCard from './components/FinancialOverviewCard';
import QuickActionsCard from './components/QuickActionsCard';
import ApprovalModal from '../ApprovalModal';
import { RejectModal } from '../RejectModal';
import { mockLoans } from '../data/mockData';
import { createLoanTypesHook } from '../utils/loanUtils';

export default function LoanDetailPage() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Get loan types (will be replaced with API hook later)
  const { data: loanTypes } = createLoanTypesHook();
  console.log('data', loanTypes);

  useEffect(() => {
    const loanData = mockLoans.find((l) => l.id === parseInt(id));
    setLoan(loanData);
  }, [id]);

  const handleApprove = (loanId) => {
    setLoan((prev) => ({ ...prev, status: 'approved', loan_holder: true }));
    setShowApprovalModal(false);
    console.log(`Loan ${loanId} approved`);
  };

  const handleReject = (loanId) => {
    setLoan((prev) => ({ ...prev, status: 'rejected', loan_holder: false }));
    setShowRejectModal(false);
    console.log(`Loan ${loanId} rejected`);
  };

  if (!loan) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center space-x-4'>
          <h1 className='text-3xl font-bold text-foreground'>Loan Not Found</h1>
          <p className='text-muted-foreground mt-1'>
            The requested loan could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <LoanDetailHeader
        loan={loan}
        loanTypes={loanTypes}
        onApprove={() => setShowApprovalModal(true)}
        onReject={() => setShowRejectModal(true)}
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <PersonalInformationCard loan={loan} />
          <EmploymentInformationCard loan={loan} />
          <LoanDetailsCard loan={loan} loanTypes={loanTypes} />
        </div>

        <div className='space-y-6'>
          <ApplicationSummaryCard loan={loan} loanTypes={loanTypes} />
          <FinancialOverviewCard loan={loan} />
          <QuickActionsCard
            loan={loan}
            onApprove={() => setShowApprovalModal(true)}
            onReject={() => setShowRejectModal(true)}
          />
        </div>
      </div>

      {showApprovalModal && (
        <ApprovalModal
          loan={loan}
          onClose={() => setShowApprovalModal(false)}
          onApprove={handleApprove}
        />
      )}

      {showRejectModal && (
        <RejectModal
          loan={loan}
          onClose={() => setShowRejectModal(false)}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
