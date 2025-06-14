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
  }, [documents]);

  // Filter when type or search changes
  useEffect(() => {
    if (documents.length > 0) {
      loadDocuments();
    }
  }, [selectedType, searchTerm]);

  // Also set initial filtered documents when documents first load
  useEffect(() => {
    if (documents.length > 0 && filteredDocuments.length === 0) {
      setFilteredDocuments(documents);
    }
  }, [documents]);

  const loadDocuments = async () => {
    const filters = {
      documentType: selectedType,
      search: searchTerm,
    };

    const result = await getDocuments(filters);

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

  console.log('documents length:', documents);

  return (
    <div className='space-y-6'>
      {/* ✅ Pass filtered documents to header for stats */}
      <DocsHeader
        totalDocuments={documents.length}
        filteredCount={filteredDocuments.length}
        documents={filteredDocuments}
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
