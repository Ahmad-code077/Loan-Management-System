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
import { FiCheck, FiX, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Fallback loan types - only used when API fails or returns no data
const FALLBACK_LOAN_TYPES = [
  {
    id: 1,
    name: 'Personal Loan',
    interest_rate: '12.00',
  },
  {
    id: 2,
    name: 'Business Loan',
    interest_rate: '12.00',
  },
];

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
    .min(1000, 'Minimum loan amount is PKR 1,000')
    .max(10000000, 'Maximum loan amount is PKR 10,000,000'),
  purpose: z
    .string()
    .min(20, 'Purpose must be at least 20 characters')
    .max(500, 'Purpose must not exceed 500 characters'),
  duration: z
    .string()
    .min(1, 'Loan duration is required')
    .regex(/^\d+$/, 'Duration must be a number'),
});

// Updated loan calculation function based on your requirements
const calculateLoanDetails = (amount, duration, interestRate) => {
  const principal = Number(amount);
  const months = Number(duration);
  const rate = Number(interestRate);

  if (!principal || !months || !rate) return null;

  // Step 2: Calculate interest using your formula
  // interest = amount × (interest_rate / 100)
  const interest = principal * (rate / 100);

  // Step 3: Calculate total payable
  // total_payable = amount + interest
  const totalPayable = principal + interest;

  // Step 3: Calculate monthly installment
  // monthly_installment = total_payable / months
  const monthlyInstallment = totalPayable / months;

  return {
    principal: Math.round(principal),
    interest: Math.round(interest),
    totalPayable: Math.round(totalPayable),
    monthlyInstallment: Math.round(monthlyInstallment * 100) / 100, // Round to 2 decimal places
    interestRate: rate,
    duration: months,
  };
};

export default function LoanApplicationForm() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [calculatedLoan, setCalculatedLoan] = useState(null);
  const [usingFallback, setUsingFallback] = useState(true); // Start with fallback to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const { toast } = useToast();

  // API hooks
  const [applyLoan, { isLoading: isSubmitting }] = useApplyLoanMutation();
  const {
    data: loanTypesData,
    isLoading: loadingLoanTypes,
    error: loanTypesError,
  } = useGetLoanTypesQuery();

  // Ensure component is client-side rendered
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Smart loan types logic with fallback - only run on client
  const loanTypes = (() => {
    // Always use fallback during SSR to prevent hydration mismatch
    if (!isClient) {
      return FALLBACK_LOAN_TYPES;
    }

    // Priority 1: Use API data if available and not empty
    if (
      loanTypesData &&
      Array.isArray(loanTypesData) &&
      loanTypesData.length > 0
    ) {
      if (usingFallback) setUsingFallback(false);
      return loanTypesData;
    }

    // Priority 2: Use fallback if API failed or returned empty data
    if (
      loanTypesError ||
      !loanTypesData ||
      (Array.isArray(loanTypesData) && loanTypesData.length === 0)
    ) {
      if (!usingFallback) setUsingFallback(true);
      return FALLBACK_LOAN_TYPES;
    }

    // Priority 3: Return fallback if still loading
    if (!usingFallback) setUsingFallback(true);
    return FALLBACK_LOAN_TYPES;
  })();

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
    if (isClient) {
      const user = authUtils.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        // Pre-fill email from user data
        setValue('email', user.email || '');
      }
    }
  }, [setValue, isClient]);

  // Calculate loan details when relevant values change (immediate calculation)
  useEffect(() => {
    if (isClient) {
      const loanTypeInfo = loanTypes?.find(
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
    }
  }, [selectedLoanType, selectedAmount, selectedDuration, loanTypes, isClient]);

  const selectedLoanTypeInfo = loanTypes?.find(
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
        title: 'Application Submitted',
        description: 'Your loan application has been submitted successfully!',
        variant: 'default',
      });

      // Redirect after a short delay
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
      }

      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Show loading state only when necessary and on client
  if (!isClient) {
    return (
      <div className='flex items-center justify-center p-8'>
        <FiLoader className='w-6 h-6 animate-spin text-primary' />
        <span className='ml-2'>Loading...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Fallback Warning - Show when using fallback data and on client */}
      {isClient && usingFallback && (
        <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <div className='flex items-center gap-2 text-yellow-800'>
            <FiAlertTriangle className='w-5 h-5' />
            <div>
              <p className='font-medium'>Using Default Loan Types</p>
              <p className='text-sm'>
                Using default options: Personal Loan and Business Loan (12%
                interest rate).
                {loanTypesError &&
                  ' Please check your internet connection or try refreshing the page.'}
              </p>
            </div>
          </div>
        </div>
      )}

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
              {loanTypes?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.interest_rate}% interest rate
                  {usingFallback ? ' (Default)' : ''}
                </option>
              ))}
            </select>
            {selectedLoanTypeInfo && (
              <div className='mt-2 text-sm text-gray-600 space-y-1'>
                <p className='flex items-center'>
                  <FiCheck className='w-3 h-3 mr-1 text-green-500' />
                  Selected: {selectedLoanTypeInfo.name}
                  {usingFallback && (
                    <span className='ml-1 text-yellow-600 text-xs'>
                      (Default Option)
                    </span>
                  )}
                </p>
                <p className='text-blue-600'>
                  Interest Rate: {selectedLoanTypeInfo.interest_rate}%
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

      {/* Loan Calculation Display - Shows immediately when user selects inputs */}
      {calculatedLoan && (
        <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
          <h3 className='font-medium text-green-800 mb-3 flex items-center'>
            <Calculator className='w-5 h-5 mr-2' />
            Loan Calculation Summary
            {usingFallback && (
              <span className='ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded'>
                Using Default Rates
              </span>
            )}
          </h3>

          {/* Calculation Formula Display */}
          <div className='bg-white p-3 rounded border mb-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              Calculation Formula:
            </h4>
            <div className='text-sm text-gray-600 space-y-1'>
              <p>• Interest = Amount × (Interest Rate / 100)</p>
              <p>
                • Interest = {calculatedLoan.principal.toLocaleString()} × (
                {calculatedLoan.interestRate}% / 100) = PKR{' '}
                {calculatedLoan.interest.toLocaleString()}
              </p>
              <p>
                • Total Payable = Amount + Interest = PKR{' '}
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

          {/* Additional Details */}
          <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white p-3 rounded border'>
              <p className='text-xs text-gray-500'>Interest Rate</p>
              <p className='text-sm font-medium text-gray-700'>
                {calculatedLoan.interestRate}% (Fixed Rate)
                {usingFallback && (
                  <span className='ml-1 text-yellow-600 text-xs'>
                    (Default)
                  </span>
                )}
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
            * This calculation is based on the simple interest formula as per
            your loan policy. Final terms are subject to approval and
            verification.
            {usingFallback &&
              ' Using default interest rates due to server connectivity issues.'}
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
