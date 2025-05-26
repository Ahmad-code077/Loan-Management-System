import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiFileText, FiCalendar, FiLink } from 'react-icons/fi';
import {
  getDocumentTypeColor,
  formatDate,
  getFileExtension,
} from '../../utils/documentUtils';

export default function DocsInfoCard({ document }) {
  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <CardTitle className='flex items-center text-card-foreground'>
          <FiFileText className='w-5 h-5 mr-2 text-blue-600' />
          Document Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-1'>
              <label className='text-sm font-medium text-muted-foreground'>
                Document ID
              </label>
              <p className='text-lg font-semibold text-card-foreground'>
                #{document.id}
              </p>
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium text-muted-foreground'>
                Document Type
              </label>
              <Badge
                className={`${getDocumentTypeColor(
                  document.document_type
                )} border w-fit`}
              >
                {document.document_type}
              </Badge>
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium text-muted-foreground'>
                Upload Date
              </label>
              <p className='text-lg text-card-foreground flex items-center'>
                <FiCalendar className='w-4 h-4 mr-2 text-blue-500' />
                {formatDate(document.uploaded_at)}
              </p>
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-medium text-muted-foreground'>
                File Format
              </label>
              <p className='text-lg text-card-foreground uppercase'>
                {getFileExtension(document.file)}
              </p>
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              File URL
            </label>
            <div className='flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200'>
              <FiLink className='w-4 h-4 text-gray-500' />
              <p className='text-sm text-gray-600 font-mono truncate flex-1'>
                {document.file}
              </p>
            </div>
          </div>

          <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
            <h4 className='text-sm font-semibold text-blue-800 mb-2'>
              Document Guidelines
            </h4>
            <ul className='text-xs text-blue-700 space-y-1'>
              <li>
                • Documents are stored securely and accessible only to
                authorized personnel
              </li>
              <li>• Original file quality and format are preserved</li>
              <li>• All document access is logged for security purposes</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
