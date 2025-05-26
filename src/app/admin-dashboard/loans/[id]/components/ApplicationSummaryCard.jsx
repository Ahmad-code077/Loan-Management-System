import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiFileText } from 'react-icons/fi';
import {
  getStatusColor,
  getLoanTypeName,
  formatLoanTypeName,
} from '../../utils/loanUtils';

export default function ApplicationSummaryCard({ loan, loanTypes }) {
  const loanTypeName = formatLoanTypeName(
    getLoanTypeName(loan.loan_type, loanTypes)
  );

  return (
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
              {loanTypeName}
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
  );
}
