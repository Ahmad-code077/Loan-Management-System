'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FiCheck,
  FiDollarSign,
  FiEye,
  FiSearch,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import ApprovalModal from './ApprovalModal';
import { RejectModal } from './RejectModal';
import {
  useGetLoansQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
  useGetLoanTypesQuery,
} from '@/lib/store/authApi';
import { useToast } from '@/hooks/use-toast';

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const { toast } = useToast();

  // API hooks
  const {
    data: loansData = [],
    isLoading: loansLoading,
    error: loansError,
    refetch: refetchLoans,
  } = useGetLoansQuery();

  const { data: loanTypes = [], isLoading: loanTypesLoading } =
    useGetLoanTypesQuery();

  const [approveLoan, { isLoading: approvingLoan }] = useApproveLoanMutation();
  const [rejectLoan, { isLoading: rejectingLoan }] = useRejectLoanMutation();

  // Get loan type name by ID
  const getLoanTypeName = (loanTypeId) => {
    const loanType = loanTypes.find((type) => type.id === loanTypeId);
    return loanType ? loanType.name : `Loan Type ${loanTypeId}`;
  };

  // Filter loans based on search term
  const filteredLoans = loansData.filter(
    (loan) =>
      loan.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.id?.toString().includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleApprove = async (loanId) => {
    try {
      await approveLoan(loanId).unwrap();

      toast({
        title: 'Loan Approved',
        description: `Loan #${loanId} has been successfully approved.`,
        variant: 'default',
      });

      setShowApprovalModal(false);
      setSelectedLoan(null);

      // Refetch loans to get updated data
      refetchLoans();
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
      setSelectedLoan(null);

      // Refetch loans to get updated data
      refetchLoans();
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

  const openApprovalModal = (loan) => {
    setSelectedLoan(loan);
    setShowApprovalModal(true);
  };

  const openRejectModal = (loan) => {
    setSelectedLoan(loan);
    setShowRejectModal(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `PKR ${Number(amount || 0).toLocaleString()}`;
  };

  // Loading state
  if (loansLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Loans Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage all loan applications
            </p>
          </div>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiLoader className='w-8 h-8 animate-spin text-primary mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Loading Loans...</h3>
              <p className='text-muted-foreground'>
                Please wait while we fetch all loan applications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (loansError) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Loans Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage all loan applications
            </p>
          </div>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiAlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2 text-red-600'>
                Failed to Load Loans
              </h3>
              <p className='text-muted-foreground mb-4'>
                {loansError?.data?.message ||
                  'Something went wrong while fetching loan applications.'}
              </p>
              <Button onClick={() => refetchLoans()} variant='outline'>
                <FiRefreshCw className='w-4 h-4 mr-2' />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Loans Management
          </h1>
          <p className='text-muted-foreground mt-1'>
            Manage all loan applications
          </p>
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            className='border-border'
            onClick={() => refetchLoans()}
            disabled={loansLoading}
          >
            <FiRefreshCw
              className={`w-4 h-4 mr-2 ${loansLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button variant='outline' className='border-border'>
            <FiDollarSign className='w-4 h-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      <Card className='border border-border bg-card'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-card-foreground'>
              All Loans ({loansData.length})
              {loanTypesLoading && (
                <span className='text-sm text-muted-foreground ml-2'>
                  (Loading loan types...)
                </span>
              )}
            </CardTitle>
            <div className='relative w-64'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                placeholder='Search loans...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 bg-input border-border'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-border'>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    ID
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Applicant
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Loan Type
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Amount
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Purpose
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Status
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Applied Date
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className='border-b border-border hover:bg-muted/50'
                  >
                    <td className='py-3 px-4 text-card-foreground font-medium'>
                      #{loan.id}
                    </td>
                    <td className='py-3 px-4'>
                      <div>
                        <p className='font-medium text-card-foreground'>
                          {loan.fullname || 'N/A'}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {loan.email || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      {getLoanTypeName(loan.loan_type)}
                    </td>
                    <td className='py-3 px-4 text-card-foreground font-medium'>
                      {formatCurrency(loan.amount)}
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      <div className='max-w-32 truncate' title={loan.purpose}>
                        {loan.purpose || 'N/A'}
                      </div>
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          loan.status
                        )}`}
                      >
                        {loan.status?.charAt(0).toUpperCase() +
                          loan.status?.slice(1) || 'Unknown'}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-muted-foreground text-sm'>
                      {loan.created_at
                        ? new Date(loan.created_at).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <Link href={`/admin-dashboard/loans/${loan.id}`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-border'
                            title='View Details'
                          >
                            <FiEye className='w-4 h-4' />
                          </Button>
                        </Link>
                        {loan.status === 'pending' && (
                          <>
                            <Button
                              size='sm'
                              onClick={() => openApprovalModal(loan)}
                              className='bg-green-600 hover:bg-green-700 text-white'
                              disabled={approvingLoan}
                              title='Approve Loan'
                            >
                              {approvingLoan && selectedLoan?.id === loan.id ? (
                                <FiLoader className='w-4 h-4 animate-spin' />
                              ) : (
                                <FiCheck className='w-4 h-4' />
                              )}
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => openRejectModal(loan)}
                              className='text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50'
                              disabled={rejectingLoan}
                              title='Reject Loan'
                            >
                              {rejectingLoan && selectedLoan?.id === loan.id ? (
                                <FiLoader className='w-4 h-4 animate-spin' />
                              ) : (
                                <FiX className='w-4 h-4' />
                              )}
                            </Button>
                          </>
                        )}
                        {loan.status !== 'pending' && (
                          <div className='flex items-center space-x-1'>
                            <span className='text-xs text-muted-foreground'>
                              {loan.status === 'approved'
                                ? 'Approved'
                                : loan.status === 'rejected'
                                ? 'Rejected'
                                : loan.status?.charAt(0).toUpperCase() +
                                  loan.status?.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLoans.length === 0 && !loansLoading && (
            <div className='text-center py-8'>
              <FiAlertCircle className='w-12 h-12 text-muted-foreground mx-auto mb-3' />
              <p className='text-muted-foreground text-lg mb-1'>
                No loans found
              </p>
              <p className='text-sm text-muted-foreground'>
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'No loan applications have been submitted yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
      {showApprovalModal && selectedLoan && (
        <ApprovalModal
          loan={selectedLoan}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedLoan(null);
          }}
          onApprove={handleApprove}
          isLoading={approvingLoan}
        />
      )}

      {showRejectModal && selectedLoan && (
        <RejectModal
          loan={selectedLoan}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedLoan(null);
          }}
          onReject={handleReject}
          isLoading={rejectingLoan}
        />
      )}
    </div>
  );
}
