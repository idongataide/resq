import React, { useRef, useState } from 'react';
import FilterDropdown from './FilterDropdown';

interface FilterOption {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface FilterProps {
  options: FilterOption[];
  selected: FilterOption | null;
  onSelect: (option: FilterOption) => void;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

const Filter: React.FC<FilterProps> = ({
  options,
  selected,
  onSelect,
  buttonText = 'Filter',
  buttonIcon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-4 py-2 text-[#667085] bg-[#F9FAFB] rounded-lg border border-[#E5E9F0] hover:bg-gray-50"
      >
        {buttonIcon}
        <span>{buttonText}</span>
      </button>

      <FilterDropdown
        options={options}
        selected={selected}
        onSelect={onSelect}
        isOpen={isOpen}
        onClose={handleClose}
        filterRef={filterRef}
      />
    </div>
  );
};

export default Filter; 