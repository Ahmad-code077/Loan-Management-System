import { FiShield, FiAlertCircle } from 'react-icons/fi';

export default function DocumentWarningSection({
  existingDocument,
  isUpdating,
}) {
  if (!existingDocument || isUpdating) return null;

  return (
    <div
      className={`p-4 rounded-lg border ${
        existingDocument.is_verified
          ? 'bg-green-50 border-green-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}
    >
      <div className='flex items-center gap-2 mb-2'>
        {existingDocument.is_verified ? (
          <FiShield className='w-5 h-5 text-green-600' />
        ) : (
          <FiAlertCircle className='w-5 h-5 text-yellow-600' />
        )}
        <h3
          className={`font-medium ${
            existingDocument.is_verified ? 'text-green-800' : 'text-yellow-800'
          }`}
        >
          Existing Document Found
        </h3>
      </div>
      <p
        className={`text-sm ${
          existingDocument.is_verified ? 'text-green-700' : 'text-yellow-700'
        }`}
      >
        You already have a {existingDocument.document_type} document.
        {existingDocument.is_verified
          ? ' 🔒 It is verified and cannot be updated.'
          : ' 📝 Use the Edit button above to update it instead of creating a new one.'}
      </p>
    </div>
  );
}
