'use client';

import { useState } from 'react';
import LoanTypesHeader from './loanTypeComp/LoanTypesHeader';
import LoanTypesTable from './loanTypeComp/LoanTypesTable';
import AddLoanTypeModal from './loanTypeComp/AddLoanTypeModal';
import EditLoanTypeModal from './loanTypeComp/EditLoanTypeModal';
import DeleteConfirmModal from './loanTypeComp/DeleteConfirmModal';
import { useLoanTypes } from './hooks/useLoanTypes';

export default function LoanTypesPage() {
  const { loanTypes, loading, addLoanType, updateLoanType, deleteLoanType } =
    useLoanTypes();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState(null);

  const handleEdit = (loanType) => {
    setSelectedLoanType(loanType);
    setShowEditModal(true);
  };

  const handleDelete = (loanType) => {
    setSelectedLoanType(loanType);
    setShowDeleteModal(true);
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedLoanType(null);
  };

  // Handle successful operations
  const handleAddSuccess = async (newLoanType) => {
    const result = await addLoanType(newLoanType);
    if (result.success) {
      closeAllModals();
    }
    return result;
  };

  const handleUpdateSuccess = async (updatedData) => {
    const result = await updateLoanType(selectedLoanType.id, updatedData);
    if (result.success) {
      closeAllModals();
    }
    return result;
  };

  const handleDeleteSuccess = async () => {
    const result = await deleteLoanType(selectedLoanType.id);
    if (result.success) {
      closeAllModals();
    }
    return result;
  };

  return (
    <div className='space-y-6'>
      <LoanTypesHeader
        onAddNew={() => setShowAddModal(true)}
        totalTypes={loanTypes.length}
        loading={loading}
      />

      <LoanTypesTable
        loanTypes={loanTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modals */}
      {showAddModal && (
        <AddLoanTypeModal
          onClose={closeAllModals}
          onAdd={handleAddSuccess}
          loading={loading}
        />
      )}

      {showEditModal && selectedLoanType && (
        <EditLoanTypeModal
          loanType={selectedLoanType}
          onClose={closeAllModals}
          onUpdate={handleUpdateSuccess}
          loading={loading}
        />
      )}

      {showDeleteModal && selectedLoanType && (
        <DeleteConfirmModal
          loanType={selectedLoanType}
          onClose={closeAllModals}
          onDelete={handleDeleteSuccess}
          loading={loading}
        />
      )}
    </div>
  );
}
