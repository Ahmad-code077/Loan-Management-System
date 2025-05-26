import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiX, FiPlus } from 'react-icons/fi';
import { validateLoanType } from '../utils/loanTypeUtils';

export default function AddLoanTypeModal({ onClose, onAdd, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    interest_rate: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateLoanType(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const result = await onAdd(formData);
    if (result.success) {
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md border border-border bg-card'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center text-primary'>
            <FiPlus className='w-5 h-5 mr-2' />
            Add New Loan Type
          </CardTitle>
          <Button variant='outline' size='sm' onClick={onClose}>
            <FiX className='w-4 h-4' />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-card-foreground'>
                Loan Type Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder='e.g., Personal Loan'
                className={`bg-input border-border ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className='text-sm text-red-600'>{errors.name}</p>
              )}
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-card-foreground'>
                Interest Rate (%) *
              </label>
              <Input
                type='number'
                step='0.01'
                min='0'
                max='100'
                value={formData.interest_rate}
                onChange={(e) => handleChange('interest_rate', e.target.value)}
                placeholder='e.g., 15.50'
                className={`bg-input border-border ${
                  errors.interest_rate ? 'border-red-500' : ''
                }`}
              />
              {errors.interest_rate && (
                <p className='text-sm text-red-600'>{errors.interest_rate}</p>
              )}
            </div>

            <div className='bg-blue-50 p-3 rounded-lg border border-blue-200'>
              <p className='text-xs text-blue-700'>
                <strong>Note:</strong> Interest rates should be set carefully as
                they will affect all future loans of this type.
              </p>
            </div>

            <div className='flex space-x-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='flex-1'
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='flex-1 bg-primary hover:bg-primary/90'
                disabled={loading}
              >
                {loading ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <FiPlus className='w-4 h-4 mr-2' />
                    Add Loan Type
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
