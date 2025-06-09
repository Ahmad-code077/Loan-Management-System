'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useApplyLoanMutation,
  useGetUserLoanTypesQuery, // ✅ CHANGED: Use user endpoint instead of admin
} from '@/lib/store/authApi';
import { authUtils } from '@/lib/auth/authUtils';
import { FiCheck, FiX, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Remove fallback - only use API data
const loanApplicationSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  contact: z
    .string()
    .regex(
      /^(\+923\d{9}|03\d{9})$/,
      'Contact must be in format +923XXXXXXXXX or 03XXXXXXXXX'
    )
    .min(11, 'Contact number is required'),
  marital_status: z.enum(['Single', 'Married', 'Divorced', 'Widowed'], {
    message: ' Please select marital status',
  }),

  CNIC: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, 'CNIC format: 12345-1234567-1')
    .min(1, 'CNIC is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  employment_status: z.enum(
    ['Employed', 'Self-Employed', 'Unemployed', 'Student'],
    {
      message: 'Please select employment status',
    }
  ),
  monthly_income: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : Math.max(0, parsed);
      }
      return Math.max(0, val || 0);
    })
    .refine((val) => val >= 30000, {
      message: 'Monthly income must be at least PKR 30,000',
    })
    .refine((val) => val <= 10000000, {
      message: 'Monthly income seems too high (max PKR 10,000,000)',
    }),
  organization_name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters'),
  loan_type: z.number().min(1, 'Please select a loan type'),
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => {
      console.log('vlaue of val', val);
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    })
    .refine((val) => val !== undefined && val >= 1000, {
      message: 'Minimum loan amount is PKR 1,000',
    })
    .refine((val) => val !== undefined && val <= 10000000, {
      message: 'Maximum loan amount is PKR 10,000,000',
    }),
  purpose: z
    .string()
    .min(20, 'Purpose must be at least 20 characters')
    .max(500, 'Purpose must not exceed 500 characters'),
  duration: z
    .string()
    .min(1, 'Loan duration is required')
    .regex(/^\d+$/, 'Duration must be a number'),
});

// Simple interest calculation as per your requirements
const calculateLoanDetails = (amount, duration, interestRate) => {
  const principal = Number(amount);
  const months = Number(duration);
  const rate = Number(interestRate);

  if (!principal || !months || rate === undefined || rate === null) return null;

  // Simple interest formula: Interest = Principal × Rate / 100
  const interest = principal * (rate / 100);

  // Total payable = Principal + Interest
  const totalPayable = principal + interest;

  // Monthly installment = Total Payable / Duration
  const monthlyInstallment = totalPayable / months;

  return {
    principal: Math.round(principal),
    interest: Math.round(interest),
    totalPayable: Math.round(totalPayable),
    monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
    interestRate: rate,
    duration: months,
  };
};

export default function LoanApplicationForm() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [calculatedLoan, setCalculatedLoan] = useState(null);
  const { toast } = useToast();

  // ✅ FIXED: Use correct API hooks
  const [applyLoan, { isLoading: isSubmitting }] = useApplyLoanMutation();
  const {
    data: loanTypesData = [], // Default to empty array
    isLoading: loadingLoanTypes,
    error: loanTypesError,
    refetch: refetchLoanTypes,
  } = useGetUserLoanTypesQuery(); // ✅ Use user endpoint

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      fullname: '',
      address: '',
      contact: '',
      marital_status: '',
      CNIC: '',
      email: '',
      employment_status: '',
      monthly_income: 0,
      organization_name: '',
      loan_type: 0,
      amount: 0,
      purpose: '',
      duration: '',
    },
  });

  // Watch form values for loan calculation
  const watchedValues = watch(['loan_type', 'amount', 'duration']);
  const [selectedLoanType, selectedAmount, selectedDuration] = watchedValues;

  // Get current user data on component mount
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setValue('email', user.email || '');
    }
  }, [setValue]);

  // Calculate loan details when relevant values change
  useEffect(() => {
    const loanTypeInfo = loanTypesData?.find(
      (lt) => lt.id === Number(selectedLoanType)
    );

    if (loanTypeInfo && selectedAmount && selectedDuration) {
      const calculation = calculateLoanDetails(
        selectedAmount,
        selectedDuration,
        loanTypeInfo.interest_rate
      );
      setCalculatedLoan(calculation);
    } else {
      setCalculatedLoan(null);
    }
  }, [selectedLoanType, selectedAmount, selectedDuration, loanTypesData]);

  const selectedLoanTypeInfo = loanTypesData?.find(
    (lt) => lt.id === Number(selectedLoanType)
  );

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        loan_type: Number(data.loan_type),
        amount: Number(data.amount),
        monthly_income: Number(data.monthly_income),
      };

      console.log('Submitting loan application:', formattedData);

      const result = await applyLoan(formattedData).unwrap();

      console.log('Loan application submitted successfully:', result);

      toast({
        title: 'Application Submitted',
        description: 'Your loan application has been submitted successfully!',
        variant: 'default',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit loan application:', error);

      let errorMessage = 'Failed to submit loan application. Please try again.';
      if (error?.data?.documents) {
        errorMessage = error.data.documents;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      }

      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Loading state for loan types
  if (loadingLoanTypes) {
    return (
      <div className='flex items-center justify-center p-8'>
        <FiLoader className='w-6 h-6 animate-spin text-primary' />
        <span className='ml-2'>Loading loan types...</span>
      </div>
    );
  }

  // Error state for loan types
  if (loanTypesError) {
    return (
      <div className='text-center p-8'>
        <FiAlertTriangle className='w-12 h-12 text-red-500 mx-auto mb-4' />
        <h3 className='text-lg font-medium mb-2 text-red-600'>
          Failed to Load Loan Types
        </h3>
        <p className='text-gray-600 mb-4'>
          {loanTypesError?.data?.message ||
            'Unable to fetch loan types from server.'}
        </p>
        <Button onClick={refetchLoanTypes} variant='outline'>
          <FiLoader className='w-4 h-4 mr-2' />
          Retry
        </Button>
      </div>
    );
  }

  // No loan types available
  if (!loanTypesData || loanTypesData.length === 0) {
    return (
      <div className='text-center p-8'>
        <FiAlertTriangle className='w-12 h-12 text-yellow-500 mx-auto mb-4' />
        <h3 className='text-lg font-medium mb-2 text-yellow-600'>
          No Loan Types Available
        </h3>
        <p className='text-gray-600 mb-4'>
          There are currently no loan types available for application.
        </p>
        <Button onClick={refetchLoanTypes} variant='outline'>
          <FiLoader className='w-4 h-4 mr-2' />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* API Status Info */}
      <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
        <div className='flex items-center gap-2 text-green-800'>
          <FiCheck className='w-5 h-5' />
          <div>
            <p className='font-medium'>Loan Types Loaded Successfully</p>
            <p className='text-sm'>
              Found {loanTypesData.length} loan type(s) available for
              application.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='text-lg font-semibold mb-4 text-primary'>
          Personal Information
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Full Name *
            </label>
            <Input
              {...register('fullname')}
              placeholder='Enter your full name'
              className={errors.fullname ? 'border-red-500' : ''}
            />
            {errors.fullname && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.fullname.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Email *</label>
            <Input
              {...register('email')}
              type='email'
              placeholder='Enter your email'
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Contact Number *
            </label>
            <Input
              {...register('contact')}
              placeholder='+923216832148 or 03216832148'
              className={errors.contact ? 'border-red-500' : ''}
            />
            <p className='text-xs text-gray-500 mt-1'>
              Format: +923XXXXXXXXX or 03XXXXXXXXX
            </p>
            {errors.contact && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.contact.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>CNIC *</label>
            <Input
              {...register('CNIC')}
              placeholder='12345-1234567-1'
              className={errors.CNIC ? 'border-red-500' : ''}
            />
            {errors.CNIC && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.CNIC.message}
              </p>
            )}
          </div>

          <div className='md:col-span-2'>
            <label className='block text-sm font-medium mb-2'>Address *</label>
            <Textarea
              {...register('address')}
              placeholder='Enter your complete address'
              rows={3}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Marital Status *
            </label>
            <select
              {...register('marital_status')}
              className={`w-full rounded-md border p-2 bg-white ${
                errors.marital_status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>Select marital status</option>
              <option value='Single'>Single</option>
              <option value='Married'>Married</option>
              <option value='Divorced'>Divorced</option>
              <option value='Widowed'>Widowed</option>
            </select>
            {errors.marital_status && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.marital_status.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Employment Information Section */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='text-lg font-semibold mb-4 text-primary'>
          Employment Information
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Employment Status *
            </label>
            <select
              {...register('employment_status')}
              className={`w-full rounded-md border p-2 bg-white ${
                errors.employment_status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>Select employment status</option>
              <option value='Employed'>Employed</option>
              <option value='Self-Employed'>Self-Employed</option>
              <option value='Unemployed'>Unemployed</option>
              <option value='Student'>Student</option>
            </select>
            {errors.employment_status && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.employment_status.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Monthly Income (PKR) *
            </label>
            <Input
              {...register('monthly_income', { valueAsNumber: true })}
              type='number'
              placeholder='50000'
              min='0' // ✅ ADDED: Prevents negative values
              step='1'
              className={errors.monthly_income ? 'border-red-500' : ''}
            />
            {errors.monthly_income && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.monthly_income.message}
              </p>
            )}
          </div>

          <div className='md:col-span-2'>
            <label className='block text-sm font-medium mb-2'>
              Organization Name *
            </label>
            <Input
              {...register('organization_name')}
              placeholder='Enter your organization/company name'
              className={errors.organization_name ? 'border-red-500' : ''}
            />
            {errors.organization_name && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.organization_name.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Loan Information Section */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='text-lg font-semibold mb-4 text-primary'>
          Loan Information
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Loan Type *
            </label>
            <select
              {...register('loan_type', { valueAsNumber: true })}
              className={`w-full rounded-md border p-2 bg-white ${
                errors.loan_type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={0}>Select a loan type</option>
              {loanTypesData?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.interest_rate}% interest rate
                </option>
              ))}
            </select>
            {selectedLoanTypeInfo && (
              <div className='mt-2 text-sm text-gray-600 space-y-1'>
                <p className='flex items-center'>
                  <FiCheck className='w-3 h-3 mr-1 text-green-500' />
                  Selected: {selectedLoanTypeInfo.name}
                </p>
                <p className='text-blue-600'>
                  Interest Rate: {selectedLoanTypeInfo.interest_rate}% (Simple
                  Interest)
                </p>
              </div>
            )}
            {errors.loan_type && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.loan_type.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Amount Requested (PKR) *
            </label>
            <Input
              {...register('amount', { valueAsNumber: true })}
              type='number'
              placeholder='100000'
              className={errors.amount ? 'border-red-500' : ''}
            />
            <p className='text-xs text-gray-500 mt-1'>
              Enter amount in Pakistani Rupees (PKR)
            </p>
            {errors.amount && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Duration (months) *
            </label>
            <select
              {...register('duration')}
              className={`w-full rounded-md border p-2 bg-white ${
                errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value=''>Select duration</option>
              <option value='3'>3 months</option>
              <option value='6'>6 months</option>
              <option value='9'>9 months</option>
              <option value='12'>12 months</option>
            </select>
            <p className='text-xs text-gray-500 mt-1'>
              Available options: 3, 6, 9, or 12 months
            </p>
            {errors.duration && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.duration.message}
              </p>
            )}
          </div>

          <div className='md:col-span-2'>
            <label className='block text-sm font-medium mb-2'>Purpose *</label>
            <Textarea
              {...register('purpose')}
              placeholder='Describe the purpose of your loan in detail'
              rows={4}
              className={errors.purpose ? 'border-red-500' : ''}
            />
            {errors.purpose && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <FiX className='w-3 h-3 mr-1' />
                {errors.purpose.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Loan Calculation Display */}
      {calculatedLoan && (
        <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
          <h3 className='font-medium text-green-800 mb-3 flex items-center'>
            <Calculator className='w-5 h-5 mr-2' />
            Loan Calculation Summary (Simple Interest)
          </h3>

          {/* Calculation Formula Display */}
          <div className='bg-white p-3 rounded border mb-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              Calculation Formula:
            </h4>
            <div className='text-sm text-gray-600 space-y-1'>
              <p>• Interest = Principal × (Interest Rate / 100)</p>
              <p>
                • Interest = {calculatedLoan.principal.toLocaleString()} × (
                {calculatedLoan.interestRate}% / 100) = PKR{' '}
                {calculatedLoan.interest.toLocaleString()}
              </p>
              <p>
                • Total Payable = Principal + Interest = PKR{' '}
                {calculatedLoan.totalPayable.toLocaleString()}
              </p>
              <p>
                • Monthly Installment = Total Payable / Duration = PKR{' '}
                {calculatedLoan.monthlyInstallment.toLocaleString()}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Principal Amount</p>
              <p className='text-lg font-semibold text-blue-600'>
                PKR {calculatedLoan.principal.toLocaleString()}
              </p>
            </div>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Interest Amount</p>
              <p className='text-lg font-semibold text-orange-600'>
                PKR {calculatedLoan.interest.toLocaleString()}
              </p>
            </div>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Total Payable</p>
              <p className='text-lg font-semibold text-purple-600'>
                PKR {calculatedLoan.totalPayable.toLocaleString()}
              </p>
            </div>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Monthly Installment</p>
              <p className='text-lg font-semibold text-green-600'>
                PKR {calculatedLoan.monthlyInstallment.toLocaleString()}
              </p>
            </div>
          </div>

          <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Interest Rate</p>
              <p className='text-sm font-medium text-gray-700'>
                {calculatedLoan.interestRate}% (Simple Interest)
              </p>
            </div>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Loan Duration</p>
              <p className='text-sm font-medium text-gray-700'>
                {calculatedLoan.duration} months
              </p>
            </div>
          </div>

          <p className='text-xs text-green-700 mt-3'>
            * This calculation is based on simple interest formula. Final terms
            are subject to approval and verification.
          </p>
        </div>
      )}

      {/* Required Documents Info */}
      <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
        <h3 className='font-medium text-blue-800 mb-2'>Required Documents</h3>
        <ul className='list-disc pl-5 text-sm text-blue-700 space-y-1'>
          <li>Valid CNIC copy (front and back)</li>
          <li>Recent salary slip or income proof</li>
          <li>Bank statement (last 3 months)</li>
          <li>Utility bill for address verification</li>
          <li>Employment letter or business registration</li>
        </ul>
        <p className='text-xs text-blue-600 mt-2'>
          * You will need to upload these documents after submitting your
          application
        </p>
      </div>

      <Button
        type='submit'
        className='w-full py-3 text-lg font-semibold'
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <FiLoader className='w-5 h-5 mr-2 animate-spin' />
            Submitting Application...
          </>
        ) : (
          <>
            <FiCheck className='w-5 h-5 mr-2' />
            Submit Loan Application
          </>
        )}
      </Button>
    </form>
  );
}
