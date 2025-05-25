'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSearch, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
export const users = [
  {
    id: 1,
    username: 'admin',
    email: '',
    first_name: '',
    last_name: '',
  },
  {
    id: 12,
    username: 'mahmadmamoon',
    email: 'mahmadmamoon@gmail.com',
    first_name: '',
    last_name: '',
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Exact data as provided

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId) => {
    console.log('Delete user:', userId);
  };

  const handleEditUser = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleMoreActions = (userId) => {
    console.log('More actions for user:', userId);
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
        <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
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
                          onClick={() => handleEditUser(user.id)}
                          className='border-border text-foreground hover:bg-accent'
                        >
                          <FiEdit className='w-4 h-4' />
                        </Button>

                        <Button
                          variant='outline'
                          size='sm'
                          className='border-border text-destructive hover:bg-destructive/10'
                          onClick={() => handleDeleteUser(user.id)}
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
    </div>
  );
}
