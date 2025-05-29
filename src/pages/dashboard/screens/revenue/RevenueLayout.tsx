import React, { useState } from 'react';
import RevenueGrowthChart from "../dashboardScreen/RevenueGrowthChart";
import RevenueMetrics from "./RevenueMetric";
import OperatorPayoutTable from './OperatorPayoutTable';
import StakeholderPayoutTable, { StakeholderItemData } from './StakeholderPayoutTable';
import RemittedRevenueTable from './RemittedRevenueTable';
import RevenuePerOperatorsTable from './RevenuePerOperatorsTable';

// Define the type for the data received from RemittedRevenueTable row click
interface RemittedRevenueRowData {
  id: string;
  date: string;
  totalRevenue: number;
  originalItems: StakeholderItemData[];
  [key: string]: any; // To accommodate dynamic stakeholder keys
}

const RevenueLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  // State to hold the items data of the selected row
  const [selectedStakeholderItems, setSelectedStakeholderItems] = useState<StakeholderItemData[] | null>(null);
  // State to hold the payout date of the selected row
  const [payoutDate, setPayoutDate] = useState<string | null>(null);


  const handleViewChange = (view: string) => {
    setActiveView(view);
    // Clear selected items and date when switching away from stakeholder view
    if (view !== 'stakeholder') {
      setSelectedStakeholderItems(null);
      setPayoutDate(null); // Clear payout date
    }
  };

  // Handler function for row clicks in RemittedRevenueTable
  // This function now expects the full row data object
  const handleRemittedRowClick = (rowData: RemittedRevenueRowData) => {
    setSelectedStakeholderItems(rowData.originalItems); // Set the selected items from originalItems
    setPayoutDate(rowData.date); // Set the payout date from the clicked row's date property
    setActiveView('stakeholder'); // Switch to the Stakeholder payout tab
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-sm py-3 px-2 rounded-lg mb-3 bg-[#fff">
        <button
          className={`px-6 py-2 text-xs cursor-pointer rounded-bl-md rounded-tl-md  border border-[#F2F4F7] ${activeView === 'overview' ? 'bg-[#E86229] text-[#fff]' : 'text-[#667085]'}`}
          onClick={() => handleViewChange('overview')}
        >
          Overview
        </button>
        <button
          className={`px-6 py-2 text-xs cursor-pointer border border-[#F2F4F7] ${activeView === 'remitted' ? 'bg-[#E86229] text-[#fff]' : 'text-[#667085]'}`}
          onClick={() => handleViewChange('remitted')}
        >
          Remitted revenue
        </button>
        { selectedStakeholderItems && payoutDate && (
            <>
            <button
            className={`px-6 py-2 text-xs cursor-pointer  border border-[#F2F4F7] ${activeView === 'stakeholder' ? 'bg-[#E86229] text-[#fff]' : 'text-[#667085]'}`}
            onClick={() => handleViewChange('stakeholder')}
            >
            Stakeholder payout
            </button>
        </>
        )}
        <button
          className={`px-6 py-2 text-xs cursor-pointer border rounded-br-md rounded-tr-md border-[#F2F4F7] ${activeView === 'operator' ? 'bg-[#E86229] text-[#fff]' : 'text-[#667085]'}`}
          onClick={() => handleViewChange('operator')}
        >
          Operator payout
        </button>
      </div>

      {
        activeView === 'overview' && (
          <>
            <RevenueMetrics />
            <RevenueGrowthChart />
            <RevenuePerOperatorsTable />
          </>
        )
      }
      {
        activeView === 'remitted' && (
          <RemittedRevenueTable onRowClick={handleRemittedRowClick} />
        )
      }
      {
        activeView === 'stakeholder' && selectedStakeholderItems && payoutDate && (
          <StakeholderPayoutTable itemsData={selectedStakeholderItems} payoutDate={payoutDate} /> // Pass both itemsData and payoutDate props
        )
      }
      {
        activeView === 'operator' && (
          <OperatorPayoutTable />
        )
      }

    </div>
  );
};

export default RevenueLayout;
