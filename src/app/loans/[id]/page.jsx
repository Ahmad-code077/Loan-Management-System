'use client';

import { useParams, useRouter } from 'next/navigation';
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
  FiRefreshCw,
  FiMapPin,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiTarget,
  FiClock,
  FiArrowLeft,
  FiInfo,
  FiFileText,
} from 'react-icons/fi';
import Link from 'next/link';

export default function LoanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = params?.id;

  const {
    data: loans = [],
    isLoading,
    error,
    refetch,
  } = useGetUserLoansQuery();

  const { data: loanTypes = [] } = useGetLoanTypesQuery();

  // Find the specific loan
  const loan = loans.find((l) => l.id === parseInt(loanId));

  // Get loan type details
  const loanType = loanTypes.find((type) => type.id === loan?.loan_type);

  // Get status badge style and icon
  const getStatusBadge = (status) => {
    const statusStyles = {
      approved: {
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <FiDollarSign className='w-4 h-4 mr-1' />,
        bgClass: 'bg-green-50 border-green-200',
        textClass: 'text-green-800',
      },
      pending: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <FiClock className='w-4 h-4 mr-1' />,
        bgClass: 'bg-yellow-50 border-yellow-200',
        textClass: 'text-yellow-800',
      },
      rejected: {
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <FiAlertCircle className='w-4 h-4 mr-1' />,
        bgClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-800',
      },
      active: {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FiCreditCard className='w-4 h-4 mr-1' />,
        bgClass: 'bg-blue-50 border-blue-200',
        textClass: 'text-blue-800',
      },
      completed: {
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <FiTarget className='w-4 h-4 mr-1' />,
        bgClass: 'bg-gray-50 border-gray-200',
        textClass: 'text-gray-800',
      },
    };

    return statusStyles[status] || statusStyles.pending;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading loan details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <Card className='p-8 text-center max-w-md'>
          <div className='flex items-center justify-center gap-2 text-red-600 mb-3'>
            <FiAlertCircle className='w-5 h-5' />
            <span>Failed to load loan details</span>
          </div>
          <p className='text-sm text-muted-foreground mb-4'>
            {error?.data?.message ||
              'Something went wrong while fetching loan details.'}
          </p>
          <div className='flex gap-2 justify-center'>
            <Button variant='outline' onClick={() => refetch()}>
              <FiRefreshCw className='w-4 h-4 mr-1' />
              Try Again
            </Button>
            <Link href='/dashboard'>
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Loan not found
  if (!loan) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <Card className='p-8 text-center max-w-md'>
          <FiAlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Loan not found
          </h3>
          <p className='text-muted-foreground mb-4'>
            The loan you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <div className='flex gap-2 justify-center'>
            <Link href='/loans'>
              <Button variant='outline'>View All Loans</Button>
            </Link>
            <Link href='/dashboard'>
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusBadge(loan.status);

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='bg-card shadow-sm border-b border-border'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-3 mb-3'>
            <Link href='/dashboard'>
              <Button variant='outline' size='sm'>
                <FiArrowLeft className='w-4 h-4 mr-1' />
                Back to Dashboard
              </Button>
            </Link>
            <Link href='/loans'>
              <Button variant='ghost' size='sm'>
                All Loans
              </Button>
            </Link>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center'>
                <FiDollarSign className='w-6 h-6 text-primary-foreground' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-foreground'>
                  {loanType?.name || 'Loan Details'}
                </h1>
                <p className='text-sm text-muted-foreground'>
                  Loan ID: #{loan.id}
                </p>
              </div>
            </div>
            <Badge className={statusConfig.className} size='lg'>
              {statusConfig.icon}
              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto space-y-6'>
          {/* Status Alert */}
          <Card className={`p-4 border ${statusConfig.bgClass}`}>
            <div className={`flex items-start gap-3 ${statusConfig.textClass}`}>
              {statusConfig.icon}
              <div>
                <h3 className='font-medium mb-1'>
                  Loan Status:{' '}
                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </h3>
                {loan.status === 'approved' && (
                  <p className='text-sm'>
                    🎉 Congratulations! Your loan has been approved. The funds
                    will be disbursed to your account soon. You will receive
                    further instructions via email.
                  </p>
                )}
                {loan.status === 'pending' && (
                  <p className='text-sm'>
                    ⏳ Your loan application is currently under review by our
                    team. We will notify you via email once a decision has been
                    made. This process typically takes 2-5 business days.
                  </p>
                )}
                {loan.status === 'rejected' && (
                  <p className='text-sm'>
                    ❌ Unfortunately, your loan application was not approved at
                    this time. You may reapply after 30 days or contact our
                    support team for more information.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Financial Summary */}
          <Card className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <FiDollarSign className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Financial Summary</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='text-center p-4 bg-blue-50 rounded-lg border border-blue-200'>
                <p className='text-sm text-blue-600 font-medium'>
                  Principal Amount
                </p>
                <p className='text-2xl font-bold text-blue-800'>
                  {formatCurrency(loan.amount)}
                </p>
              </div>
              <div className='text-center p-4 bg-orange-50 rounded-lg border border-orange-200'>
                <p className='text-sm text-orange-600 font-medium'>
                  Interest Amount
                </p>
                <p className='text-2xl font-bold text-orange-800'>
                  {formatCurrency(loan.total_payable - loan.amount)}
                </p>
              </div>
              <div className='text-center p-4 bg-purple-50 rounded-lg border border-purple-200'>
                <p className='text-sm text-purple-600 font-medium'>
                  Total Payable
                </p>
                <p className='text-2xl font-bold text-purple-800'>
                  {formatCurrency(loan.total_payable)}
                </p>
              </div>
              <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200'>
                <p className='text-sm text-green-600 font-medium'>
                  Monthly EMI
                </p>
                <p className='text-2xl font-bold text-green-800'>
                  {formatCurrency(loan.monthly_installment)}
                </p>
              </div>
            </div>

            {/* Loan Terms */}
            <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='text-center p-3 bg-gray-50 rounded border'>
                <p className='text-xs text-gray-500'>Interest Rate</p>
                <p className='text-lg font-semibold text-gray-700'>
                  {loan.interest}% per annum
                </p>
              </div>
              <div className='text-center p-3 bg-gray-50 rounded border'>
                <p className='text-xs text-gray-500'>Loan Duration</p>
                <p className='text-lg font-semibold text-gray-700'>
                  {loan.duration} months
                </p>
              </div>
              <div className='text-center p-3 bg-gray-50 rounded border'>
                <p className='text-xs text-gray-500'>Loan Type</p>
                <p className='text-lg font-semibold text-gray-700'>
                  {loanType?.name || 'Unknown'}
                </p>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <FiUser className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Personal Information</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <FiUser className='w-4 h-4 text-gray-500' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Full Name</p>
                    <p className='font-medium'>{loan.fullname}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <FiMail className='w-4 h-4 text-gray-500' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Email Address
                    </p>
                    <p className='font-medium'>{loan.email}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <FiPhone className='w-4 h-4 text-gray-500' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Contact Number
                    </p>
                    <p className='font-medium'>{loan.contact}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <FiCreditCard className='w-4 h-4 text-gray-500' />
                  <div>
                    <p className='text-sm text-muted-foreground'>CNIC</p>
                    <p className='font-medium'>{loan.CNIC}</p>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <FiMapPin className='w-4 h-4 text-gray-500 mt-1' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Address</p>
                    <p className='font-medium'>{loan.address}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <FiUser className='w-4 h-4 text-gray-500' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Marital Status
                    </p>
                    <p className='font-medium'>{loan.marital_status}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Employment Information */}
          <Card className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <FiBriefcase className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Employment Information</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <FiBriefcase className='w-4 h-4 text-gray-500' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Employment Status
                    </p>
                    <p className='font-medium'>{loan.employment_status}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <FiDollarSign className='w-4 h-4 text-gray-500' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Monthly Income
                    </p>
                    <p className='font-medium'>
                      {formatCurrency(loan.monthly_income)}
                    </p>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <FiBriefcase className='w-4 h-4 text-gray-500' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Organization
                    </p>
                    <p className='font-medium'>{loan.organization_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Loan Purpose */}
          <Card className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <FiFileText className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Loan Purpose</h2>
            </div>
            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <p className='text-blue-800'>{loan.purpose}</p>
            </div>
          </Card>

          {/* Application Details */}
          <Card className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <FiInfo className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold'>Application Details</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-3 bg-gray-50 rounded border'>
                <p className='text-xs text-gray-500'>Application Date</p>
                <p className='text-sm font-medium'>
                  {formatDate(loan.created_at)}
                </p>
              </div>
              <div className='p-3 bg-gray-50 rounded border'>
                <p className='text-xs text-gray-500'>Last Updated</p>
                <p className='text-sm font-medium'>
                  {formatDate(loan.updated_at || loan.created_at)}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className='flex gap-4 justify-center pt-6'>
            <Link href='/loans'>
              <Button variant='outline'>
                <FiArrowLeft className='w-4 h-4 mr-2' />
                Back to All Loans
              </Button>
            </Link>
            <Link href='/apply-loan'>
              <Button>Apply for New Loan</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
