import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiEye, FiDownload, FiExternalLink } from 'react-icons/fi';
import { isImageFile } from '../../utils/documentUtils';

export default function DocsPreviewCard({ document }) {
  const handleDownload = () => {
    window.open(document.file, '_blank');
  };

  const handleViewFull = () => {
    window.open(document.file, '_blank');
  };

  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <CardTitle className='flex items-center text-card-foreground'>
          <FiEye className='w-5 h-5 mr-2 text-green-600' />
          Document Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {isImageFile(document.file) ? (
            <div className='relative'>
              <img
                src={document.file}
                alt={document.document_type}
                className='w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200'
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className='hidden text-center py-8 text-muted-foreground'>
                <p>Unable to load image preview</p>
              </div>
            </div>
          ) : (
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
              <div className='space-y-2'>
                <FiEye className='w-12 h-12 text-gray-400 mx-auto' />
                <p className='text-muted-foreground'>
                  Preview not available for this file type
                </p>
                <p className='text-sm text-muted-foreground'>
                  Click &quot;View Original&quot; to open the file
                </p>
              </div>
            </div>
          )}

          <div className='flex space-x-2'>
            <Button
              onClick={handleViewFull}
              variant='outline'
              className='flex-1 border-border'
            >
              <FiExternalLink className='w-4 h-4 mr-2' />
              View Original
            </Button>
            <Button
              onClick={handleDownload}
              className='flex-1 bg-primary hover:bg-primary/90'
            >
              <FiDownload className='w-4 h-4 mr-2' />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
