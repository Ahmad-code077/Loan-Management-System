import { Label } from '@/components/ui/label';
import { FiX } from 'react-icons/fi';
import { DOCUMENT_TYPES } from './documentHelpers';

export default function DocumentTypeSelector({ register, errors, isUpdating }) {
  return (
    <div id='scroll-to-document-type' className='scroll-mt-20'>
      <Label htmlFor='document_type' className='text-sm font-medium'>
        Document Type *
      </Label>
      <select
        id='document_type'
        {...register('document_type', {
          required: 'Document type is required',
        })}
        disabled={isUpdating}
        className={`w-full mt-1 rounded-md border p-2 bg-white ${
          errors.document_type ? 'border-red-500' : 'border-gray-300'
        } ${isUpdating ? 'bg-gray-100' : ''}`}
      >
        <option value=''>Select document type</option>
        {DOCUMENT_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      {errors.document_type && (
        <p className='text-red-500 text-sm mt-1 flex items-center'>
          <FiX className='w-3 h-3 mr-1' />
          {errors.document_type.message}
        </p>
      )}
    </div>
  );
}
