'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSearch, FiEye, FiCheck, FiX, FiDollarSign } from 'react-icons/fi';
import Link from 'next/link';

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock loans data
  const loans = [
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
      status: 'rejected',
      loan_holder: false,
      total_payable: 625000.0,
      monthly_installment: 52083,
    },
  ];

  const filteredLoans = loans.filter(
    (loan) =>
      loan.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Loans Management</h1>
          <p className='text-gray-600 mt-1'>Manage all loan applications</p>
        </div>
        <div className='flex space-x-2'>
          <Button variant='outline'>
            <FiDollarSign className='w-4 h-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>All Loans ({loans.length})</CardTitle>
            <div className='relative w-64'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Search loans...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    ID
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Applicant
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Amount
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Purpose
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Status
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className='border-b hover:bg-gray-50'>
                    <td className='py-3 px-4 text-gray-900'>#{loan.id}</td>
                    <td className='py-3 px-4'>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {loan.fullname}
                        </p>
                        <p className='text-sm text-gray-600'>{loan.email}</p>
                      </div>
                    </td>
                    <td className='py-3 px-4 text-gray-900 font-medium'>
                      ₨ {loan.amount.toLocaleString()}
                    </td>
                    <td className='py-3 px-4 text-gray-600'>{loan.purpose}</td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          loan.status
                        )}`}
                      >
                        {loan.status.charAt(0).toUpperCase() +
                          loan.status.slice(1)}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <Link href={`/admin/loans/${loan.id}`}>
                          <Button variant='outline' size='sm'>
                            <FiEye className='w-4 h-4' />
                          </Button>
                        </Link>
                        {loan.status === 'pending' && (
                          <>
                            <Button
                              size='sm'
                              className='bg-green-600 hover:bg-green-700'
                            >
                              <FiCheck className='w-4 h-4' />
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-red-600 hover:text-red-700'
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
        </CardContent>
      </Card>
    </div>
  );
}
