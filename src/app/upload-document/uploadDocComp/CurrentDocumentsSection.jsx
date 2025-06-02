import { Button } from '@/components/ui/button';
import { FiEye, FiEdit3, FiShield, FiAlertCircle } from 'react-icons/fi';
import { getFileIcon } from './documentHelpers';

export default function CurrentDocumentsSection({
  userDocuments,
  isUpdating,
  documentToUpdate,
  handleViewDocument,
  handleEditDocument,
}) {
  if (!userDocuments || userDocuments.length === 0) return null;

  return (
    <div className='bg-gray-50 p-4 rounded-lg border'>
      <h3 className='font-medium text-gray-800 mb-3'>Your Current Documents</h3>
      <div className='grid grid-cols-1 gap-4'>
        {userDocuments.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${
              doc.is_verified
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            } ${
              isUpdating && documentToUpdate?.id === doc.id
                ? 'ring-2 ring-blue-400 ring-opacity-50'
                : ''
            }`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex-shrink-0'>
                  {getFileIcon(doc.file, doc.document_type)}
                </div>

                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    {doc.is_verified ? (
                      <FiShield className='w-4 h-4 text-green-600' />
                    ) : (
                      <FiAlertCircle className='w-4 h-4 text-yellow-600' />
                    )}
                    <span className='text-sm font-medium'>
                      {doc.document_type}
                    </span>
                    {isUpdating && documentToUpdate?.id === doc.id && (
                      <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                        Updating
                      </span>
                    )}
                  </div>
                  <p className='text-xs text-gray-600'>
                    {doc.is_verified
                      ? '✅ Verified'
                      : '⏳ Pending verification'}
                  </p>
                  <p className='text-xs text-gray-500'>
                    📅{' '}
                    {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {doc.file && (
                    <p className='text-xs text-gray-500 mt-1'>
                      📎 {doc.file.split('/').pop()}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex gap-2'>
                {doc.file && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleViewDocument(doc)}
                    className='text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50'
                  >
                    <FiEye className='w-4 h-4 mr-1' />
                    View
                  </Button>
                )}

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleEditDocument(doc)}
                  disabled={
                    doc.is_verified ||
                    (isUpdating && documentToUpdate?.id !== doc.id)
                  }
                  className={
                    doc.is_verified
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : isUpdating && documentToUpdate?.id === doc.id
                      ? 'text-blue-600 border-blue-400 bg-blue-50'
                      : 'text-orange-600 hover:text-orange-800 border-orange-200 hover:bg-orange-50'
                  }
                >
                  {doc.is_verified ? (
                    <>
                      <FiShield className='w-4 h-4 mr-1' />
                      Protected
                    </>
                  ) : isUpdating && documentToUpdate?.id === doc.id ? (
                    <>
                      <FiEdit3 className='w-4 h-4 mr-1' />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiEdit3 className='w-4 h-4 mr-1' />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
