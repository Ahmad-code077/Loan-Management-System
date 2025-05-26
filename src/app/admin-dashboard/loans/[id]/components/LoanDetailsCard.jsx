import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiDollarSign, FiCalendar, FiX } from 'react-icons/fi';
import { formatCurrency, getLoanTypeName } from '../../utils/loanUtils';

export default function LoanDetailsCard({ loan }) {
  return (
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
              {formatCurrency(loan.amount)}
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
              {loan.loan_holder ? 'Active Loan Holder' : 'Not a Loan Holder'}
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
                {formatCurrency(loan.total_payable)}
              </p>
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium text-muted-foreground'>
                Monthly Installment
              </label>
              <p className='text-2xl font-bold text-blue-600'>
                {formatCurrency(loan.monthly_installment)}
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
                <p className='text-red-700 mt-1'>{loan.rejection_reason}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
