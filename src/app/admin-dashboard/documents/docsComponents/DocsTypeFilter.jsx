import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSearch } from 'react-icons/fi';
import { DOCUMENT_TYPES } from '../utils/documentUtils';

export default function DocsTypeFilter({
  selectedType,
  onTypeChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
      <div className='flex flex-wrap gap-2'>
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          size='sm'
          onClick={() => onTypeChange('all')}
          className='border-border'
        >
          All Documents
        </Button>
        {DOCUMENT_TYPES.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size='sm'
            onClick={() => onTypeChange(type)}
            className='border-border'
          >
            {type}
          </Button>
        ))}
      </div>

      <div className='relative w-full sm:w-64'>
        <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
        <Input
          placeholder='Search documents...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-10 bg-input border-border'
        />
      </div>
    </div>
  );
}
