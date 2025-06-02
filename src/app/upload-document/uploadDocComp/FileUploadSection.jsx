import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiUpload, FiCheck, FiX } from 'react-icons/fi';
import { getFileIcon } from './documentHelpers';

export default function FileUploadSection({
  register,
  errors,
  selectedFile,
  previewUrl,
  isUpdating,
}) {
  return (
    <div>
      <Label htmlFor='file' className='text-sm font-medium'>
        Document File *
      </Label>
      <div className='mt-1'>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            selectedFile
              ? 'border-green-300 bg-green-50'
              : errors.file
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Input
            id='file'
            type='file'
            {...register('file', {
              required: 'File is required',
              validate: {
                fileSize: (files) => {
                  if (!files || !files[0]) return true;
                  return (
                    files[0].size <= 5 * 1024 * 1024 ||
                    'File size must be less than 5MB'
                  );
                },
                fileType: (files) => {
                  if (!files || !files[0]) return true;
                  const allowedTypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                    'image/bmp',
                    'image/webp',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ];
                  return (
                    allowedTypes.includes(files[0].type) ||
                    'File must be an image (JPEG, PNG, GIF, BMP, WebP) or document (PDF, DOC, DOCX)'
                  );
                },
              },
            })}
            className='hidden'
            accept='.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp'
          />
          <label
            htmlFor='file'
            className='cursor-pointer text-gray-600 hover:text-gray-800 flex flex-col items-center'
          >
            {selectedFile ? (
              <FiCheck className='w-12 h-12 text-green-500 mb-2' />
            ) : (
              <FiUpload className='w-12 h-12 text-gray-400 mb-2' />
            )}
            <span className='text-sm font-medium'>
              {selectedFile
                ? 'File Selected'
                : 'Click to upload or drag and drop'}
            </span>
            <span className='text-xs text-gray-500 mt-1'>
              {selectedFile
                ? selectedFile.name
                : 'Images (JPEG, PNG, GIF, BMP, WebP) or Documents (PDF, DOC, DOCX) - Max 5MB'}
            </span>
          </label>
        </div>

        {errors.file && (
          <p className='text-red-500 text-sm mt-2 flex items-center'>
            <FiX className='w-3 h-3 mr-1' />
            {errors.file.message}
          </p>
        )}

        {/* File Preview */}
        {selectedFile && !errors.file && (
          <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
            <h4 className='text-sm font-medium text-gray-900 mb-3'>
              Selected File Preview:
            </h4>
            <div className='flex items-start gap-4'>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt='Preview'
                  className='h-24 w-24 object-cover rounded border'
                />
              ) : (
                <div className='h-24 w-24 bg-gray-200 rounded border flex items-center justify-center'>
                  {getFileIcon(selectedFile.name, 'file')}
                </div>
              )}
              <div className='flex-1 text-sm text-gray-600'>
                <p className='font-medium'>📎 {selectedFile.name}</p>
                <p>
                  📏 Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>🔖 Type: {selectedFile.type}</p>
                <p className='text-green-600 mt-2 flex items-center'>
                  <FiCheck className='w-3 h-3 mr-1' />
                  File is valid for {isUpdating ? 'update' : 'upload'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
