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
  FiArrowLeft,
} from 'react-icons/fi';
import Link from 'next/link';

export default function AllLoansPage() {
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

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='bg-card shadow-sm border-b border-border'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-3 mb-2'>
            <Link href='/dashboard'>
              <Button variant='outline' size='sm'>
                <FiArrowLeft className='w-4 h-4 mr-1' />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
              <FiDollarSign className='w-5 h-5 text-primary-foreground' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-foreground'>All Loans</h1>
              <p className='text-sm text-muted-foreground'>
                View all your loan applications and their status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Loading state */}
          {isLoading && (
            <div className='text-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3'></div>
              <div className='text-muted-foreground'>
                Loading all your loans...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <Card className='p-6 text-center'>
              <div className='flex items-center justify-center gap-2 text-red-600 mb-3'>
                <FiAlertCircle className='w-5 h-5' />
                <span>Failed to load loans</span>
              </div>
              <p className='text-sm text-muted-foreground mb-4'>
                {error?.data?.message ||
                  'Something went wrong while fetching your loans.'}
              </p>
              <Button variant='outline' onClick={() => refetch()}>
                <FiRefreshCw className='w-4 h-4 mr-1' />
                Try Again
              </Button>
            </Card>
          )}

          {/* Empty state */}
          {!isLoading && !error && (!loans || loans.length === 0) && (
            <Card className='p-8 text-center'>
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
            </Card>
          )}

          {/* Loans List */}
          {!isLoading && !error && loans && loans.length > 0 && (
            <div className='space-y-4'>
              {loans.map((loan) => (
                <Card
                  key={loan.id}
                  className='p-6 hover:shadow-md transition-all duration-200 border border-border'
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
                    </div>
                  </div>

                  {/* Key Information */}
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
                    <div className='text-center p-3 bg-gray-50 rounded'>
                      <p className='text-xs text-muted-foreground'>
                        Loan Amount
                      </p>
                      <p className='text-lg font-bold text-primary'>
                        {formatCurrency(loan.amount)}
                      </p>
                    </div>
                    <div className='text-center p-3 bg-gray-50 rounded'>
                      <p className='text-xs text-muted-foreground'>
                        Total Payable
                      </p>
                      <p className='text-lg font-bold text-orange-600'>
                        {formatCurrency(loan.total_payable)}
                      </p>
                    </div>
                    <div className='text-center p-3 bg-gray-50 rounded'>
                      <p className='text-xs text-muted-foreground'>
                        Monthly EMI
                      </p>
                      <p className='text-lg font-bold text-green-600'>
                        {formatCurrency(loan.monthly_installment)}
                      </p>
                    </div>
                    <div className='text-center p-3 bg-gray-50 rounded'>
                      <p className='text-xs text-muted-foreground'>Duration</p>
                      <p className='text-lg font-bold text-blue-600'>
                        {loan.duration} months
                      </p>
                    </div>
                  </div>

                  {/* Quick Details */}
                  <div className='flex justify-between items-center mb-4 text-sm text-muted-foreground'>
                    <span>Interest Rate: {loan.interest}%</span>
                    <span>
                      Applied:{' '}
                      {new Date(
                        loan.created_at || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action */}
                  <div className='flex gap-2'>
                    <Link href={`/loans/${loan.id}`} className='flex-1'>
                      <Button className='w-full'>
                        <FiEye className='w-4 h-4 mr-2' />
                        View Full Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}

              {/* Apply for new loan */}
              <Card className='p-6 text-center border-dashed border-2 border-gray-300'>
                <FiPlus className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                <h3 className='text-lg font-medium mb-2'>Need another loan?</h3>
                <p className='text-muted-foreground mb-4'>
                  Apply for a new loan to meet your financial needs
                </p>
                <Link href='/apply-loan'>
                  <Button>
                    <FiPlus className='w-4 h-4 mr-2' />
                    Apply for New Loan
                  </Button>
                </Link>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
