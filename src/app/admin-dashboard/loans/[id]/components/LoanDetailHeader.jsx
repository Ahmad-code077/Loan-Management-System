import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { getStatusColor, getStatusIcon } from '../../utils/loanUtils';

export default function LoanDetailHeader({ loan, onApprove, onReject }) {
  const StatusIcon =
    getStatusIcon(loan.status) === 'FiCheck'
      ? FiCheck
      : getStatusIcon(loan.status) === 'FiX'
      ? FiX
      : null;

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <Link href='/admin-dashboard/loans'>
          <Button variant='outline' size='sm' className='border-border'>
            <FiArrowLeft className='w-4 h-4 mr-2' />
            Back to Loans
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Loan Application #{loan.id}
          </h1>
          <p className='text-muted-foreground mt-1'>
            Detailed view of {loan.fullname}&apos;s loan application
          </p>
        </div>
      </div>

      <div className='flex items-center space-x-3'>
        <Badge className={`${getStatusColor(loan.status)} border px-3 py-1`}>
          {StatusIcon && <StatusIcon className='w-4 h-4' />}
          <span className='ml-2 font-medium'>
            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
          </span>
        </Badge>
        {loan.status === 'pending' && (
          <div className='flex space-x-2'>
            <Button
              onClick={onApprove}
              className='bg-green-600 hover:bg-green-700'
            >
              <FiCheck className='w-4 h-4 mr-2' />
              Approve
            </Button>
            <Button
              onClick={onReject}
              variant='outline'
              className='text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50'
            >
              <FiX className='w-4 h-4 mr-2' />
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
