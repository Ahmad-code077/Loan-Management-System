import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function PersonalInformationCard({ loan }) {
  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <CardTitle className='flex items-center text-card-foreground'>
          <FiUser className='w-5 h-5 mr-2 text-blue-600' />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Full Name
            </label>
            <p className='text-lg font-semibold text-card-foreground'>
              {loan.fullname}
            </p>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              CNIC Number
            </label>
            <p className='text-lg text-card-foreground font-mono'>
              {loan.CNIC}
            </p>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Email Address
            </label>
            <p className='text-lg text-card-foreground flex items-center'>
              <FiMail className='w-4 h-4 mr-2 text-blue-500' />
              {loan.email}
            </p>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Contact Number
            </label>
            <p className='text-lg text-card-foreground flex items-center'>
              <FiPhone className='w-4 h-4 mr-2 text-green-500' />
              {loan.contact}
            </p>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Address
            </label>
            <p className='text-lg text-card-foreground flex items-center'>
              <FiMapPin className='w-4 h-4 mr-2 text-red-500' />
              {loan.address}
            </p>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Marital Status
            </label>
            <p className='text-lg text-card-foreground'>
              {loan.marital_status}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
