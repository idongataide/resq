import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import { MdOutlineEdit as IconEdit } from 'react-icons/md';
import { MdOutlineDeleteOutline as IconDelete } from 'react-icons/md';
import { useCommandCenters, useCommandCentersCount } from '@/hooks/useAdmin';
import { deleteCommandCenter } from '@/api/settingsApi';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
// import EditCommandCenterForm from './EditCommandCenterForm';
import { getStatusStyle } from '@/components/ui/statusStyles';


interface CommandCenterItem {
  _id: string;
  name: string; // Changed from command_name to name
  address: string;
  location: { // Added location object with coordinates
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
  updatedAt: string;
  command_id: string; // Changed from command_center_id to command_id
  status?: string; // Added status property
  id: string; // Make id required and always a string
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

  console.log(commandCentersList, 'commandCentersList');

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

  // const handleCloseEditModal = () => {
  //   setShowEditModal(false);
  //   setCommandCenterToEdit(null);
  // };

 const columns: Array<ColumnDefinition<CommandCenterItem>> = [
  {
    title: "Command Name",
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
            ? `${coordinates[1]}, ${coordinates[0]}` // Note: coordinates are [longitude, latitude]
            : 'N/A'}
        </span>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value: string) => {
      const statusValue = value || 'active';
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs capitalize font-medium ${getStatusStyle(statusValue)}`}>
          {statusValue}
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

  const paginatedData = useMemo(() => {
    if (!commandCentersList) return [];
    let filtered = commandCentersList;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((commandCenter: CommandCenterItem) => 
        (commandCenter.status || 'active') === statusFilter
      );
    }
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.map((commandCenter: CommandCenterItem) => ({
      ...commandCenter,
      id: commandCenter._id 
    })).slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, commandCentersList, statusFilter]);

  return (
    <div className="mb-6">
      <Toaster/>
      <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
        <h1 className="text-lg font-medium mb-0 text-[#344054]">Command Centers</h1>
        <div className="relative">
          <button
            onClick={() => setFilterOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50 focus:outline-none"
          >
            <span>{statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute border border-gray-200 min-h-[80px] w-[180px] bg-white rounded-md right-0 top-full mt-2 z-50 p-2 text-[14px] shadow-lg"
            >
              <p className="text-[14px] text-left text-gray-400 mb-2">Filter by status</p>
              {[
                { id: 'all', title: 'All Status' },
                { id: 'active', title: 'Active' },
                { id: 'inactive', title: 'Inactive' },
              ].map((el) => (
                <div
                  onClick={() => {
                    setStatusFilter(el.id as 'all' | 'active' | 'inactive');
                    setFilterOpen(false);
                  }}
                  key={el.id}
                  className={`flex gap-2 items-center mb-1 cursor-pointer hover:bg-gray-500/20 hover:border border-transparent border hover:border-gray-400 transition-all duration-300 p-2 rounded-md font-[500] text-gray-500 ${statusFilter === el.id && "bg-gray-500/20 border border-gray-400 text-gray-700"}`}
                >
                  <div>{el.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Table<CommandCenterItem>
        columns={columns}
        data={paginatedData}
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
        <></>
        // <EditCommandCenterForm
        //   onClose={handleCloseEditModal}
        //   commandCenterData={commandCenterToEdit}
        // />
      )}
    </div>
  );
};

export default CommandCenterTable;