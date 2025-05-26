import { useState } from 'react';
import { mockDocuments } from '../data/mockData';

export const useDocuments = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [loading, setLoading] = useState(false);

  const getDocuments = async (filters = {}) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      let filteredDocs = [...documents];

      // Filter by document type
      if (filters.documentType && filters.documentType !== 'all') {
        filteredDocs = filteredDocs.filter(
          (doc) => doc.document_type === filters.documentType
        );
      }

      // Filter by user
      if (filters.userId) {
        filteredDocs = filteredDocs.filter(
          (doc) => doc.user.id === filters.userId
        );
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredDocs = filteredDocs.filter(
          (doc) =>
            doc.document_type.toLowerCase().includes(searchLower) ||
            doc.user.username.toLowerCase().includes(searchLower) ||
            doc.user.first_name.toLowerCase().includes(searchLower) ||
            doc.user.last_name.toLowerCase().includes(searchLower)
        );
      }

      return { success: true, data: filteredDocs };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getDocumentById = async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const document = documents.find((doc) => doc.id === parseInt(id));
      return { success: true, data: document };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getDocumentsByType = async (documentType) => {
    const filters = { documentType };
    return await getDocuments(filters);
  };

  const getDocumentsByUser = async (userId) => {
    const filters = { userId };
    return await getDocuments(filters);
  };

  return {
    documents,
    loading,
    getDocuments,
    getDocumentById,
    getDocumentsByType,
    getDocumentsByUser,
  };
};
