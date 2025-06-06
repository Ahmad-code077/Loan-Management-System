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

  // Initial load when documents data is available
  useEffect(() => {
    if (documents.length > 0) {
      loadDocuments();
    }
  }, [documents]); // Load when documents are fetched

  // Filter when type or search changes
  useEffect(() => {
    if (documents.length > 0) {
      loadDocuments();
    }
  }, [selectedType, searchTerm]); // Only depend on filter values

  // Also set initial filtered documents when documents first load
  useEffect(() => {
    if (documents.length > 0 && filteredDocuments.length === 0) {
      setFilteredDocuments(documents);
    }
  }, [documents]); // Set initial data

  const loadDocuments = async () => {
    const filters = {
      documentType: selectedType,
      search: searchTerm,
    };
    console.log('filters:', filters);

    const result = await getDocuments(filters);
    console.log('result.data:', result.data);

    if (result.success) {
      setFilteredDocuments(result.data);
    } else {
      // If filtering fails, show all documents
      setFilteredDocuments(documents);
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
