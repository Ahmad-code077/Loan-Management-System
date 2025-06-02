'use client';

import { useEffect, useState } from 'react';
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
  FiUser,
  FiCreditCard,
  FiAlertCircle,
  FiPlus,
  FiRefreshCw,
  FiMapPin,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiTarget,
  FiClock,
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  return (
    <div className='space-y-4'>
      {loans.map((loan) => (
        <Card
          key={loan.id}
          className='p-6 hover:shadow-lg transition-all duration-200 border border-border'
        >
          {/* Header */}
          <div className='flex justify-between items-start mb-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <FiDollarSign className='w-5 h-5 text-primary' />
                <div>
                  <h3 className='text-lg font-semibold text-card-foreground'>
                    {getLoanTypeName(loan.loan_type)}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Loan ID: #{loan.id}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-end gap-2'>
              {getStatusBadge(loan.status)}
              {loan.loan_holder && (
                <Badge
                  variant='outline'
                  className='text-xs bg-blue-50 text-blue-700 border-blue-200'
                >
                  Active Holder
                </Badge>
              )}
            </div>
          </div>

          {/* Loan Amount Info */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg'>
            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>Loan Amount</p>
              <p className='text-lg font-bold text-primary'>
                {formatCurrency(loan.amount)}
              </p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>Total Payable</p>
              <p className='text-lg font-bold text-orange-600'>
                {formatCurrency(loan.total_payable)}
              </p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>Monthly EMI</p>
              <p className='text-lg font-bold text-green-600'>
                {formatCurrency(loan.monthly_installment)}
              </p>
            </div>
          </div>

          {/* Loan Details */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm'>
                <FiUser className='w-4 h-4 text-gray-500' />
                <span className='text-muted-foreground'>Name:</span>
                <span className='font-medium'>{loan.fullname}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <FiMail className='w-4 h-4 text-gray-500' />
                <span className='text-muted-foreground'>Email:</span>
                <span className='font-medium'>{loan.email}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <FiPhone className='w-4 h-4 text-gray-500' />
                <span className='text-muted-foreground'>Contact:</span>
                <span className='font-medium'>{loan.contact}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <FiMapPin className='w-4 h-4 text-gray-500' />
                <span className='text-muted-foreground'>CNIC:</span>
                <span className='font-medium'>{loan.CNIC}</span>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm'>
                <FiBriefcase className='w-4 h-4 text-gray-500' />
                <span className='text-muted-foreground'>Employment:</span>
                <span className='font-medium'>{loan.employment_status}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <FiDollarSign className='w-4 h-4 text-gray-500' />
                <span className='text-muted-foreground'>Monthly Income:</span>
                <span className='font-medium'>
                  {formatCurrency(loan.monthly_income)}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <FiCalendar className='w-4 h-4 text-gray-500' />
                <span className='text-muted-foreground'>Duration:</span>
                <span className='font-medium'>{loan.duration} months</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <FiTarget className='w-4 h-4 text-gray-500' />
                <span className='text-muted-foreground'>Interest Rate:</span>
                <span className='font-medium'>{loan.interest}% p.a.</span>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
            <p className='text-xs text-blue-600 font-medium mb-1'>Purpose</p>
            <p className='text-sm text-blue-800'>{loan.purpose}</p>
          </div>

          {/* Organization */}
          <div className='mb-4'>
            <div className='flex items-center gap-2 text-sm'>
              <FiBriefcase className='w-4 h-4 text-gray-500' />
              <span className='text-muted-foreground'>Organization:</span>
              <span className='font-medium'>{loan.organization_name}</span>
            </div>
          </div>

          {/* Status-specific information */}
          {loan.status === 'approved' && (
            <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
              <p className='text-sm text-green-800'>
                🎉 Congratulations! Your loan has been approved. You can expect
                the funds to be disbursed soon.
              </p>
            </div>
          )}

          {loan.status === 'pending' && (
            <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <p className='text-sm text-yellow-800'>
                ⏳ Your loan application is under review. We&apos;ll notify you
                once a decision is made.
              </p>
            </div>
          )}

          {loan.status === 'rejected' && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-sm text-red-800'>
                ❌ Unfortunately, your loan application was not approved. You
                can apply again after addressing any concerns.
              </p>
            </div>
          )}
        </Card>
      ))}

      {/* Apply for new loan button */}
      <div className='pt-4 border-t border-border'>
        <Link href='/apply-loan'>
          <Button variant='outline' className='w-full'>
            <FiPlus className='w-4 h-4 mr-2' />
            Apply for Another Loan
          </Button>
        </Link>
      </div>
    </div>
  );
}
