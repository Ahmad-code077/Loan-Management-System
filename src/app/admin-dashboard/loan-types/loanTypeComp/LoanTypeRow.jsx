import { Button } from '@/components/ui/button';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { formatInterestRate, formatLoanTypeName } from '../utils/loanTypeUtils';

export default function LoanTypeRow({ loanType, onEdit, onDelete }) {
  return (
    <tr className='border-b border-border hover:bg-muted/50'>
      <td className='py-3 px-4 text-card-foreground font-medium'>
        #{loanType.id}
      </td>
      <td className='py-3 px-4'>
        <p className='font-medium text-card-foreground'>
          {formatLoanTypeName(loanType.name)}
        </p>
      </td>
      <td className='py-3 px-4'>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
          {formatInterestRate(loanType.interest_rate)}
        </span>
      </td>
      <td className='py-3 px-4'>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onEdit(loanType)}
            className='border-border hover:bg-orange-50'
          >
            <FiEdit className='w-4 h-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onDelete(loanType)}
            className='text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50'
          >
            <FiTrash2 className='w-4 h-4' />
          </Button>
        </div>
      </td>
    </tr>
  );
}
