// Create: src/app/admin-dashboard/documents/[id]/docsComponents/VerifyDocumentModal.jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiLoader,
  FiAlertTriangle,
  FiShield,
} from 'react-icons/fi';
import { useVerifyDocumentMutation } from '@/lib/store/authApi';
import { useToast } from '@/hooks/use-toast';

export default function VerifyDocumentModal({ document, onClose, onVerified }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // ✅ API hook for document verification
  const [verifyDocument] = useVerifyDocumentMutation();

  // ✅ Handle verification (approve)
  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      console.log('Verifying document:', document.id);

      const result = await verifyDocument({
        id: document.id,
        isVerified: true,
      }).unwrap();

      console.log('Document verified successfully:', result);

      toast({
        title: 'Document Verified ✅',
        description: `${document.document_type} has been successfully verified.`,
        variant: 'default',
      });

      // ✅ Notify parent component
      onVerified(result);
      onClose();
    } catch (error) {
      console.error('Verification failed:', error);

      let errorMessage = 'Failed to verify document. Please try again.';

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error?.status) {
        errorMessage = `Verification failed (Error ${error.status})`;
      }

      toast({
        title: 'Verification Failed ❌',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle rejection (mark as unverified)
  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      console.log('Rejecting document verification:', document.id);

      const result = await verifyDocument({
        id: document.id,
        isVerified: false,
      }).unwrap();

      console.log('Document verification rejected:', result);

      toast({
        title: 'Document Rejected ⚠️',
        description: `${document.document_type} verification has been rejected.`,
        variant: 'default',
      });

      // ✅ Notify parent component
      onVerified(result);
      onClose();
    } catch (error) {
      console.error('Rejection failed:', error);

      toast({
        title: 'Rejection Failed ❌',
        description: 'Failed to reject document verification.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-md border border-border bg-card'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center text-orange-600'>
            <FiShield className='w-5 h-5 mr-2' />
            Document Verification
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
        <CardContent className='space-y-4'>
          {/* Document Info Summary */}
          <div className='bg-muted/30 p-4 rounded-lg border border-border'>
            <h4 className='font-medium text-card-foreground mb-2'>
              Document Details
            </h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Document ID:</span>
                <span className='font-medium'>#{document.id}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Type:</span>
                <Badge variant='outline' className='text-xs'>
                  {document.document_type}
                </Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Uploaded by:</span>
                <span className='font-medium'>
                  {document.user.first_name || document.user.username}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Current status:</span>
                {document.is_verified ? (
                  <Badge className='bg-green-100 text-green-800 border-green-300'>
                    <FiCheckCircle className='w-3 h-3 mr-1' />
                    Verified
                  </Badge>
                ) : (
                  <Badge className='bg-yellow-100 text-yellow-800 border-yellow-300'>
                    <FiAlertTriangle className='w-3 h-3 mr-1' />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Question */}
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-card-foreground mb-2'>
              What would you like to do?
            </h3>
            <p className='text-muted-foreground text-sm'>
              Choose to verify or reject this document verification
            </p>
          </div>

          {/* Warning Notice */}
          <div className='bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800'>
            <div className='flex items-start space-x-2'>
              <FiAlertTriangle className='w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5' />
              <div className='text-xs text-amber-700 dark:text-amber-300'>
                <p className='font-medium mb-1'>Important:</p>
                <ul className='space-y-0.5'>
                  <li>• Verification status affects loan approval process</li>
                  <li>• Users will be notified of status changes</li>
                  <li>• This action can be reversed later if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex space-x-3 pt-2'>
            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={isSubmitting}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white'
            >
              {isSubmitting ? (
                <>
                  <FiLoader className='w-4 h-4 mr-2 animate-spin' />
                  Processing...
                </>
              ) : (
                <>
                  <FiCheckCircle className='w-4 h-4 mr-2' />
                  Verify Document
                </>
              )}
            </Button>

            {/* Reject Button */}
            <Button
              onClick={handleReject}
              disabled={isSubmitting}
              variant='destructive'
              className='flex-1'
            >
              {isSubmitting ? (
                <>
                  <FiLoader className='w-4 h-4 mr-2 animate-spin' />
                  Processing...
                </>
              ) : (
                <>
                  <FiXCircle className='w-4 h-4 mr-2' />
                  Reject
                </>
              )}
            </Button>
          </div>

          {/* Cancel Button */}
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            variant='outline'
            className='w-full'
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
