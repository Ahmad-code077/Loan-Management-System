import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiX, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { formatInterestRate, formatLoanTypeName } from '../utils/loanTypeUtils';

export default function DeleteConfirmModal({
  loanType,
  onClose,
  onDelete,
  loading,
}) {
  const handleDelete = async () => {
    const result = await onDelete(loanType.id);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md border border-border bg-card'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center text-red-600'>
            <FiTrash2 className='w-5 h-5 mr-2' />
            Delete Loan Type
          </CardTitle>
          <Button variant='outline' size='sm' onClick={onClose}>
            <FiX className='w-4 h-4' />
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0'>
              <FiAlertTriangle className='w-6 h-6 text-red-600 mt-1' />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-card-foreground mb-2'>
                Confirm Deletion
              </h3>
              <p className='text-muted-foreground mb-4'>
                Are you sure you want to delete this loan type? This action
                cannot be undone.
              </p>

              <div className='bg-red-50 rounded-lg p-3 border border-red-200'>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Loan Type:</span>
                    <span className='font-medium text-card-foreground'>
                      {formatLoanTypeName(loanType.name)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Interest Rate:
                    </span>
                    <span className='font-medium text-red-600'>
                      {formatInterestRate(loanType.interest_rate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-3'>
                <p className='text-xs text-yellow-700'>
                  <strong>Note:</strong> Deleting this loan type will not affect
                  existing loans, but no new loans can be created with this
                  type.
                </p>
              </div>
            </div>
          </div>

          <div className='flex space-x-2 pt-4'>
            <Button
              variant='outline'
              onClick={onClose}
              className='flex-1'
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className='flex-1 bg-red-600 hover:bg-red-700'
              disabled={loading}
            >
              {loading ? (
                <span>Deleting...</span>
              ) : (
                <>
                  <FiTrash2 className='w-4 h-4 mr-2' />
                  Delete Loan Type
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
