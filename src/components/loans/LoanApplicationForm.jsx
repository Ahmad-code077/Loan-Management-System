'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function LoanApplicationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const loanTypes = [
    {
      id: 1,
      name: 'Personal Loan',
      minAmount: 1000,
      maxAmount: 50000,
      description: 'For personal expenses and debt consolidation',
    },
    {
      id: 2,
      name: 'Business Loan',
      minAmount: 5000,
      maxAmount: 100000,
      description: 'For business expansion and working capital',
    },
    {
      id: 3,
      name: 'Education Loan',
      minAmount: 1000,
      maxAmount: 75000,
      description: 'For education and skill development',
    },
    {
      id: 4,
      name: 'Home Renovation Loan',
      minAmount: 2000,
      maxAmount: 150000,
      description: 'For home improvements and renovations',
    },
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedLoanType = watch('loan_type');
  const selectedLoanTypeInfo = loanTypes.find(
    (lt) => lt.id === Number(selectedLoanType)
  );

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Loan application data:', data);

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div>
        <label className='block text-sm font-medium mb-2'>Loan Type</label>
        <select
          {...register('loan_type', { required: 'Loan type is required' })}
          className='w-full rounded-md border border-gray-300 p-2 bg-white'
        >
          <option value=''>Select a loan type</option>
          {loanTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {selectedLoanTypeInfo && (
          <p className='mt-2 text-sm text-gray-600'>
            {selectedLoanTypeInfo.description}
          </p>
        )}
        {errors.loan_type && (
          <span className='text-red-500 text-sm'>
            {errors.loan_type.message}
          </span>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Amount Requested
        </label>
        {selectedLoanTypeInfo && (
          <p className='text-sm text-gray-600 mb-2'>
            Available range: ${selectedLoanTypeInfo.minAmount.toLocaleString()}{' '}
            - ${selectedLoanTypeInfo.maxAmount.toLocaleString()}
          </p>
        )}
        <Input
          type='number'
          {...register('amount', {
            required: 'Amount is required',
            min: {
              value: selectedLoanTypeInfo?.minAmount || 1000,
              message: `Amount must be at least $${(
                selectedLoanTypeInfo?.minAmount || 1000
              ).toLocaleString()}`,
            },
            max: {
              value: selectedLoanTypeInfo?.maxAmount || 50000,
              message: `Amount cannot exceed $${(
                selectedLoanTypeInfo?.maxAmount || 50000
              ).toLocaleString()}`,
            },
          })}
          placeholder='Enter amount in USD'
          className='w-full'
        />
        {errors.amount && (
          <span className='text-red-500 text-sm'>{errors.amount.message}</span>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Purpose</label>
        <Textarea
          {...register('purpose', {
            required: 'Purpose is required',
            minLength: {
              value: 50,
              message: 'Please provide at least 50 characters',
            },
          })}
          placeholder='Describe the purpose of your loan'
          className='w-full'
          rows={4}
        />
        {errors.purpose && (
          <span className='text-red-500 text-sm'>{errors.purpose.message}</span>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Monthly Income</label>
        <Input
          type='number'
          {...register('monthly_income', {
            required: 'Monthly income is required',
            min: {
              value: 0,
              message: 'Monthly income must be a positive number',
            },
          })}
          placeholder='Enter your monthly income'
          className='w-full'
        />
        {errors.monthly_income && (
          <span className='text-red-500 text-sm'>
            {errors.monthly_income.message}
          </span>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Employment Status
        </label>
        <select
          {...register('employment_status', {
            required: 'Employment status is required',
          })}
          className='w-full rounded-md border border-gray-300 p-2 bg-white'
        >
          <option value=''>Select employment status</option>
          <option value='full_time'>Full Time</option>
          <option value='part_time'>Part Time</option>
          <option value='self_employed'>Self Employed</option>
          <option value='unemployed'>Unemployed</option>
        </select>
        {errors.employment_status && (
          <span className='text-red-500 text-sm'>
            {errors.employment_status.message}
          </span>
        )}
      </div>

      <div className='space-y-4'>
        <h3 className='font-medium'>Required Documents</h3>
        <ul className='list-disc pl-5 text-sm text-gray-600'>
          <li>Valid ID proof</li>
          <li>Last 3 months bank statements</li>
          <li>Proof of income/employment</li>
          <li>Proof of address</li>
        </ul>
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Submitting Application...' : 'Submit Application'}
      </Button>
    </form>
  );
}
