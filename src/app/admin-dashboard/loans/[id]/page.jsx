'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FiArrowLeft,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiBriefcase,
  FiHome,
  FiPhone,
  FiMail,
  FiCheck,
  FiX,
  FiFileText,
  FiMapPin,
  FiCreditCard,
} from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ApprovalModal from '../ApprovalModal';
import { RejectModal } from '../RejectModal';

export default function LoanDetailPage() {
  const { id } = useParams();
  const [loan, setLoan] = useState({
    id: 1,
    user: 1,
    fullname: 'John Doe',
    address: '123 Street, City',
    contact: '03121234567',
    marital_status: 'Single',
    CNIC: '35202-1234567-1',
    email: 'john@example.com',
    employment_status: 'Employed',
    monthly_income: 60000,
    organization_name: 'ABC Corp',
    loan_type: 1,
    amount: 500000,
    interest: 25.0,
    purpose: 'Business Expansion',
    duration: '12 Months',
    status: 'pending',
    loan_holder: false,
    total_payable: 625000.0,
    monthly_installment: 52083,
  });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiCheck className='w-4 h-4' />;
      case 'rejected':
        return <FiX className='w-4 h-4' />;
      default:
        return <FiFileText className='w-4 h-4' />;
    }
  };

  const getLoanTypeName = (type) => {
    switch (type) {
      case 1:
        return 'Personal Loan';
      case 2:
        return 'Business Loan';
      case 3:
        return 'Home Loan';
      default:
        return 'Other';
    }
  };

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
          <Link href='/admin-dashboard/loans'>
            <Button variant='outline' size='sm' className='border-border'>
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Loans
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Loan Not Found
            </h1>
            <p className='text-muted-foreground mt-1'>
              The requested loan could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link href='/admin-dashboard/loans'>
            <Button variant='outline' size='sm' className='border-border'>
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to Loans
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Loan Application #{loan.id}
            </h1>
            <p className='text-muted-foreground mt-1'>
              Detailed view of {loan.fullname}&apos;s loan application
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <Badge className={`${getStatusColor(loan.status)} border px-3 py-1`}>
            {getStatusIcon(loan.status)}
            <span className='ml-2 font-medium'>
              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
            </span>
          </Badge>
          {loan.status === 'pending' && (
            <div className='flex space-x-2'>
              <Button
                onClick={() => setShowApprovalModal(true)}
                className='bg-green-600 hover:bg-green-700'
              >
                <FiCheck className='w-4 h-4 mr-2' />
                Approve
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                variant='outline'
                className='text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50'
              >
                <FiX className='w-4 h-4 mr-2' />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Main Details */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Personal Information */}
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='flex items-center text-card-foreground'>
                <FiUser className='w-5 h-5 mr-2 text-blue-600' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Full Name
                  </label>
                  <p className='text-lg font-semibold text-card-foreground'>
                    {loan.fullname}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    CNIC Number
                  </label>
                  <p className='text-lg text-card-foreground font-mono'>
                    {loan.CNIC}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Email Address
                  </label>
                  <p className='text-lg text-card-foreground flex items-center'>
                    <FiMail className='w-4 h-4 mr-2 text-blue-500' />
                    {loan.email}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Contact Number
                  </label>
                  <p className='text-lg text-card-foreground flex items-center'>
                    <FiPhone className='w-4 h-4 mr-2 text-green-500' />
                    {loan.contact}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Address
                  </label>
                  <p className='text-lg text-card-foreground flex items-center'>
                    <FiMapPin className='w-4 h-4 mr-2 text-red-500' />
                    {loan.address}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Marital Status
                  </label>
                  <p className='text-lg text-card-foreground'>
                    {loan.marital_status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='flex items-center text-card-foreground'>
                <FiBriefcase className='w-5 h-5 mr-2 text-purple-600' />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Employment Status
                  </label>
                  <p className='text-lg text-card-foreground'>
                    {loan.employment_status}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Organization
                  </label>
                  <p className='text-lg text-card-foreground'>
                    {loan.organization_name}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Monthly Income
                  </label>
                  <p className='text-2xl font-bold text-green-600'>
                    ₨ {loan.monthly_income.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='flex items-center text-card-foreground'>
                <FiDollarSign className='w-5 h-5 mr-2 text-green-600' />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Loan Amount
                  </label>
                  <p className='text-3xl font-bold text-primary'>
                    ₨ {loan.amount.toLocaleString()}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Interest Rate
                  </label>
                  <p className='text-3xl font-bold text-orange-600'>
                    {loan.interest}%
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Loan Duration
                  </label>
                  <p className='text-lg text-card-foreground flex items-center'>
                    <FiCalendar className='w-4 h-4 mr-2 text-blue-500' />
                    {loan.duration}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Loan Type
                  </label>
                  <p className='text-lg text-card-foreground'>
                    {getLoanTypeName(loan.loan_type)}
                  </p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Purpose
                  </label>
                  <p className='text-lg text-card-foreground'>{loan.purpose}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Loan Holder Status
                  </label>
                  <p
                    className={`text-lg font-semibold ${
                      loan.loan_holder ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {loan.loan_holder
                      ? 'Active Loan Holder'
                      : 'Not a Loan Holder'}
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className='mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200'>
                <h3 className='text-lg font-semibold text-card-foreground mb-4'>
                  Payment Summary
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Total Payable Amount
                    </label>
                    <p className='text-2xl font-bold text-red-600'>
                      ₨ {loan.total_payable.toLocaleString()}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Monthly Installment
                    </label>
                    <p className='text-2xl font-bold text-blue-600'>
                      ₨ {loan.monthly_installment.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {loan.status === 'rejected' && loan.rejection_reason && (
                <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                  <div className='flex items-start space-x-2'>
                    <FiX className='w-5 h-5 text-red-600 mt-0.5' />
                    <div>
                      <h4 className='text-sm font-semibold text-red-800'>
                        Rejection Reason
                      </h4>
                      <p className='text-red-700 mt-1'>
                        {loan.rejection_reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className='space-y-6'>
          {/* Application Summary */}
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='text-card-foreground flex items-center'>
                <FiFileText className='w-5 h-5 mr-2 text-gray-600' />
                Application Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Application ID:</span>
                  <span className='font-semibold text-card-foreground'>
                    #{loan.id}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>User ID:</span>
                  <span className='font-semibold text-card-foreground'>
                    #{loan.user}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Loan Type:</span>
                  <span className='font-semibold text-card-foreground'>
                    {getLoanTypeName(loan.loan_type)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Current Status:</span>
                  <Badge className={`${getStatusColor(loan.status)} border`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Loan Holder:</span>
                  <span
                    className={`font-semibold ${
                      loan.loan_holder ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {loan.loan_holder ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='text-card-foreground flex items-center'>
                <FiCreditCard className='w-5 h-5 mr-2 text-green-600' />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Principal Amount
                    </span>
                    <span className='font-medium text-card-foreground'>
                      ₨ {loan.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Interest ({loan.interest}%)
                    </span>
                    <span className='font-medium text-orange-600'>
                      ₨ {(loan.total_payable - loan.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
                <hr className='border-border' />
                <div>
                  <div className='flex justify-between text-sm font-semibold'>
                    <span className='text-card-foreground'>Total Payable</span>
                    <span className='text-red-600'>
                      ₨ {loan.total_payable.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className='bg-blue-50 p-3 rounded-lg border border-blue-200'>
                  <div className='text-center'>
                    <p className='text-xs text-blue-600 font-medium'>
                      Monthly Payment
                    </p>
                    <p className='text-lg font-bold text-blue-700'>
                      ₨ {loan.monthly_installment.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {loan.status === 'pending' && (
            <Card className='border border-border bg-card'>
              <CardHeader>
                <CardTitle className='text-card-foreground'>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button
                  onClick={() => setShowApprovalModal(true)}
                  className='w-full bg-green-600 hover:bg-green-700'
                >
                  <FiCheck className='w-4 h-4 mr-2' />
                  Approve Application
                </Button>
                <Button
                  onClick={() => setShowRejectModal(true)}
                  variant='outline'
                  className='w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50'
                >
                  <FiX className='w-4 h-4 mr-2' />
                  Reject Application
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
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
