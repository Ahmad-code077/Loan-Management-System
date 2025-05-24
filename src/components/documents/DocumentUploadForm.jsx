'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DocumentUploadForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const file = watch('file');

  useEffect(() => {
    if (file && file[0]) {
      setSelectedFile(file[0]);
      if (file[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file[0]);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [file]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Document upload data:', {
      title: data.title,
      file: selectedFile,
    });

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div>
        <Label htmlFor='document_type'>Document Type</Label>
        <select
          id='document_type'
          {...register('document_type', {
            required: 'Document type is required',
          })}
          className='w-full mt-1 rounded-md border border-gray-300 p-2 bg-white'
        >
          <option value=''>Select document type</option>
          <option value='id_proof'>ID Proof</option>
          <option value='address_proof'>Address Proof</option>
          <option value='income_proof'>Income Proof</option>
          <option value='bank_statement'>Bank Statement</option>
          <option value='other'>Other</option>
        </select>
        {errors.document_type && (
          <span className='text-red-500 text-sm'>
            {errors.document_type.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor='title'>Document Title</Label>
        <Input
          id='title'
          {...register('title', { required: 'Title is required' })}
          placeholder='Enter document title'
          className='w-full mt-1'
        />
        {errors.title && (
          <span className='text-red-500 text-sm'>{errors.title.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor='file'>Document File</Label>
        <div className='mt-1'>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
            <Input
              id='file'
              type='file'
              {...register('file', {
                required: 'File is required',
                validate: {
                  fileSize: (files) =>
                    !files[0] ||
                    files[0].size <= 5000000 ||
                    'File size must be less than 5MB',
                  fileType: (files) =>
                    !files[0] ||
                    ['application/pdf', 'image/jpeg', 'image/png'].includes(
                      files[0].type
                    ) ||
                    'File must be PDF, JPEG, or PNG',
                },
              })}
              className='hidden'
              accept='.pdf,.jpg,.jpeg,.png'
              onChange={(e) => {
                register('file').onChange(e);
              }}
            />
            <label
              htmlFor='file'
              className='cursor-pointer text-gray-600 hover:text-gray-800 flex flex-col items-center'
            >
              <svg
                className='w-12 h-12 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                />
              </svg>
              <span className='mt-2'>
                {selectedFile
                  ? selectedFile.name
                  : 'Drop files here or click to upload'}
              </span>
            </label>
          </div>
          {errors.file && (
            <span className='text-red-500 text-sm block mt-2'>
              {errors.file.message}
            </span>
          )}
          {selectedFile && !errors.file && (
            <div className='mt-4'>
              <h4 className='text-sm font-medium text-gray-900'>
                Selected file:
              </h4>
              <div className='mt-2 flex items-center gap-2'>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='h-20 w-20 object-cover rounded'
                  />
                ) : (
                  <svg
                    className='h-10 w-10 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                )}
                <div className='text-sm text-gray-500'>
                  <p>{selectedFile.name}</p>
                  <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <p className='text-sm text-gray-500 mt-2'>
          Accepted formats: PDF, JPEG, PNG (Max 5MB)
        </p>
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </form>
  );
}
