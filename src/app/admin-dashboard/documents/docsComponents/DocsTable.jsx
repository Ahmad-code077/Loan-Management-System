import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DocsRow from './DocsRow';
import DocsTypeFilter from './DocsTypeFilter';
import { FiLoader } from 'react-icons/fi';
import Link from 'next/link';

export default function DocsTable({
  documents,
  loading,
  selectedType,
  onTypeChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <div className='space-y-4'>
          <CardTitle className='text-card-foreground'>
            Documents ({documents.length})
          </CardTitle>
          <DocsTypeFilter
            selectedType={selectedType}
            onTypeChange={onTypeChange}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='text-center py-12'>
            <FiLoader className='w-8 h-8 animate-spin text-primary mx-auto mb-4' />
            <p className='text-muted-foreground text-lg'>
              Loading documents...
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-border'>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    ID
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Document Type
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Uploaded By
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Upload Date
                  </th>
                  {/* ✅ Added Verification Status Column */}
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Verification Status
                  </th>
                  <th className='text-left py-3 px-4 font-medium text-card-foreground'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <DocsRow key={document.id} document={document} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && documents.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>📄</div>
            <h3 className='text-lg font-medium text-card-foreground mb-2'>
              No Documents Found
            </h3>
            <p className='text-muted-foreground'>
              No documents found matching your criteria.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
