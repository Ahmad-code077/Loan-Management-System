export default function UploadGuidelines({ isUpdating }) {
  return (
    <div className='bg-gray-50 p-4 rounded-lg border'>
      <h3 className='font-medium text-gray-800 mb-2'>📋 Guidelines</h3>
      <ul className='list-disc pl-5 text-sm text-gray-600 space-y-1'>
        <li>📷 Ensure the document is clear and all text is readable</li>
        <li>📏 File size should not exceed 5MB</li>
        <li>
          📄 Accepted formats: Images (JPEG, PNG, GIF, BMP, WebP) or Documents
          (PDF, DOC, DOCX)
        </li>
        <li>🔓 Only unverified documents can be updated</li>
        <li>🔒 Contact admin if you need to change a verified document</li>
        {isUpdating && (
          <li className='text-blue-600'>
            🔄 Updating existing document will replace the current file
          </li>
        )}
      </ul>
    </div>
  );
}
