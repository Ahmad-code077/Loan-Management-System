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

  return (
    <div className='space-y-6'>
      <LoanTypesHeader
        onAddNew={() => setShowAddModal(true)}
        totalTypes={loanTypes.length}
      />

      <LoanTypesTable
        loanTypes={loanTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      {showAddModal && (
        <AddLoanTypeModal
          onClose={closeAllModals}
          onAdd={addLoanType}
          loading={loading}
        />
      )}

      {showEditModal && selectedLoanType && (
        <EditLoanTypeModal
          loanType={selectedLoanType}
          onClose={closeAllModals}
          onUpdate={updateLoanType}
          loading={loading}
        />
      )}

      {showDeleteModal && selectedLoanType && (
        <DeleteConfirmModal
          loanType={selectedLoanType}
          onClose={closeAllModals}
          onDelete={deleteLoanType}
          loading={loading}
        />
      )}
    </div>
  );
}
