'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSearch, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { getUsers } from './dummyUserData';
import AddUserModal from './AddUserModal';
import DeleteUserModal from './DeleteUserModal';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleUserDeleted = () => {
    setUsers(getUsers()); // Refresh the list
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleUserAdded = () => {
    setUsers(getUsers()); // Refresh the list
    setShowAddModal(false);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Users Management
          </h1>
          <p className='text-muted-foreground mt-1'>Manage all system users</p>
        </div>
        <Button
          className='bg-primary text-primary-foreground hover:bg-primary/90'
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus className='w-4 h-4 mr-2' />
          Add New User
        </Button>
      </div>

      <Card className='border border-border bg-card'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-card-foreground'>
              All Users ({users.length})
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
                    First Name
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Last Name
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
                    <td className='py-3 px-4 text-card-foreground font-medium'>
                      {user.username}
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      {user.email || 'No email'}
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      {user.first_name || 'Not provided'}
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      {user.last_name || 'Not provided'}
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <Link href={`/admin-dashboard/users/${user.id}`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-border text-foreground hover:bg-accent'
                          >
                            <FiEye className='w-4 h-4' />
                          </Button>
                        </Link>
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-border text-destructive hover:bg-destructive/10'
                          onClick={() => handleDeleteClick(user)}
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

          {filteredUsers.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>
                No users found matching your search.
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

      {/* Delete User Modal */}
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
