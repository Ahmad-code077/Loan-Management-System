import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiArrowLeft, FiDownload, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { getDocumentTypeColor } from '../../utils/documentUtils';

export default function DocsDetailHeader({ document }) {
  const handleDownload = () => {
    window.open(document.file, '_blank');
  };

  const handleViewOriginal = () => {
    window.open(document.file, '_blank');
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <Link href='/admin-dashboard/documents'>
          <Button variant='outline' size='sm' className='border-border'>
            <FiArrowLeft className='w-4 h-4 mr-2' />
            Back to Documents
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Document #{document.id}
          </h1>
          <p className='text-muted-foreground mt-1'>
            {document.document_type} uploaded by {document.user.username}
          </p>
        </div>
      </div>

      <div className='flex items-center space-x-3'>
        <Badge
          className={`${getDocumentTypeColor(
            document.document_type
          )} border px-3 py-1`}
        >
          {document.document_type}
        </Badge>
        <div className='flex space-x-2'>
          <Button
            onClick={handleViewOriginal}
            variant='outline'
            className='border-border'
          >
            <FiExternalLink className='w-4 h-4 mr-2' />
            View Original
          </Button>
          <Button
            onClick={handleDownload}
            className='bg-primary hover:bg-primary/90'
          >
            <FiDownload className='w-4 h-4 mr-2' />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
