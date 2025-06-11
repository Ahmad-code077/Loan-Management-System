// Create: src/app/admin-dashboard/documents/[id]/docsComponents/DocsVerificationCard.jsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FiShield,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';
import VerifyDocumentModal from './VerifyDocumentModal';

export default function DocsVerificationCard({ document, onDocumentUpdated }) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // ✅ Format verification date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ✅ Get verification status badge
  const getVerificationBadge = () => {
    if (document.is_verified) {
      return (
        <Badge className='bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200'>
          <FiCheckCircle className='w-3 h-3 mr-1' />
          Verified
        </Badge>
      );
    } else {
      return (
        <Badge className='bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200'>
          <FiClock className='w-3 h-3 mr-1' />
          Pending Verification
        </Badge>
      );
    }
  };

  // ✅ Handle verification modal close
  const handleVerificationUpdate = (updatedDocument) => {
    console.log('Document verification updated:', updatedDocument);
    if (onDocumentUpdated) {
      onDocumentUpdated(updatedDocument);
    }
  };

  return (
    <>
      <Card className='border border-border bg-card'>
        <CardHeader>
          <CardTitle className='text-card-foreground flex items-center'>
            <FiShield className='w-5 h-5 mr-2 text-orange-600' />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Current Status */}
            <div className='text-center'>
              <div className='mb-3'>{getVerificationBadge()}</div>
              <p className='text-sm text-muted-foreground'>
                {document.is_verified
                  ? 'This document has been verified by an administrator'
                  : 'This document is waiting for administrator verification'}
              </p>
            </div>

            {/* Verification Details */}
            <div className='space-y-3'>
              <div className='grid grid-cols-1 gap-3'>
                {document.verified_by && (
                  <div className='space-y-1'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Verified By
                    </label>
                    <p className='text-sm text-card-foreground flex items-center'>
                      <FiUser className='w-4 h-4 mr-2 text-blue-500' />
                      {document.verified_by}
                    </p>
                  </div>
                )}

                {document.verified_at && (
                  <div className='space-y-1'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Verified At
                    </label>
                    <p className='text-sm text-card-foreground flex items-center'>
                      <FiCalendar className='w-4 h-4 mr-2 text-blue-500' />
                      {formatDate(document.verified_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className='pt-2'>
              <Button
                onClick={() => setShowVerifyModal(true)}
                className='w-full'
                variant={document.is_verified ? 'outline' : 'default'}
              >
                <FiShield className='w-4 h-4 mr-2' />
                {document.is_verified
                  ? 'Update Verification Status'
                  : 'Verify Document'}
              </Button>
            </div>

            {/* Info Notice */}
          </div>
        </CardContent>
      </Card>

      {/* Verification Modal */}
      {showVerifyModal && (
        <VerifyDocumentModal
          document={document}
          onClose={() => setShowVerifyModal(false)}
          onVerified={handleVerificationUpdate}
        />
      )}
    </>
  );
}
