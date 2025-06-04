'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  useGetUserLoansQuery,
  useGetLoanTypesQuery,
} from '@/lib/store/authApi';
import {
  FiDollarSign,
  FiCalendar,
  FiAlertCircle,
  FiPlus,
  FiRefreshCw,
  FiEye,
  FiClock,
  FiTarget,
  FiCreditCard,
} from 'react-icons/fi';
import Link from 'next/link';

export default function LoanList() {
  const {
    data: loans = [],
    isLoading,
    error,
    refetch,
  } = useGetUserLoansQuery();

  const { data: loanTypes = [] } = useGetLoanTypesQuery();

  // Get loan type name by ID
  const getLoanTypeName = (loanTypeId) => {
    const loanType = loanTypes.find((type) => type.id === loanTypeId);
    return loanType ? loanType.name : `Loan Type ${loanTypeId}`;
  };

  // Get status badge style and icon
  const getStatusBadge = (status) => {
    const statusStyles = {
      approved: {
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <FiDollarSign className='w-3 h-3 mr-1' />,
      },
      pending: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <FiClock className='w-3 h-3 mr-1' />,
      },
      rejected: {
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <FiAlertCircle className='w-3 h-3 mr-1' />,
      },
      active: {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FiCreditCard className='w-3 h-3 mr-1' />,
      },
      completed: {
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <FiTarget className='w-3 h-3 mr-1' />,
      },
    };

    const statusConfig = statusStyles[status] || statusStyles.pending;

    return (
      <Badge className={statusConfig.className}>
        {statusConfig.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='text-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3'></div>
        <div className='text-muted-foreground'>Loading your loans...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='text-center py-8'>
        <div className='flex items-center justify-center gap-2 text-red-600 mb-3'>
          <FiAlertCircle className='w-5 h-5' />
          <span>Failed to load loans</span>
        </div>
        <p className='text-sm text-muted-foreground mb-4'>
          {error?.data?.message ||
            'Something went wrong while fetching your loans.'}
        </p>
        <Button
          variant='outline'
          size='sm'
          onClick={() => refetch()}
          className='mr-2'
        >
          <FiRefreshCw className='w-4 h-4 mr-1' />
          Try Again
        </Button>
        <Link href='/apply-loan'>
          <Button size='sm'>
            <FiPlus className='w-4 h-4 mr-1' />
            Apply for Loan
          </Button>
        </Link>
      </div>
    );
  }

  // Empty state
  if (!loans || loans.length === 0) {
    return (
      <div className='text-center py-8'>
        <FiDollarSign className='w-16 h-16 text-gray-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          No loans found
        </h3>
        <p className='text-muted-foreground mb-4'>
          You haven&apos;t applied for any loans yet. Start your loan
          application to get the funding you need.
        </p>
        <Link href='/apply-loan'>
          <Button>
            <FiPlus className='w-4 h-4 mr-2' />
            Apply for Your First Loan
          </Button>
        </Link>
      </div>
    );
  }

  // Show only first 3 loans for dashboard
  const displayLoans = loans.slice(0, 3);

  return (
    <div className='space-y-4'>
      {displayLoans.map((loan) => (
        <Card
          key={loan.id}
          className='p-4 hover:shadow-md transition-all duration-200 border border-border'
        >
          {/* Header - Minimal Info */}
          <div className='flex justify-between items-start mb-3'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <FiDollarSign className='w-4 h-4 text-primary' />
                <h3 className='text-base font-semibold text-card-foreground'>
                  {getLoanTypeName(loan.loan_type)}
                </h3>
              </div>
              <p className='text-xs text-muted-foreground'>
                Loan ID: #{loan.id}
              </p>
            </div>
            <div className='flex flex-col items-end gap-1'>
              {getStatusBadge(loan.status)}
            </div>
          </div>

          {/* Key Information Grid */}
          <div className='grid grid-cols-2 gap-3 mb-3'>
            <div className='text-center p-2 bg-gray-50 rounded'>
              <p className='text-xs text-muted-foreground'>Amount</p>
              <p className='text-sm font-bold text-primary'>
                {formatCurrency(loan.amount)}
              </p>
            </div>
            <div className='text-center p-2 bg-gray-50 rounded'>
              <p className='text-xs text-muted-foreground'>Monthly EMI</p>
              <p className='text-sm font-bold text-green-600'>
                {formatCurrency(loan.monthly_installment)}
              </p>
            </div>
          </div>

          {/* Basic Details */}
          <div className='flex justify-between items-center text-xs text-muted-foreground mb-3'>
            <div className='flex items-center gap-1'>
              <FiCalendar className='w-3 h-3' />
              <span>{loan.duration} months</span>
            </div>
            <div className='flex items-center gap-1'>
              <FiTarget className='w-3 h-3' />
              <span>{loan.interest}% interest</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2'>
            <Link href={`/loans/${loan.id}`} className='flex-1'>
              <Button variant='outline' size='sm' className='w-full'>
                <FiEye className='w-3 h-3 mr-1' />
                View Details
              </Button>
            </Link>
          </div>

          {/* Quick Status Info */}
          {loan.status === 'approved' && (
            <div className='mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800'>
              ✅ Approved - Funds will be disbursed soon
            </div>
          )}
          {loan.status === 'pending' && (
            <div className='mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800'>
              ⏳ Under review - Please wait for approval
            </div>
          )}
          {loan.status === 'rejected' && (
            <div className='mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800'>
              ❌ Application was not approved
            </div>
          )}
        </Card>
      ))}

      {/* Show More Button if more than 3 loans */}
      {loans.length > 3 && (
        <div className='pt-2 border-t border-border'>
          <Link href='/loans'>
            <Button variant='outline' className='w-full'>
              <FiEye className='w-4 h-4 mr-2' />
              View All Loans ({loans.length})
            </Button>
          </Link>
        </div>
      )}

      {/* Apply for new loan button */}
      <div className='pt-2 border-t border-border'>
        <Link href='/apply-loan'>
          <Button variant='outline' className='w-full'>
            <FiPlus className='w-4 h-4 mr-2' />
            Apply for New Loan
          </Button>
        </Link>
      </div>
    </div>
  );
}
