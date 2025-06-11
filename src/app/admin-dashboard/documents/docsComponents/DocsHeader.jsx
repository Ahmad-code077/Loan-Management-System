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
    </div>
  );
}
