import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiDownload, FiFileText, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function DocsHeader({
  totalDocuments,
  filteredCount,
  documents = [],
}) {
  // ✅ Calculate verification statistics
  const verifiedCount = documents.filter((doc) => doc.is_verified).length;
  const pendingCount = documents.filter((doc) => !doc.is_verified).length;

  return (
    <div className='flex justify-between items-start'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold text-foreground'>
          Documents Management
        </h1>
        <p className='text-muted-foreground'>
          View and manage all uploaded documents
          {filteredCount !== totalDocuments
            ? ` (${filteredCount} of ${totalDocuments} documents)`
            : ` (${totalDocuments} documents)`}
        </p>

        {/* ✅ Verification Status Summary */}
        <div className='flex items-center space-x-4 mt-2'>
          <Badge
            variant='default'
            className='bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200'
          >
            <FiCheckCircle className='w-3 h-3 mr-1' />
            {verifiedCount} Verified
          </Badge>
          <Badge
            variant='secondary'
            className='bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200'
          >
            <FiClock className='w-3 h-3 mr-1' />
            {pendingCount} Pending
          </Badge>
        </div>
      </div>

      {/* ✅ Export Actions */}
      <div className='flex items-center space-x-2'>
        <Button variant='outline' size='sm'>
          <FiDownload className='w-4 h-4 mr-2' />
          Export All
        </Button>
        <Button variant='outline' size='sm'>
          <FiFileText className='w-4 h-4 mr-2' />
          Generate Report
        </Button>
      </div>
    </div>
  );
}
