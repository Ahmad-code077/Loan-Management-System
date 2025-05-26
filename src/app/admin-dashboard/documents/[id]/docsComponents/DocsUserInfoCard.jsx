import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiUser, FiMail, FiExternalLink } from 'react-icons/fi';
import { formatUserName } from '../../utils/documentUtils';

export default function DocsUserInfoCard({ document }) {
  const user = document.user;

  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <CardTitle className='text-card-foreground flex items-center'>
          <FiUser className='w-5 h-5 mr-2 text-purple-600' />
          Uploaded By
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='space-y-3'>
            <div className='space-y-1'>
              <label className='text-sm font-medium text-muted-foreground'>
                Full Name
              </label>
              <p className='text-lg font-semibold text-card-foreground'>
                {formatUserName(user)}
              </p>
            </div>

            <div className='space-y-1'>
              <label className='text-sm font-medium text-muted-foreground'>
                Username
              </label>
              <p className='text-lg text-card-foreground'>@{user.username}</p>
            </div>

            <div className='space-y-1'>
              <label className='text-sm font-medium text-muted-foreground'>
                User ID
              </label>
              <p className='text-lg text-card-foreground'>#{user.id}</p>
            </div>

            {user.email && (
              <div className='space-y-1'>
                <label className='text-sm font-medium text-muted-foreground'>
                  Email Address
                </label>
                <p className='text-lg text-card-foreground flex items-center'>
                  <FiMail className='w-4 h-4 mr-2 text-blue-500' />
                  {user.email}
                </p>
              </div>
            )}
          </div>

          <div className='pt-2'>
            <Button
              variant='outline'
              className='w-full border-border'
              onClick={() => {
                // Navigate to user profile or user documents
                window.location.href = `/admin-dashboard/users/${user.id}`;
              }}
            >
              <FiExternalLink className='w-4 h-4 mr-2' />
              View User Profile
            </Button>
          </div>

          <div className='bg-purple-50 p-3 rounded-lg border border-purple-200'>
            <p className='text-xs text-purple-700'>
              <strong>Note:</strong> You can view all documents uploaded by this
              user from their profile page.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
