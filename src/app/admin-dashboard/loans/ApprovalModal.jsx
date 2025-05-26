'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiCheck, FiX } from 'react-icons/fi';
import Link from 'next/link';

// Action Modals Components
const ApprovalModal = ({ loan, onClose, onApprove }) => {
  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md border border-border bg-card'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center text-green-600'>
            <FiCheck className='w-5 h-5 mr-2' />
            Approve Loan
          </CardTitle>
          <Button variant='outline' size='sm' onClick={onClose}>
            <FiX className='w-4 h-4' />
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0'>
              <FiCheck className='w-6 h-6 text-green-600 mt-1' />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-card-foreground mb-2'>
                Confirm Loan Approval
              </h3>
              <p className='text-muted-foreground mb-4'>
                Are you sure you want to approve this loan application? This
                action will notify the applicant and update the loan status.
              </p>

              <div className='bg-green-50 rounded-lg p-3 border border-green-200'>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Applicant:</span>
                    <span className='font-medium text-card-foreground'>
                      {loan.fullname}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Amount:</span>
                    <span className='font-medium text-green-600'>
                      ₨ {loan.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Purpose:</span>
                    <span className='font-medium text-card-foreground'>
                      {loan.purpose}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex space-x-2 pt-4'>
            <Button variant='outline' onClick={onClose} className='flex-1'>
              Cancel
            </Button>
            <Button
              onClick={() => onApprove(loan.id)}
              className='flex-1 bg-green-600 hover:bg-green-700'
            >
              <FiCheck className='w-4 h-4 mr-2' />
              Approve Loan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalModal;
