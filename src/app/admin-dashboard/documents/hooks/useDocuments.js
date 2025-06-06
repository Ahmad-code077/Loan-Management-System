import { useState } from 'react';
import {
  useGetDocumentsQuery,
  useGetDocumentDetailsQuery,
} from '@/lib/store/authApi';

export const useDocuments = () => {
  const [loading, setLoading] = useState(false);

  // Real API hooks
  const { data: documentsData = [], refetch } = useGetDocumentsQuery();
  const getDocuments = async (filters = {}) => {
    setLoading(true);
    try {
      // Refetch from API
      await refetch();

      let filteredDocs = [...documentsData];

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
            doc.user.first_name?.toLowerCase().includes(searchLower) ||
            doc.user.last_name?.toLowerCase().includes(searchLower)
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
      // Find document in the existing data or fetch from API
      const document = documentsData.find((doc) => doc.id === parseInt(id));
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
    documents: documentsData,
    loading,
    getDocuments,
    getDocumentById,
    getDocumentsByType,
    getDocumentsByUser,
  };
};
