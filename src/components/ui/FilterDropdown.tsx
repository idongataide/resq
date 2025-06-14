import React, { useRef, useEffect } from 'react';

interface FilterOption {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selected: FilterOption | null;
  onSelect: (option: FilterOption) => void;
  isOpen: boolean;
  onClose: () => void;
  filterRef: React.RefObject<HTMLDivElement>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selected,
  onSelect,
  isOpen,
  onClose,
  filterRef
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, filterRef]);

  if (!isOpen) return null;

  return (
    <div 
      ref={filterRef} 
      className="absolute border border-gray-200 min-h-[120px] w-[150px] bg-white rounded-md right-0 top-full mt-2 z-50 p-2 text-[14px] shadow-lg"
    >
      <p className="text-[14px] text-left text-gray-400 mb-2">
        Filter by
      </p>

      {options.map((option) => (
        <div
          onClick={() => {
            onSelect(option);
            onClose();
          }}
          key={option.id}
          className={`flex gap-2 items-center mb-1 cursor-pointer hover:bg-gray-500/20 hover:border border-transparent border hover:border-gray-400 transition-all duration-300 p-2 rounded-md font-[300] text-gray-500 ${
            option.id === selected?.id ? "bg-gray-500/20 border border-gray-400" : ""
          }`}
        >
          {option.icon}
          <div>{option.title}</div>
        </div>
      ))}
    </div>
  );
};

export default FilterDropdown; 