import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaAngleLeft, FaUsers, FaPlus } from 'react-icons/fa';
import BPDSidebar from './BPDSidebar';

interface BPDDocument {
  id: string;
  name: string;
  size: string;
}

const mockDocuments: BPDDocument[] = [
  { id: '1', name: 'Document 1', size: '124Kb' },
  { id: '2', name: 'Document 2', size: '124Kb' },
  { id: '3', name: 'Document 3', size: '124Kb' },
];

const BPDListing: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'add' | 'edit'>('add');
  const [editDoc, setEditDoc] = useState<BPDDocument | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const countData: { total: number }[] = [];


  const handleAddNew = () => {
    setEditDoc(null);
    setSidebarMode('add');
    setSidebarOpen(true);
  };

  const handleEdit = (doc: BPDDocument) => {
    setEditDoc(doc);
    setSidebarMode('edit');
    setSidebarOpen(true);
    setMenuOpenId(null);
  };

  const handleDelete = (doc: BPDDocument) => {
    // You can open a confirmation modal here instead
    setEditDoc(doc);
    setSidebarMode('edit'); // or 'delete' if you want a separate mode
    setSidebarOpen(true);
    setMenuOpenId(null);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setEditDoc(null);
  };

  return (
    <div className="p-6">
         <div className="py-1 px-6 mt-10">
        <div 
          className="flex items-center mb-5 mt-10 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <FaAngleLeft className='text-lg text-[#667085]' />
          <p className='ml-2 font-bold text-[#667085] text-lg'>Back</p>
        </div>
        <div className="bg-image rounded-lg sm border border-[#E5E9F0] p-6 mb-6 relative overflow-hidden ">
        <div className="relative z-10 flex justify-between items-center py-5">
          <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[#FFF0EA] rounded-full p-2">
                  <FaUsers className="text-[#FF6C2D]" />
              </div>
              <div className="ml-2">
                  <h2 className="text-[26px] font-bold text-[#475467] mb-1">{countData?.[0]?.total ?? 0}</h2>
                  <p className="text-[#667085] text-md font-medium">Business process docs</p>
              </div>
          </div>
          <button
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-[16px] bg-[#FF6C2D] text-white rounded-lg hover:bg-[#FF6C2D] transition-colors"            
            onClick={handleAddNew}
         >
            <FaPlus className="text-white" />
            <span> Add new</span>
          </button>
        </div>
      </div>
        
        <BPDListing />
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center border border-[#E5E9F0] rounded-lg p-4 bg-white relative"
          >
            <FaFilePdf className="text-red-500 text-2xl mr-3" />
            <div className="flex-1">
              <div className="font-medium text-[#475467]">{doc.name}</div>
              <div className="text-xs text-[#667085]">PDF • {doc.size}</div>
            </div>
            <button
              className="ml-2"
              onClick={() => setMenuOpenId(menuOpenId === doc.id ? null : doc.id)}
            >
              <BsThreeDotsVertical />
            </button>
            {menuOpenId === doc.id && (
              <div className="absolute right-4 top-12 bg-white border border-[#E5E9F0] rounded shadow-xs z-10 w-48">
                <div
                  className="px-4 py-2 text-[#475467] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleEdit(doc)}
                >
                  Edit document
                </div>
                <div
                  className="px-4 py-2 text-[#475467] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleDelete(doc)}
                >
                  Delete document
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <BPDSidebar
        open={sidebarOpen}
        onClose={handleCloseSidebar}
        mode={sidebarMode}
        initialData={editDoc}
      />
    </div>
  );
};

export default BPDListing; 