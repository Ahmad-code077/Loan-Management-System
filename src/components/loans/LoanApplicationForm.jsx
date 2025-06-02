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
  useGetLoanTypesQuery,
} from '@/lib/store/authApi';
import { authUtils } from '@/lib/auth/authUtils';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Zod validation schema with updated phone validation
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
    required_error: 'Please select marital status',
  }),
  CNIC: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, 'CNIC format: 12345-1234567-1')
    .min(1, 'CNIC is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  employment_status: z.enum(
    ['Employed', 'Self-Employed', 'Unemployed', 'Student'],
    {
      required_error: 'Please select employment status',
    }
  ),
  monthly_income: z
    .number()
    .min(0, 'Monthly income must be positive')
    .max(10000000, 'Monthly income seems too high'),
  organization_name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters'),
  loan_type: z.number().min(1, 'Please select a loan type'),
  amount: z
    .number()
    .min(1000, 'Minimum loan amount is $1,000')
    .max(1000000, 'Maximum loan amount is $1,000,000'),
  purpose: z
    .string()
    .min(20, 'Purpose must be at least 20 characters')
    .max(500, 'Purpose must not exceed 500 characters'),
  duration: z
    .string()
    .min(1, 'Loan duration is required')
    .regex(/^\d+$/, 'Duration must be a number'),
});

// Dummy loan types (will be replaced by API data when available)
const dummyLoanTypes = [
  {
    id: 1,
    name: 'Personal Loan',
    description: 'Quick personal financing for immediate needs',
    interest_rate: 12.5,
    min_amount: 10000,
    max_amount: 500000,
    max_duration: 60,
  },
  {
    id: 2,
    name: 'Business Loan',
    description: 'Capital for business expansion and operations',
    interest_rate: 10.0,
    min_amount: 50000,
    max_amount: 2000000,
    max_duration: 120,
  },
];

// Interest rate calculation function
const calculateInterest = (amount, duration, interestRate) => {
  const principal = Number(amount);
  const months = Number(duration);
  const rate = Number(interestRate) / 100;

  if (!principal || !months || !rate) return null;

  // Monthly interest rate
  const monthlyRate = rate / 12;

  // EMI calculation using compound interest formula
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalAmount = emi * months;
  const totalInterest = totalAmount - principal;

  return {
    emi: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    interestRate: interestRate,
  };
};

export default function LoanApplicationForm() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [calculatedInterest, setCalculatedInterest] = useState(null);
  const { toast } = useToast();

  // API hooks
  const [applyLoan, { isLoading: isSubmitting }] = useApplyLoanMutation();
  const { data: loanTypesData, isLoading: loadingLoanTypes } =
    useGetLoanTypesQuery();

  // Use API data if available, otherwise use dummy data
  const loanTypes = loanTypesData?.length > 0 ? loanTypesData : dummyLoanTypes;

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

  // Watch form values for interest calculation
  const watchedValues = watch(['loan_type', 'amount', 'duration']);
  const [selectedLoanType, selectedAmount, selectedDuration] = watchedValues;

  // Get current user data on component mount
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Pre-fill email from user data
      setValue('email', user.email || '');
    }
  }, [setValue]);

  // Calculate interest when relevant values change
  useEffect(() => {
    const loanTypeInfo = loanTypes.find(
      (lt) => lt.id === Number(selectedLoanType)
    );

    if (loanTypeInfo && selectedAmount && selectedDuration) {
      const calculation = calculateInterest(
        selectedAmount,
        selectedDuration,
        loanTypeInfo.interest_rate
      );
      setCalculatedInterest(calculation);
    } else {
      setCalculatedInterest(null);
    }
  }, [selectedLoanType, selectedAmount, selectedDuration, loanTypes]);

  const selectedLoanTypeInfo = loanTypes.find(
    (lt) => lt.id === Number(selectedLoanType)
  );

  const onSubmit = async (data) => {
    try {
      // Convert string numbers to actual numbers
      const formattedData = {
        ...data,
        loan_type: Number(data.loan_type),
        amount: Number(data.amount),
        monthly_income: Number(data.monthly_income),
      };

      console.log('Submitting loan application:', formattedData);

      const result = await applyLoan(formattedData).unwrap();

      console.log('Loan application submitted successfully:', result);

      // Show success message and redirect
      toast({
        title: 'Reset Email Sent',
        description: 'Please check your email for password reset instructions.',
        variant: 'default',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to submit loan application:', error);
      alert('Failed to submit loan application. Please try again.');
    }
  };

  if (loadingLoanTypes) {
    return (
      <div className='flex items-center justify-center p-8'>
        <FiLoader className='w-6 h-6 animate-spin text-primary' />
        <span className='ml-2'>Loading loan types...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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
              Monthly Income *
            </label>
            <Input
              {...register('monthly_income', { valueAsNumber: true })}
              type='number'
              placeholder='50000'
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
              {loanTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.interest_rate}% annual interest
                </option>
              ))}
            </select>
            {selectedLoanTypeInfo && (
              <div className='mt-2 text-sm text-gray-600 space-y-1'>
                <p className='flex items-center'>
                  <FiCheck className='w-3 h-3 mr-1 text-green-500' />
                  {selectedLoanTypeInfo.description}
                </p>
                <p className='text-blue-600'>
                  Interest Rate: {selectedLoanTypeInfo.interest_rate}% per annum
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
              Amount Requested *
            </label>
            {selectedLoanTypeInfo && (
              <p className='text-sm text-gray-600 mb-2'>
                Range: ${selectedLoanTypeInfo.min_amount?.toLocaleString()} - $
                {selectedLoanTypeInfo.max_amount?.toLocaleString()}
              </p>
            )}
            <Input
              {...register('amount', { valueAsNumber: true })}
              type='number'
              placeholder='100000'
              className={errors.amount ? 'border-red-500' : ''}
            />
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
              <option value='6'>6 months</option>
              <option value='12'>12 months</option>
              <option value='18'>18 months</option>
              <option value='24'>24 months</option>
              <option value='36'>36 months</option>
              <option value='48'>48 months</option>
              <option value='60'>60 months</option>
              <option value='72'>72 months</option>
              <option value='84'>84 months</option>
              <option value='96'>96 months</option>
              <option value='120'>120 months</option>
            </select>
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

      {/* Interest Rate Calculator */}
      {calculatedInterest && (
        <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
          <h3 className='font-medium text-green-800 mb-3 flex items-center'>
            <Calculator className='w-5 h-5 mr-2' />
            Loan Calculation Summary
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Monthly EMI</p>
              <p className='text-lg font-semibold text-green-600'>
                ${calculatedInterest.emi.toLocaleString()}
              </p>
            </div>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Total Interest</p>
              <p className='text-lg font-semibold text-orange-600'>
                ${calculatedInterest.totalInterest.toLocaleString()}
              </p>
            </div>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Total Amount</p>
              <p className='text-lg font-semibold text-blue-600'>
                ${calculatedInterest.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Interest Rate</p>
              <p className='text-lg font-semibold text-purple-600'>
                {calculatedInterest.interestRate}% p.a.
              </p>
            </div>
          </div>
          <p className='text-xs text-green-700 mt-2'>
            * This is an estimated calculation. Final terms may vary based on
            approval.
          </p>
        </div>
      )}

      {/* Required Documents Info */}
      <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
        <h3 className='font-medium text-blue-800 mb-2'>Required Documents</h3>
        <ul className='list-disc pl-5 text-sm text-blue-700 space-y-1'>
          <li>Valid CNIC copy</li>
          <li>Last 3 months bank statements</li>
          <li>Salary certificate or income proof</li>
          <li>Utility bill for address verification</li>
          <li>Employment letter (if employed)</li>
        </ul>
        <p className='text-xs text-blue-600 mt-2'>
          * You can upload these documents after submitting your application
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
