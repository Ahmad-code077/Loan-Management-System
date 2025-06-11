'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX, FiEdit, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { validateLoanType } from '../utils/loanTypeUtils';
import { useToast } from '@/hooks/use-toast';

export default function EditLoanTypeModal({
  loanType,
  onClose,
  onUpdate,
  loading,
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    interest_rate: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loanType) {
      setFormData({
        name: loanType.name || '',
        interest_rate: loanType.interest_rate || '',
      });
    }
  }, [loanType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // ✅ Client-side validation first
      const validation = validateLoanType(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting update with data:', formData);

      // ✅ Call the update function
      const result = await onUpdate(formData);

      if (result.success) {
        toast({
          title: 'Loan Type Updated! ✅',
          description: `${formData.name} has been updated successfully.`,
          variant: 'default',
        });
        onClose();
      } else {
        // ✅ Handle API errors
        if (result.error?.data) {
          const apiErrors = {};
          Object.keys(result.error.data).forEach((field) => {
            if (Array.isArray(result.error.data[field])) {
              apiErrors[field] = result.error.data[field][0];
            } else {
              apiErrors[field] = result.error.data[field];
            }
          });
          setErrors(apiErrors);

          toast({
            title: 'Update Failed ❌',
            description: 'Please check the form for errors and try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Update Failed ❌',
            description: result.error?.message || 'Failed to update loan type.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Update Failed ❌',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md border border-border bg-card'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center text-orange-600'>
            <FiEdit className='w-5 h-5 mr-2' />
            Edit Loan Type
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FiX className='w-4 h-4' />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Name Field */}
            <div className='space-y-2'>
              <Label
                htmlFor='name'
                className='text-sm font-medium text-card-foreground'
              >
                Loan Type Name *
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder='e.g., Personal Loan'
                className={`bg-input border-border ${
                  errors.name ? 'border-red-500' : ''
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className='text-sm text-red-600 flex items-center'>
                  <FiAlertCircle className='w-3 h-3 mr-1' />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Interest Rate Field */}
            <div className='space-y-2'>
              <Label
                htmlFor='interest_rate'
                className='text-sm font-medium text-card-foreground'
              >
                Interest Rate (%) *
              </Label>
              <Input
                id='interest_rate'
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
                disabled={isSubmitting}
              />
              {errors.interest_rate && (
                <p className='text-sm text-red-600 flex items-center'>
                  <FiAlertCircle className='w-3 h-3 mr-1' />
                  {errors.interest_rate}
                </p>
              )}
            </div>

            {/* Warning Notice */}
            <div className='bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800'>
              <p className='text-xs text-orange-700 dark:text-orange-300'>
                <strong>Warning:</strong> Changing interest rates will only
                affect new loans. Existing loans will keep their current rates.
              </p>
            </div>

            {/* Current Values Display */}
            {loanType && (
              <div className='bg-muted/30 p-3 rounded-lg border border-border'>
                <p className='text-xs text-muted-foreground mb-1'>
                  Current values:
                </p>
                <p className='text-sm'>
                  <strong>Name:</strong> {loanType.name}
                </p>
                <p className='text-sm'>
                  <strong>Rate:</strong> {loanType.interest_rate}%
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex space-x-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='flex-1'
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='flex-1 bg-orange-600 hover:bg-orange-700'
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className='w-4 h-4 mr-2 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiEdit className='w-4 h-4 mr-2' />
                    Update Loan Type
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
