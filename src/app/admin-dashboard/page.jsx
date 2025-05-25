'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiTrendingUp,
} from 'react-icons/fi';

export default function AdminDashboard() {
  // Mock data for dashboard stats
  const stats = [
    {
      title: 'Total Users',
      value: '2,345',
      icon: FiUsers,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Loans',
      value: '1,234',
      icon: FiDollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Documents',
      value: '5,678',
      icon: FiFileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Revenue',
      value: '₨ 12.5M',
      icon: FiTrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>
          Dashboard Overview
        </h1>
        <p className='text-muted-foreground mt-1'>
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='border border-border bg-card '>
              <CardContent className='p-6 '>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {stat.title}
                    </p>
                    <p className='text-2xl font-bold text-card-foreground'>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Recent Loan Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className='flex items-center justify-between py-2 border-b border-border last:border-b-0'
                >
                  <div>
                    <p className='font-medium text-card-foreground'>John Doe</p>
                    <p className='text-sm text-muted-foreground'>
                      ₨ 500,000 - Business Loan
                    </p>
                  </div>
                  <span className='px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full'>
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-card-foreground'>
                  Database
                </span>
                <span className='flex items-center text-primary'>
                  <div className='w-2 h-2 bg-primary rounded-full mr-2'></div>
                  Online
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-card-foreground'>
                  API Services
                </span>
                <span className='flex items-center text-primary'>
                  <div className='w-2 h-2 bg-primary rounded-full mr-2'></div>
                  Running
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-card-foreground'>
                  Backup System
                </span>
                <span className='flex items-center text-primary'>
                  <div className='w-2 h-2 bg-primary rounded-full mr-2'></div>
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
