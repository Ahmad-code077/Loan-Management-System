import { Button } from '@/components/ui/button';
import { FiPlus, FiDownload } from 'react-icons/fi';

export default function LoanTypesHeader({ onAddNew, totalTypes }) {
  return (
    <div className='flex justify-between items-center'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>
          Loan Types Management
        </h1>
        <p className='text-muted-foreground mt-1'>
          Manage all loan types and their interest rates ({totalTypes} types)
        </p>
      </div>
      <div className='flex space-x-2'>
        <Button onClick={onAddNew} className='bg-primary hover:bg-primary/90'>
          <FiPlus className='w-4 h-4 mr-2' />
          Add Loan Type
        </Button>
      </div>
    </div>
  );
}
