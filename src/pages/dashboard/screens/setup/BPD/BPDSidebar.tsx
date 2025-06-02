import React, { useState, useRef } from 'react';
import { FaFilePdf, FaTrash } from 'react-icons/fa';

interface BPDSidebarProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: { name: string; size?: string } | null;
}

const BPDSidebar: React.FC<BPDSidebarProps> = ({ open, onClose, mode, initialData }) => {
  const [docName, setDocName] = useState(initialData?.name || '');
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(
    initialData && initialData.size ? { name: initialData.name, size: initialData.size } : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileInfo({ name: f.name, size: `${(f.size / 1024).toFixed(1)}Kb` });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    // Implement save logic here
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-[#38383880] p-5 bg-opacity-50" onClick={onClose}>
      <div
        className="md:w-[48%] lg:w-1/3 w-100 z-[9999] h-full bg-white rounded-xl slide-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full bg-white rounded-xl overflow-hidden">
          <div className="flex justify-between items-center py-3 px-6 border-b border-[#D6DADD]">
            <h2 className="text-md font-semibold text-[#1C2023]">
              {mode === 'edit' ? 'Edit Process document' : 'Add new document'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#7D8489] bg-[#EEF0F2] cursor-pointer py-2 px-3 rounded-3xl hover:text-black"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto flex flex-col h-[calc(100vh-160px)] px-7 py-4">
            <div className="form-section mb-4">
              <h3 className="text-md font-medium text-[#475467] mb-3">
                {mode === 'edit' ? 'Document name' : 'Business process document'}
              </h3>
              <div className="border border-[#F2F4F7] p-3 rounded-lg mb-4">
                <label className="block text-[#475467] mb-2">Document name</label>
                <input
                  type="text"
                  className="w-full border border-[#E5E9F0] rounded-md px-4 py-2"
                  placeholder={mode === 'edit' ? 'Document name' : 'Enter details'}
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#475467] mb-2">Upload BPD document</label>
                <div className="border border-dashed border-[#FF6C2D] rounded-lg p-4 flex items-center gap-4 min-h-[60px]">
                  {fileInfo ? (
                    <>
                      <FaFilePdf className="text-red-500 text-2xl" />
                      <div className="flex-1">
                        <div className="font-medium text-[#475467]">{fileInfo.name}</div>
                        <div className="text-xs text-[#667085]">PDF • {fileInfo.size}</div>
                      </div>
                      <button onClick={handleRemoveFile} className="text-[#C21E1E] ml-2">
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <>
                      <label className="flex-1 cursor-pointer" htmlFor="bpd-upload">
                        <span className="text-[#667085]">Click to upload</span>
                        <input
                          id="bpd-upload"
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <button
                        className="px-4 py-2 bg-[#FF6C2D] text-white rounded-md"
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                      >
                        Upload
                      </button>
                      <span className="ml-2 text-xs text-[#667085]">PDF | DOCX 2mb max.</span>
                    </>
                  )}
                </div>
              </div>
              <button
                className="w-full mt-4 bg-[#FF6C2D] text-white py-3 rounded-md font-medium"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPDSidebar; 