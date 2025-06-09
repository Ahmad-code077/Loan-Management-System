'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  useUpdateLoanMutation,
  useGetLoanDetailsQuery,
  useGetLoanTypesQuery,
} from '@/lib/store/authApi';
import { authUtils } from '@/lib/auth/authUtils';
import {
  FiCheck,
  FiX,
  FiLoader,
  FiAlertTriangle,
  FiArrowLeft,
  FiEdit3,
} from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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

// Same Zod validation schema as in the create form
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

// Loan calculation function
const calculateLoanDetails = (amount, duration, interestRate) => {
  const principal = Number(amount);
  const months = Number(duration);
  const rate = Number(interestRate);

  if (!principal || !months || !rate) return null;

  const interest = principal * (rate / 100);
  const totalPayable = principal + interest;
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

export default function EditLoanPage() {
  const router = useRouter();
  const params = useParams();
  const loanId = params.id;
  const [calculatedLoan, setCalculatedLoan] = useState(null);
  const [usingFallback, setUsingFallback] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  // API hooks
  const [updateLoan, { isLoading: isSubmitting }] = useUpdateLoanMutation();
  const {
    data: loanData,
    isLoading: loadingLoan,
    error: loanError,
  } = useGetLoanDetailsQuery(loanId);
  const {
    data: loanTypesData,
    isLoading: loadingLoanTypes,
    error: loanTypesError,
  } = useGetLoanTypesQuery();

  // Ensure component is client-side rendered
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Smart loan types logic with fallback
  const loanTypes = (() => {
    if (!isClient) {
      return FALLBACK_LOAN_TYPES;
    }

    if (
      loanTypesData &&
      Array.isArray(loanTypesData) &&
      loanTypesData.length > 0
    ) {
      if (usingFallback) setUsingFallback(false);
      return loanTypesData;
    }

    if (
      loanTypesError ||
      !loanTypesData ||
      (Array.isArray(loanTypesData) && loanTypesData.length === 0)
    ) {
      if (!usingFallback) setUsingFallback(true);
      return FALLBACK_LOAN_TYPES;
    }

    if (!usingFallback) setUsingFallback(true);
    return FALLBACK_LOAN_TYPES;
  })();

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  // Auto-fill form when loan data is loaded
  useEffect(() => {
    if (loanData && isClient) {
      // Check if loan can be edited
      if (loanData.status !== 'pending') {
        toast({
          title: 'Cannot Edit Loan',
          description: `This loan cannot be edited because it is ${loanData.status}. Only pending loans can be modified.`,
          variant: 'destructive',
        });
        router.push('/loans');
        return;
      }

      // Auto-fill the form with existing loan data
      reset({
        fullname: loanData.fullname || '',
        address: loanData.address || '',
        contact: loanData.contact || '',
        marital_status: loanData.marital_status || '',
        CNIC: loanData.CNIC || '',
        email: loanData.email || '',
        employment_status: loanData.employment_status || '',
        monthly_income: Number(loanData.monthly_income) || 0,
        organization_name: loanData.organization_name || '',
        loan_type: Number(loanData.loan_type) || 0,
        amount: Number(loanData.amount) || 0,
        purpose: loanData.purpose || '',
        duration: String(loanData.duration) || '',
      });
    }
  }, [loanData, reset, isClient, toast, router]);

  // Calculate loan details when relevant values change
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

      const result = await updateLoan({
        id: loanId,
        loanData: formattedData,
      }).unwrap();

      // Show success message and redirect
      toast({
        title: 'Loan Updated Successfully',
        description: 'Your loan application has been updated successfully!',
        variant: 'default',
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/loans');
      }, 2000);
    } catch (error) {
      console.error('Failed to update loan application:', error);

      let errorMessage = 'Failed to update loan application. Please try again.';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      }

      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (!isClient || loadingLoan) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <Card className='p-8 shadow-lg border-0 text-center'>
              <FiLoader className='w-8 h-8 animate-spin text-primary mx-auto mb-4' />
              <h2 className='text-xl font-semibold mb-2'>
                Loading Loan Data...
              </h2>
              <p className='text-gray-600'>
                Please wait while we fetch your loan information.
              </p>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (loanError) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <Card className='p-8 shadow-lg border-0 text-center'>
              <FiAlertTriangle className='w-16 h-16 text-red-500 mx-auto mb-4' />
              <h2 className='text-xl font-semibold mb-2 text-red-600'>
                Error Loading Loan
              </h2>
              <p className='text-gray-600 mb-4'>
                Failed to load loan details. The loan may not exist or you may
                not have permission to edit it.
              </p>
              <Link href='/loans'>
                <Button>Back to All Loans</Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-6'>
            <Link
              href='/loans'
              className='inline-flex items-center text-primary hover:text-primary/80 mb-4'
            >
              <FiArrowLeft className='w-4 h-4 mr-2' />
              Back to All Loans
            </Link>
            <div className='flex items-center gap-3 mb-2'>
              <FiEdit3 className='w-6 h-6 text-primary' />
              <h1 className='text-3xl font-bold text-gray-900'>
                Edit Loan Application
              </h1>
            </div>
            <p className='text-gray-600'>
              Update your loan application details. Only pending loans can be
              modified.
            </p>
          </div>

          {/* Loan Status Info */}
          <Card className='p-4 mb-6 bg-blue-50 border-blue-200'>
            <div className='flex items-center gap-2 text-blue-800'>
              <FiAlertTriangle className='w-5 h-5' />
              <div>
                <p className='font-medium'>Editing Loan #{loanId}</p>
                <p className='text-sm text-blue-700'>
                  Status: {loanData?.status?.toUpperCase()} • Applied:{' '}
                  {new Date(
                    loanData?.created_at || Date.now()
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Main Form Card */}
          <Card className='p-8 shadow-lg border-0'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Fallback Warning */}
              {isClient && usingFallback && (
                <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                  <div className='flex items-center gap-2 text-yellow-800'>
                    <FiAlertTriangle className='w-5 h-5' />
                    <div>
                      <p className='font-medium'>Using Default Loan Types</p>
                      <p className='text-sm'>
                        Using default options: Personal Loan and Business Loan
                        (12% interest rate).
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
                    <label className='block text-sm font-medium mb-2'>
                      Email *
                    </label>
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
                    <label className='block text-sm font-medium mb-2'>
                      CNIC *
                    </label>
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
                    <label className='block text-sm font-medium mb-2'>
                      Address *
                    </label>
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
                        errors.marital_status
                          ? 'border-red-500'
                          : 'border-gray-300'
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
                        errors.employment_status
                          ? 'border-red-500'
                          : 'border-gray-300'
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
                      className={
                        errors.organization_name ? 'border-red-500' : ''
                      }
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
                    <label className='block text-sm font-medium mb-2'>
                      Purpose *
                    </label>
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
                    Updated Loan Calculation
                    {usingFallback && (
                      <span className='ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded'>
                        Using Default Rates
                      </span>
                    )}
                  </h3>

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
                      <p className='text-xs text-gray-500'>
                        Monthly Installment
                      </p>
                      <p className='text-lg font-semibold text-green-600'>
                        PKR {calculatedLoan.monthlyInstallment.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex gap-4'>
                <Button
                  type='submit'
                  className='flex-1 py-3 text-lg font-semibold'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className='w-5 h-5 mr-2 animate-spin' />
                      Updating Loan...
                    </>
                  ) : (
                    <>
                      <FiCheck className='w-5 h-5 mr-2' />
                      Update Loan Application
                    </>
                  )}
                </Button>

                <Link href='/loans'>
                  <Button variant='outline' className='px-8 py-3'>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
