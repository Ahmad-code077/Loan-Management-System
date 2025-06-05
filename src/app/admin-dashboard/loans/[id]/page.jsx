'use client';

import { useState } from 'react';
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
import {
  useGetLoanDetailsQuery,
  useGetLoanTypesQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
} from '@/lib/store/authApi';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiArrowLeft,
} from 'react-icons/fi';
import Link from 'next/link';

export default function LoanDetailPage() {
  const { id } = useParams();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { toast } = useToast();

  // API hooks
  const {
    data: loan,
    isLoading: loanLoading,
    error: loanError,
    refetch: refetchLoan,
  } = useGetLoanDetailsQuery(id);

  const { data: loanTypes = [], isLoading: loanTypesLoading } =
    useGetLoanTypesQuery();

  const [approveLoan, { isLoading: approvingLoan }] = useApproveLoanMutation();
  const [rejectLoan, { isLoading: rejectingLoan }] = useRejectLoanMutation();

  const handleApprove = async (loanId) => {
    try {
      await approveLoan(loanId).unwrap();

      toast({
        title: 'Loan Approved',
        description: `Loan #${loanId} has been successfully approved.`,
        variant: 'default',
      });

      setShowApprovalModal(false);

      // Refetch loan details to get updated data
      refetchLoan();
    } catch (error) {
      console.error('Failed to approve loan:', error);

      toast({
        title: 'Approval Failed',
        description:
          error?.data?.message || 'Failed to approve loan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (loanId, reason) => {
    try {
      await rejectLoan({ id: loanId, reason }).unwrap();

      toast({
        title: 'Loan Rejected',
        description: `Loan #${loanId} has been rejected.`,
        variant: 'default',
      });

      setShowRejectModal(false);

      // Refetch loan details to get updated data
      refetchLoan();
    } catch (error) {
      console.error('Failed to reject loan:', error);

      toast({
        title: 'Rejection Failed',
        description:
          error?.data?.message || 'Failed to reject loan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (loanLoading || loanTypesLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin-dashboard/loans'>
            <Button variant='outline' size='sm'>
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Loans
            </Button>
          </Link>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiLoader className='w-8 h-8 animate-spin text-primary mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>
                Loading Loan Details...
              </h3>
              <p className='text-muted-foreground'>
                Please wait while we fetch the loan information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (loanError) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin-dashboard/loans'>
            <Button variant='outline' size='sm'>
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Loans
            </Button>
          </Link>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiAlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2 text-red-600'>
                Failed to Load Loan
              </h3>
              <p className='text-muted-foreground mb-4'>
                {loanError?.data?.message || loanError?.status === 404
                  ? 'The requested loan could not be found.'
                  : 'Something went wrong while fetching loan details.'}
              </p>
              <div className='flex gap-2 justify-center'>
                <Button onClick={() => refetchLoan()} variant='outline'>
                  <FiRefreshCw className='w-4 h-4 mr-2' />
                  Try Again
                </Button>
                <Link href='/admin-dashboard/loans'>
                  <Button>Back to Loans List</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loan not found
  if (!loan) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin-dashboard/loans'>
            <Button variant='outline' size='sm'>
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Loans
            </Button>
          </Link>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiAlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Loan Not Found</h3>
              <p className='text-muted-foreground mb-4'>
                The requested loan with ID #{id} could not be found.
              </p>
              <Link href='/admin-dashboard/loans'>
                <Button>Back to Loans List</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
        isApproving={approvingLoan}
        isRejecting={rejectingLoan}
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
            isApproving={approvingLoan}
            isRejecting={rejectingLoan}
          />
        </div>
      </div>

      {/* Loading overlay for actions */}
      {(approvingLoan || rejectingLoan) && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg flex items-center space-x-3'>
            <FiLoader className='w-6 h-6 animate-spin text-primary' />
            <span className='text-lg'>
              {approvingLoan ? 'Approving loan...' : 'Rejecting loan...'}
            </span>
          </div>
        </div>
      )}

      {/* Modals */}
      {showApprovalModal && (
        <ApprovalModal
          loan={loan}
          onClose={() => setShowApprovalModal(false)}
          onApprove={handleApprove}
          isLoading={approvingLoan}
        />
      )}

      {showRejectModal && (
        <RejectModal
          loan={loan}
          onClose={() => setShowRejectModal(false)}
          onReject={handleReject}
          isLoading={rejectingLoan}
        />
      )}
    </div>
  );
}
