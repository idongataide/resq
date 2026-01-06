import React, { useState } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import { MdOutlineEdit as IconEdit } from 'react-icons/md';
import { MdOutlineDeleteOutline as IconDelete } from 'react-icons/md';
import { useCommandCenters, useCommandCentersCount } from '@/hooks/useAdmin';
import { deleteCommandCenter } from '@/api/settingsApi';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import EditCommandCenterForm from './EditCommand';


interface CommandCenterItem {
  _id: string;
  name: string; 
  address: string;
  location: { 
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
  command_id: string;
  id: string; 
}

const CommandCenterTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commandCenterToDelete, setCommandCenterToDelete] = useState<CommandCenterItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [commandCenterToEdit, setCommandCenterToEdit] = useState<CommandCenterItem | null>(null);
  const { data: commandCentersList, mutate: mutateCommandCenters } = useCommandCenters();
  const { mutate: mutateCount } = useCommandCentersCount();

  const handleDeleteClick = (commandCenter: CommandCenterItem) => {
    setCommandCenterToDelete(commandCenter);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    console.log('Deleting command center:', commandCenterToDelete);
    if (!commandCenterToDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteCommandCenter(commandCenterToDelete.command_id);

      if (response) {
        toast.success('Command center deleted successfully');
        mutateCommandCenters();
        mutateCount();
      } else {
        toast.error('Failed to delete command center');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting the command center');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCommandCenterToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommandCenterToDelete(null);
  };

  const handleEditClick = (commandCenter: CommandCenterItem) => {
    setCommandCenterToEdit(commandCenter);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCommandCenterToEdit(null);
  };

  const handleCommandCenterUpdated = () => {
    mutateCommandCenters();
    mutateCount();
    toast.success('Command center updated successfully');
  };

  const columns: Array<ColumnDefinition<CommandCenterItem>> = [
    {
      title: "Zone Name",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <span className='text-[#475467] font-medium capitalize'>{value}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (value: string) => <span className='text-[#475467] font-medium'>{value || 'N/A'}</span>,
    },
    {
      title: "Coordinates",
      dataIndex: "location",
      key: "coordinates",
      render: (_: any, record: CommandCenterItem) => {
        const coordinates = record.location?.coordinates;
        return (
          <span className='text-[#475467] font-medium'>
            {coordinates && coordinates?.length >= 2 
              ? `${coordinates[1]}, ${coordinates[0]}` 
              : 'N/A'}
          </span>
        );
      },
    },
    {
      title: "Last modified",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    },
    {
      title: "Actions",
      dataIndex: "command_id",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 text-[#667085] text-sm font-medium cursor-pointer"
            onClick={() => handleEditClick(record)}
          >
            <IconEdit className='w-4 h-4'/> Edit
          </button>
          <button 
            className="flex items-center gap-1 text-[#667085] text-sm font-medium cursor-pointer"
            onClick={() => handleDeleteClick(record)}
            disabled={isDeleting}
          >
            <IconDelete className='w-4 h-4'/> Delete
          </button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="mb-6">
      <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
        <h1 className="text-lg font-medium mb-0 text-[#344054]">Zonal Office</h1>
        <div className="relative">
          {/* Add any additional buttons or controls here */}
        </div>
      </div>
      
      <Table<CommandCenterItem>
        columns={columns}
        data={commandCentersList}
        pagination={commandCentersList?.length > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: commandCentersList?.length,
          onChange: handlePageChange,
        } : undefined}
      />

      {showDeleteModal && commandCenterToDelete && (
        <DeleteConfirmationModal
          itemName={commandCenterToDelete?.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={isDeleting}
        />
      )}

      {showEditModal && commandCenterToEdit && (
        <EditCommandCenterForm
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onCommandCenterUpdated={handleCommandCenterUpdated}
          commandCenterData={commandCenterToEdit}
        />
      )}
    </div>
  );
};

export default CommandCenterTable;