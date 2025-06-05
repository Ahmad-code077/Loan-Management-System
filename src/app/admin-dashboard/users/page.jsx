'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiPlus,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiUser,
} from 'react-icons/fi';
import Link from 'next/link';
import { useGetUsersQuery } from '@/lib/store/authApi';
import { useToast } from '@/hooks/use-toast';
import AddUserModal from './AddUserModal';
import DeleteUserModal from './DeleteUserModal';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { toast } = useToast();

  // API hooks
  const {
    data: usersData = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  // Filter users based on search term
  const filteredUsers = usersData.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toString().includes(searchTerm)
  );

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleUserDeleted = () => {
    refetchUsers(); // Refresh the list from API
    setShowDeleteModal(false);
    setUserToDelete(null);

    toast({
      title: 'User Deleted',
      description: 'User has been successfully deleted.',
      variant: 'default',
    });
  };

  const handleUserAdded = () => {
    refetchUsers(); // Refresh the list from API
    setShowAddModal(false);

    toast({
      title: 'User Added',
      description: 'New user has been successfully added.',
      variant: 'default',
    });
  };

  // Loading state
  if (usersLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Users Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage all system users
            </p>
          </div>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiLoader className='w-8 h-8 animate-spin text-primary mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Loading Users...</h3>
              <p className='text-muted-foreground'>
                Please wait while we fetch all system users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (usersError) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Users Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage all system users
            </p>
          </div>
        </div>

        <Card className='border border-border bg-card'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <FiAlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2 text-red-600'>
                Failed to Load Users
              </h3>
              <p className='text-muted-foreground mb-4'>
                {usersError?.data?.message ||
                  'Something went wrong while fetching users.'}
              </p>
              <Button onClick={() => refetchUsers()} variant='outline'>
                <FiRefreshCw className='w-4 h-4 mr-2' />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Users Management
          </h1>
          <p className='text-muted-foreground mt-1'>Manage all system users</p>
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            className='border-border'
            onClick={() => refetchUsers()}
            disabled={usersLoading}
          >
            <FiRefreshCw
              className={`w-4 h-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button
            className='bg-primary text-primary-foreground hover:bg-primary/90'
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className='w-4 h-4 mr-2' />
            Add New User
          </Button>
        </div>
      </div>

      <Card className='border border-border bg-card'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-card-foreground'>
              All Users ({usersData.length})
            </CardTitle>
            <div className='relative w-64'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                placeholder='Search users...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-border'>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    ID
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Username
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Email
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Full Name
                  </th>

                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className='border-b border-border hover:bg-muted/50'
                  >
                    <td className='py-3 px-4 text-card-foreground font-medium'>
                      #{user.id}
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex items-center gap-2'>
                        <FiUser className='w-4 h-4 text-muted-foreground' />
                        <span className='text-card-foreground font-medium'>
                          {user.username || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      {user.email || 'No email'}
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      {user.first_name || user.last_name
                        ? `${user.first_name || ''} ${
                            user.last_name || ''
                          }`.trim()
                        : 'Not provided'}
                    </td>

                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <Link href={`/admin-dashboard/users/${user.id}`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-border text-foreground hover:bg-accent'
                            title='View Details'
                          >
                            <FiEye className='w-4 h-4' />
                          </Button>
                        </Link>
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-border text-destructive hover:bg-destructive/10'
                          onClick={() => handleDeleteClick(user)}
                          title='Delete User'
                        >
                          <FiTrash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && !usersLoading && (
            <div className='text-center py-8'>
              <FiUser className='w-12 h-12 text-muted-foreground mx-auto mb-3' />
              <p className='text-muted-foreground text-lg mb-1'>
                No users found
              </p>
              <p className='text-sm text-muted-foreground'>
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'No users have been registered yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}

      {/* Delete User Modal - Keep as dummy for now */}
      {showDeleteModal && userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}
