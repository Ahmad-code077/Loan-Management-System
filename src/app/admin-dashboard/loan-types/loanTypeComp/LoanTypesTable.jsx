import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoanTypeRow from './LoanTypeRow';

export default function LoanTypesTable({ loanTypes, onEdit, onDelete }) {
  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <CardTitle className='text-card-foreground'>
          All Loan Types ({loanTypes.length})
        </CardTitle>
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
                  Loan Type Name
                </th>
                <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                  Interest Rate
                </th>
                <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loanTypes.map((loanType) => (
                <LoanTypeRow
                  key={loanType.id}
                  loanType={loanType}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>

        {loanTypes.length === 0 && (
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>
              No loan types found. Create your first loan type to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
