'use client';

import { useState, useEffect } from 'react';
import DocsHeader from './docsComponents/DocsHeader';
import DocsTable from './docsComponents/DocsTable';
import { useDocuments } from './hooks/useDocuments';

export default function DocumentsPage() {
  const { documents, loading, getDocuments } = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [selectedType, searchTerm]);

  const loadDocuments = async () => {
    const filters = {
      documentType: selectedType,
      search: searchTerm,
    };

    const result = await getDocuments(filters);
    if (result.success) {
      setFilteredDocuments(result.data);
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
  };

  return (
    <div className='space-y-6'>
      <DocsHeader
        totalDocuments={documents.length}
        filteredCount={filteredDocuments.length}
      />

      <DocsTable
        documents={filteredDocuments}
        loading={loading}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}
