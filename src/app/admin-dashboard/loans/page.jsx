'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiCheck, FiDollarSign, FiEye, FiSearch, FiX } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import ApprovalModal from './ApprovalModal';
import { RejectModal } from './RejectModal';

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loansData, setLoansData] = useState([
    {
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
    },
    {
      id: 2,
      user: 2,
      fullname: 'Sarah Ahmed',
      address: '456 Avenue, Town',
      contact: '03009876543',
      marital_status: 'Married',
      CNIC: '35202-9876543-2',
      email: 'sarah@example.com',
      employment_status: 'Self-Employed',
      monthly_income: 80000,
      organization_name: 'Own Business',
      loan_type: 2,
      amount: 300000,
      interest: 20.0,
      purpose: 'Home Renovation',
      duration: '6 Months',
      status: 'approved',
      loan_holder: true,
      total_payable: 360000.0,
      monthly_installment: 60000,
    },
    {
      id: 3,
      user: 3,
      fullname: 'Ali Hassan',
      address: '789 Road, Village',
      contact: '03451112233',
      marital_status: 'Single',
      CNIC: '35202-1112233-3',
      email: 'ali@example.com',
      employment_status: 'Employed',
      monthly_income: 45000,
      organization_name: 'XYZ Ltd',
      loan_type: 1,
      amount: 200000,
      interest: 22.0,
      purpose: 'Education',
      duration: '24 Months',
      status: 'rejected',
      loan_holder: false,
      total_payable: 244000.0,
      monthly_installment: 10167,
    },
  ]);

  const filteredLoans = loansData.filter(
    (loan) =>
      loan.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleApprove = (loanId) => {
    setLoansData((prev) =>
      prev.map((loan) =>
        loan.id === loanId
          ? { ...loan, status: 'approved', loan_holder: true }
          : loan
      )
    );
    setShowApprovalModal(false);
    setSelectedLoan(null);
    console.log(`Loan ${loanId} approved`);
  };

  const handleReject = (loanId) => {
    setLoansData((prev) =>
      prev.map((loan) =>
        loan.id === loanId ? { ...loan, status: 'rejected' } : loan
      )
    );
    setShowRejectModal(false);
    setSelectedLoan(null);
    console.log(`Loan ${loanId} }`);
  };

  const openApprovalModal = (loan) => {
    setSelectedLoan(loan);
    setShowApprovalModal(true);
  };

  const openRejectModal = (loan) => {
    setSelectedLoan(loan);
    setShowRejectModal(true);
  };

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
                    Amount
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Purpose
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Status
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
                          {loan.fullname}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {loan.email}
                        </p>
                      </div>
                    </td>
                    <td className='py-3 px-4 text-card-foreground font-medium'>
                      ₨ {loan.amount.toLocaleString()}
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      {loan.purpose}
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          loan.status
                        )}`}
                      >
                        {loan.status.charAt(0).toUpperCase() +
                          loan.status.slice(1)}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <Link href={`/admin-dashboard/loans/${loan.id}`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-border'
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
                            >
                              <FiCheck className='w-4 h-4' />
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => openRejectModal(loan)}
                              className='text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50'
                            >
                              <FiX className='w-4 h-4' />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLoans.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>
                No loans found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showApprovalModal && selectedLoan && (
        <ApprovalModal
          loan={selectedLoan}
          onClose={() => setShowApprovalModal(false)}
          onApprove={handleApprove}
        />
      )}

      {showRejectModal && selectedLoan && (
        <RejectModal
          loan={selectedLoan}
          onClose={() => setShowRejectModal(false)}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
