import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiCheck, FiX } from 'react-icons/fi';

export default function QuickActionsCard({ loan, onApprove, onReject }) {
  if (loan.status !== 'pending') {
    return null;
  }

  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <CardTitle className='text-card-foreground'>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Button
          onClick={onApprove}
          className='w-full bg-green-600 hover:bg-green-700'
        >
          <FiCheck className='w-4 h-4 mr-2' />
          Approve Application
        </Button>
        <Button
          onClick={onReject}
          variant='outline'
          className='w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50'
        >
          <FiX className='w-4 h-4 mr-2' />
          Reject Application
        </Button>
      </CardContent>
    </Card>
  );
}
