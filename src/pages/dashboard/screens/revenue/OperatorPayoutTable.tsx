import React, { useState, useMemo } from 'react';
import { Table, type ColumnDefinition } from '@/components/ui/Table';
import { useDailyPayout } from '@/hooks/useAdmin';
import LoadingScreen from '@/pages/dashboard/common/LoadingScreen';

type Period = 'daily' | 'weekly' | 'monthly';

interface DailyPayout {
  _id: {
    date: string;
    stake_id: string;
  };
  serviceFee: number;
  totalAmount: number;
  date: string;
  operator_id: string;
  name: string;
  bank_info: {
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
  };
}

interface TableDailyPayout extends DailyPayout {
  id: string;
}

const OperatorPayoutTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');

  const { data: payouts, isLoading } = useDailyPayout();

  const calculateDateRange = (period: Period) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(today.getMonth() - 1);
        break;
    }

    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };
  };

  const filteredData = useMemo(() => {
    if (!payouts) return [];
    const { start_date, end_date } = calculateDateRange(selectedPeriod);
    return payouts.filter((payout: DailyPayout) => {
      const payoutDate = new Date(payout.date);
      return payoutDate >= new Date(start_date) && payoutDate <= new Date(end_date);
    });
  }, [payouts, selectedPeriod]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, filteredData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns: Array<ColumnDefinition<TableDailyPayout>> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value) => (
        <span className='text-[#475467]'>
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
    {
      title: "Beneficiary",
      dataIndex: "name",
      key: "name",
      render: (value) => <span className='font-medium text-[#475467]'>{value}</span>,
    },
    {
      title: "Amount due",
      dataIndex: "serviceFee",
      key: "serviceFee",
      render: (value) => <span className='text-[#475467]'>₦{value.toLocaleString()}</span>,
    },
    // {
    //   title: "Amount paid",
    //   dataIndex: "totalAmount",
    //   key: "totalAmount",
    //   render: (value) => <span className='text-[#475467]'>₦{value.toLocaleString()}</span>,
    // },
    {
      title: "Bank name",
      dataIndex: "bank_info",
      key: "bank_name",
      render: (_, record) => <span className='text-[#475467]'>{record.bank_info.bank_name || 'N/A'}</span>,
    },
    {
      title: "Account number",
      dataIndex: "bank_info",
      key: "account_number",
      render: (_, record) => <span className='text-[#475467]'>{record.bank_info.account_number || 'N/A'}</span>,
    },
  ];

  const tableData: TableDailyPayout[] = filteredData.map((payout: DailyPayout) => ({
    ...payout,
    id: payout.operator_id
  }));

  return (
    <div className="mb-6">
      <div className="py-2 px-4 bg-white rounded-md border-[#E5E9F0] flex justify-between items-center">
        <h1 className="text-md font-medium mb-0 text-[#344054]">Operator Payout</h1>
        <div className="text-sm text-gray-500">
          <button 
            className={`px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-bl-md rounded-tl-md border ${selectedPeriod === 'daily' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            onClick={() => setSelectedPeriod('daily')}
          >
            Daily
          </button>
          <button 
            className={`px-3 py-1 text-[#475467] text-xs cursor-pointer border ${selectedPeriod === 'weekly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            onClick={() => setSelectedPeriod('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md border ${selectedPeriod === 'monthly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            onClick={() => setSelectedPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
      <Table 
        columns={columns} 
        data={paginatedData}
        pagination={tableData?.length > pageSize ? {
          current: currentPage,
          pageSize: pageSize,
          total: tableData.length,
          onChange: handlePageChange,
        } : undefined}
      />
    </div>
  );
};

export default OperatorPayoutTable; 