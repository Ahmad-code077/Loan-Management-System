'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiLoader,
} from 'react-icons/fi';
import Link from 'next/link';
import {
  useGetUsersQuery,
  useGetLoansQuery,
  useGetDocumentsQuery,
  useGetLoanTypesQuery,
} from '@/lib/store/authApi';

export default function AdminDashboard() {
  // ✅ Fetch real data from APIs
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: loans = [], isLoading: loansLoading } = useGetLoansQuery();
  const { data: documents = [], isLoading: documentsLoading } =
    useGetDocumentsQuery();
  const { data: loanTypes = [], isLoading: loanTypesLoading } =
    useGetLoanTypesQuery();

  // ✅ Calculate real statistics
  const stats = [
    {
      title: 'Total Users',
      value: usersLoading ? '...' : users.length.toLocaleString(),
      icon: FiUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      loading: usersLoading,
    },
    {
      title: 'Total Loans',
      value: loansLoading ? '...' : loans.length.toLocaleString(),
      icon: FiDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      loading: loansLoading,
    },
    {
      title: 'Documents',
      value: documentsLoading ? '...' : documents.length.toLocaleString(),
      icon: FiFileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      loading: documentsLoading,
    },
    {
      title: 'Loan Types',
      value: loanTypesLoading ? '...' : loanTypes.length.toLocaleString(),
      icon: FiCheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      loading: loanTypesLoading,
    },
  ];

  // ✅ Calculate loan statistics
  const pendingLoans = loans.filter((loan) => loan.status === 'pending').length;
  const approvedLoans = loans.filter(
    (loan) => loan.status === 'approved'
  ).length;
  const rejectedLoans = loans.filter(
    (loan) => loan.status === 'rejected'
  ).length;

  // ✅ Calculate document statistics
  const verifiedDocuments = documents.filter((doc) => doc.is_verified).length;
  const pendingDocuments = documents.filter((doc) => !doc.is_verified).length;

  // ✅ FIXED: Create copies of arrays before sorting to avoid mutation error
  const recentLoans = [...loans]
    .sort(
      (a, b) =>
        new Date(b.created_at || b.application_date) -
        new Date(a.created_at || a.application_date)
    )
    .slice(0, 5);

  // ✅ FIXED: Create copy of documents array before sorting
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
    .slice(0, 5);

  // ✅ Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ✅ Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
      approved: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: FiXCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className='w-3 h-3 mr-1' />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>
          Dashboard Overview
        </h1>
        <p className='text-muted-foreground mt-1'>
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='border border-border bg-card'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {stat.title}
                    </p>
                    <p className='text-2xl font-bold text-card-foreground'>
                      {stat.loading ? (
                        <FiLoader className='w-6 h-6 animate-spin' />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Loan Status Stats */}
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-card-foreground text-lg'>
              Loan Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Pending</span>
              <Badge className='bg-yellow-100 text-yellow-800 border-0'>
                {pendingLoans}
              </Badge>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Approved</span>
              <Badge className='bg-green-100 text-green-800 border-0'>
                {approvedLoans}
              </Badge>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Rejected</span>
              <Badge className='bg-red-100 text-red-800 border-0'>
                {rejectedLoans}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Document Status Stats */}
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-card-foreground text-lg'>
              Document Status
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Verified</span>
              <Badge className='bg-green-100 text-green-800 border-0'>
                {verifiedDocuments}
              </Badge>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Pending</span>
              <Badge className='bg-yellow-100 text-yellow-800 border-0'>
                {pendingDocuments}
              </Badge>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Total</span>
              <Badge variant='outline'>{documents.length}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-card-foreground text-lg'>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Link href='/admin-dashboard/users'>
              <Button variant='outline' className='w-full justify-start'>
                <FiUsers className='w-4 h-4 mr-2' />
                Manage Users
              </Button>
            </Link>
            <Link href='/admin-dashboard/loans'>
              <Button variant='outline' className='w-full justify-start'>
                <FiDollarSign className='w-4 h-4 mr-2' />
                Review Loans
              </Button>
            </Link>
            <Link href='/admin-dashboard/documents'>
              <Button variant='outline' className='w-full justify-start'>
                <FiFileText className='w-4 h-4 mr-2' />
                Verify Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Loan Applications */}
        <Card className='border border-border bg-card'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-card-foreground'>
              Recent Loan Applications
            </CardTitle>
            <Link href='/admin-dashboard/loans'>
              <Button variant='outline' size='sm'>
                <FiEye className='w-4 h-4 mr-2' />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loansLoading ? (
              <div className='text-center py-4'>
                <FiLoader className='w-6 h-6 animate-spin mx-auto' />
                <p className='text-sm text-muted-foreground mt-2'>
                  Loading loans...
                </p>
              </div>
            ) : recentLoans.length === 0 ? (
              <p className='text-center py-4 text-muted-foreground'>
                No loan applications yet
              </p>
            ) : (
              <div className='space-y-4'>
                {recentLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className='flex items-center justify-between py-2 border-b border-border last:border-b-0'
                  >
                    <div>
                      <p className='font-medium text-card-foreground'>
                        {loan.user?.first_name} {loan.user?.last_name}
                        {!loan.user?.first_name &&
                          !loan.user?.last_name &&
                          loan.user?.username}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {formatCurrency(loan.amount)} -{' '}
                        {loan.loan_type?.name || 'N/A'}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {formatDate(loan.created_at || loan.application_date)}
                      </p>
                    </div>
                    {getStatusBadge(loan.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className='border border-border bg-card'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-card-foreground'>
              Recent Documents
            </CardTitle>
            <Link href='/admin-dashboard/documents'>
              <Button variant='outline' size='sm'>
                <FiEye className='w-4 h-4 mr-2' />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {documentsLoading ? (
              <div className='text-center py-4'>
                <FiLoader className='w-6 h-6 animate-spin mx-auto' />
                <p className='text-sm text-muted-foreground mt-2'>
                  Loading documents...
                </p>
              </div>
            ) : recentDocuments.length === 0 ? (
              <p className='text-center py-4 text-muted-foreground'>
                No documents uploaded yet
              </p>
            ) : (
              <div className='space-y-4'>
                {recentDocuments.map((document) => (
                  <div
                    key={document.id}
                    className='flex items-center justify-between py-2 border-b border-border last:border-b-0'
                  >
                    <div>
                      <p className='font-medium text-card-foreground'>
                        {document.document_type}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        By: {document.user?.first_name}{' '}
                        {document.user?.last_name}
                        {!document.user?.first_name &&
                          !document.user?.last_name &&
                          document.user?.username}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {formatDate(document.uploaded_at)}
                      </p>
                    </div>
                    <Badge
                      className={
                        document.is_verified
                          ? 'bg-green-100 text-green-800 border-0'
                          : 'bg-yellow-100 text-yellow-800 border-0'
                      }
                    >
                      {document.is_verified ? (
                        <>
                          <FiCheckCircle className='w-3 h-3 mr-1' />
                          Verified
                        </>
                      ) : (
                        <>
                          <FiClock className='w-3 h-3 mr-1' />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
