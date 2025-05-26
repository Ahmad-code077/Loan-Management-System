import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiBriefcase } from 'react-icons/fi';
import { formatCurrency } from '../../utils/loanUtils';

export default function EmploymentInformationCard({ loan }) {
  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <CardTitle className='flex items-center text-card-foreground'>
          <FiBriefcase className='w-5 h-5 mr-2 text-purple-600' />
          Employment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Employment Status
            </label>
            <p className='text-lg text-card-foreground'>
              {loan.employment_status}
            </p>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Organization
            </label>
            <p className='text-lg text-card-foreground'>
              {loan.organization_name}
            </p>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Monthly Income
            </label>
            <p className='text-2xl font-bold text-green-600'>
              {formatCurrency(loan.monthly_income)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
