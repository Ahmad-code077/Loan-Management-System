import { Button } from '@/components/ui/button';
import { FiLoader, FiUpload, FiShield, FiEdit3 } from 'react-icons/fi';

export default function SubmitButton({
  isUploading,
  isUpdatingDoc,
  isUpdating,
  existingDocument,
}) {
  const isLoading = isUploading || isUpdatingDoc;

  const isDisabled =
    isLoading ||
    (existingDocument?.is_verified && !isUpdating) ||
    (!isUpdating && existingDocument && !existingDocument.is_verified);

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <FiLoader className='w-5 h-5 mr-2 animate-spin' />
          {isUpdating ? 'Updating Document...' : 'Uploading Document...'}
        </>
      );
    }

    if (isUpdating) {
      return (
        <>
          <FiUpload className='w-5 h-5 mr-2' />
          Update Document
        </>
      );
    }

    if (existingDocument?.is_verified) {
      return (
        <>
          <FiShield className='w-5 h-5 mr-2' />
          Document Already Verified
        </>
      );
    }

    if (existingDocument) {
      return (
        <>
          <FiEdit3 className='w-5 h-5 mr-2' />
          Use Edit Button Above
        </>
      );
    }

    return (
      <>
        <FiUpload className='w-5 h-5 mr-2' />
        Upload Document
      </>
    );
  };

  return (
    <Button
      type='submit'
      className='w-full py-3 text-lg font-semibold'
      disabled={isDisabled}
    >
      {getButtonContent()}
    </Button>
  );
}
