'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FiEye,
  FiDownload,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function DocsRow({ document }) {
  const router = useRouter();
  // ✅ Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ✅ Format user name
  const getUserName = (user) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username;
  };

  // ✅ Get verification status badge
  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return (
        <Badge
          variant='default'
          className='bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
        >
          <FiCheckCircle className='w-3 h-3 mr-1' />
          Verified
        </Badge>
      );
    } else {
      return (
        <Badge
          variant='secondary'
          className='bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
        >
          <FiClock className='w-3 h-3 mr-1' />
          Pending
        </Badge>
      );
    }
  };

  // ✅ Handle file download
  const handleDownload = () => {
    if (document.file) {
      window.open(document.file, '_blank');
    }
  };

  // ✅ Handle document view
  const handleView = () => {
    router.push(`/admin-dashboard/documents/${document.id}`);
  };

  return (
    <tr className='border-b border-border hover:bg-muted/30 transition-colors'>
      {/* Document ID */}
      <td className='py-4 px-4'>
        <span className='font-mono text-sm text-muted-foreground'>
          #{document.id}
        </span>
      </td>

      {/* Document Type */}
      <td className='py-4 px-4'>
        <div className='flex items-center space-x-2'>
          <Badge variant='outline' className='text-xs'>
            {document.document_type}
          </Badge>
        </div>
      </td>

      {/* Uploaded By */}
      <td className='py-4 px-4'>
        <div className='flex items-center space-x-2'>
          <FiUser className='w-4 h-4 text-muted-foreground' />
          <div>
            <p className='font-medium text-card-foreground text-sm'>
              {getUserName(document.user)}
            </p>
            <p className='text-xs text-muted-foreground'>
              @{document.user.username}
            </p>
          </div>
        </div>
      </td>

      {/* Upload Date */}
      <td className='py-4 px-4'>
        <p className='text-sm text-card-foreground'>
          {formatDate(document.uploaded_at)}
        </p>
      </td>

      {/* ✅ Verification Status */}
      <td className='py-4 px-4'>
        {getVerificationBadge(document.is_verified)}
      </td>

      {/* Actions */}
      <td className='py-4 px-4'>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleView}
            className='h-8 px-2'
          >
            <FiEye className='w-3 h-3' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleDownload}
            className='h-8 px-2'
          >
            <FiDownload className='w-3 h-3' />
          </Button>
        </div>
      </td>
    </tr>
  );
}
