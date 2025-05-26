import { Button } from '@/components/ui/button';
import { FiDownload, FiFileText } from 'react-icons/fi';

export default function DocsHeader({ totalDocuments, filteredCount }) {
  return (
    <div className='flex justify-between items-center'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>
          Documents Management
        </h1>
        <p className='text-muted-foreground mt-1'>
          View and manage all uploaded documents
          {filteredCount !== totalDocuments
            ? ` (${filteredCount} of ${totalDocuments} documents)`
            : ` (${totalDocuments} documents)`}
        </p>
      </div>
      <div className='flex space-x-2'>
        <Button variant='outline' className='border-border'>
          <FiDownload className='w-4 h-4 mr-2' />
          Export
        </Button>
        <Button variant='outline' className='border-border'>
          <FiFileText className='w-4 h-4 mr-2' />
          Generate Report
        </Button>
      </div>
    </div>
  );
}
