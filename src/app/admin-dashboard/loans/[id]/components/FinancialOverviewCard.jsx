import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiCreditCard } from 'react-icons/fi';
import { formatCurrency } from '../../utils/loanUtils';

export default function FinancialOverviewCard({ loan }) {
  return (
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
              <span className='text-muted-foreground'>Principal Amount</span>
              <span className='font-medium text-card-foreground'>
                {formatCurrency(loan.amount)}
              </span>
            </div>
          </div>
          <div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>
                Interest ({loan.interest}%)
              </span>
              <span className='font-medium text-orange-600'>
                {formatCurrency(loan.total_payable - loan.amount)}
              </span>
            </div>
          </div>
          <hr className='border-border' />
          <div>
            <div className='flex justify-between text-sm font-semibold'>
              <span className='text-card-foreground'>Total Payable</span>
              <span className='text-red-600'>
                {formatCurrency(loan.total_payable)}
              </span>
            </div>
          </div>
          <div className='bg-blue-50 p-3 rounded-lg border border-blue-200'>
            <div className='text-center'>
              <p className='text-xs text-blue-600 font-medium'>
                Monthly Payment
              </p>
              <p className='text-lg font-bold text-blue-700'>
                {formatCurrency(loan.monthly_installment)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
