import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiEye, FiDownload, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import {
  getDocumentTypeColor,
  formatDate,
  formatUserName,
} from '../utils/documentUtils';

export default function DocsRow({ document }) {
  const handleDownload = () => {
    window.open(document.file, '_blank');
  };

  return (
    <tr className='border-b border-border hover:bg-muted/50'>
      <td className='py-3 px-4 text-card-foreground font-medium'>
        #{document.id}
      </td>
      <td className='py-3 px-4'>
        <Badge
          className={`${getDocumentTypeColor(document.document_type)} border`}
        >
          {document.document_type}
        </Badge>
      </td>
      <td className='py-3 px-4'>
        <div className='flex items-center space-x-2'>
          <FiUser className='w-4 h-4 text-muted-foreground' />
          <div>
            <p className='font-medium text-card-foreground'>
              {formatUserName(document.user)}
            </p>
            <p className='text-sm text-muted-foreground'>
              @{document.user.username}
            </p>
          </div>
        </div>
      </td>
      <td className='py-3 px-4 text-muted-foreground text-sm'>
        {formatDate(document.uploaded_at)}
      </td>
      <td className='py-3 px-4'>
        <div className='flex space-x-2'>
          <Link href={`/admin-dashboard/documents/${document.id}`}>
            <Button
              variant='outline'
              size='sm'
              className='border-border hover:bg-blue-50'
            >
              <FiEye className='w-4 h-4' />
            </Button>
          </Link>
          <Button
            variant='outline'
            size='sm'
            onClick={handleDownload}
            className='border-border hover:bg-green-50'
          >
            <FiDownload className='w-4 h-4' />
          </Button>
        </div>
      </td>
    </tr>
  );
}
