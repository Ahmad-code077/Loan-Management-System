import { Button } from '@/components/ui/button';
import { authUtils } from '@/lib/auth/authUtils';

export default function UserInfoSection({
  isUpdating,
  documentToUpdate,
  handleCancelUpdate,
}) {
  const currentUser = authUtils.getCurrentUser();

  if (!currentUser) return null;

  return (
    <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
      <h3 className='font-medium text-blue-800 mb-2'>
        {isUpdating ? 'Update Document' : 'Upload Information'}
      </h3>
      <p className='text-sm text-blue-700'>
        {isUpdating ? 'Updating' : 'Uploading'} as:{' '}
        <span className='font-medium'>{currentUser.username}</span> (
        {currentUser.email})
      </p>
      <p className='text-xs text-blue-600 mt-1'>User ID: {currentUser.id}</p>
      {isUpdating && documentToUpdate && (
        <div className='mt-2 p-2 bg-blue-100 rounded'>
          <p className='text-xs text-blue-800'>
            Updating:{' '}
            <span className='font-medium'>
              {documentToUpdate.document_type}
            </span>
          </p>
          <Button
            variant='outline'
            size='sm'
            onClick={handleCancelUpdate}
            className='mt-1 text-xs h-6 px-2'
          >
            Cancel Update
          </Button>
        </div>
      )}
    </div>
  );
}
