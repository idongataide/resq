import React, { useState } from "react";
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useRevenues } from '@/hooks/useAdmin';

interface RevenueData {
  date: string;
  amount: number;
}

interface RevenueSummary {
  thisWeek: number;
  thisMonth: number;
  thisQuarter: number;
}

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';

const RevenueGrowthChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('daily');

  // Get the appropriate endpoint based on selected period
  const getEndpoint = (period: TimePeriod) => {
    switch (period) {
      case 'daily':
      case 'weekly':
        return 'revenue-growth';
      case 'monthly':
        return 'revenue-growth-monthly';
      case 'yearly':
        return 'revenue-growth-yearly';
      case 'all':
        return 'revenue-growth';
      default:
        return 'revenue-growth';
    }
  };

  const { data: graph } = useRevenues(getEndpoint(selectedPeriod));
  const { data: revenues } = useRevenues('inflow-earnings');

  console.log(graph,'graph')

  // Transform the API data into the format required by nivo
  const transformedData = React.useMemo(() => {
    if (!graph) return [];

    const revenueData = graph as RevenueData[];
    return [{
      id: 'Revenue',
      data: revenueData.map(item => ({
        x: item.date,
        y: item.amount,
      })),
    }];
  }, [graph]);

  const maxValue = React.useMemo(() => {
    if (!graph) return 2000;
    return Math.max(...(graph as RevenueData[]).map(item => item.amount)) * 1.2;
  }, [graph]);

  const tickValues = React.useMemo(() => {
    return [0, Math.ceil(maxValue / 4), Math.ceil(maxValue / 2), Math.ceil(maxValue * 3/4), Math.ceil(maxValue)];
  }, [maxValue]);

  // Get the revenue summary
  const revenueSummary = React.useMemo(() => {
    if (!revenues) return { thisWeek: 0, thisMonth: 0, thisQuarter: 0 };
    return revenues as RevenueSummary;
  }, [revenues]);

  // Get the current period's revenue
  const currentPeriodRevenue = React.useMemo(() => {
    switch (selectedPeriod) {
      case 'weekly':
        return revenueSummary.thisWeek;
      case 'monthly':
        return revenueSummary.thisMonth;
      case 'yearly':
        return revenueSummary.thisQuarter;
      default:
        return revenueSummary.thisWeek;
    }
  }, [selectedPeriod, revenueSummary]);

  // Get the period label
  const periodLabel = React.useMemo(() => {
    switch (selectedPeriod) {
      case 'daily':
        return 'Today';
      case 'weekly':
        return 'This week';
      case 'monthly':
        return 'This month';
      case 'yearly':
        return 'This quarter';
      default:
        return 'This week';
    }
  }, [selectedPeriod]);

  const getDateFormat = (period: TimePeriod) => {
    switch (period) {
      case 'daily':
        return 'MMM D';
      case 'weekly':
        return 'MMM D';
      case 'monthly':
        return 'MMM'; // Changed from 'MMMM' to 'MMM' for abbreviated month names
      case 'yearly':
        return 'YYYY';
      default:
        return 'MMM D';
    }
  };

  // Get the xScale format based on selected period
  const getXScaleFormat = (period: TimePeriod) => {
    switch (period) {
      case 'monthly':
        return '%Y-%m';
      case 'yearly':
        return '%Y';
      default:
        return '%Y-%m-%d';
    }
  };

  const commonProps = {
    margin: { top: 0, right: 20, bottom: 20, left: 50 },
    xScale: {
      type: 'time' as const,
      format: getXScaleFormat(selectedPeriod),
      precision: selectedPeriod === 'monthly' ? ('month' as const) : 
                 selectedPeriod === 'yearly' ? ('year' as const) : 
                 ('day' as const),
      useUTC: false,
    },
    yScale: {
      type: 'linear' as const,
      min: 0,
      max: maxValue,
      stacked: false,
      reverse: false,
    },
    axisTop: null,
    axisRight: null,
    axisBottom: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '',
      legendOffset: 36,
      legendPosition: 'middle' as const,
      format: (value: string) => moment(value).format(getDateFormat(selectedPeriod)),
      tickValues: selectedPeriod === 'monthly' ? 'every 1 month' : undefined, // Add this line
    },
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      tickValues: tickValues,
      legend: '',
      legendOffset: -40,
      legendPosition: 'middle' as const,
      format: (value: number) => `₦${value?.toLocaleString()}`,
    },
    enableGridX: false,
    enableGridY: true,
    gridYValues: tickValues,
    colors: ['#FFBB9E'],
    pointSize: 2,
    pointColor: { theme: 'background' as const },
    pointBorderWidth: 1,
    pointBorderColor: { from: 'serieColor' as const },
    pointLabelYOffset: -12,
    theme: {
      grid: {
        line: {
          stroke: '#E5E9F0',
          strokeWidth: 1,
          strokeDasharray: '4 4',
        },
      },
      axis: {
        ticks: {
          line: {
            stroke: 'transparent',
          },
        },
      },
    },
    useMesh: true,
    areaBlendMode: 'normal' as const,
    enableArea: true,
    defs: [
      {
        id: 'area-gradient',
        type: 'linearGradient' as const,
        colors: [
          { offset: 0, color: '#FFBB9E', opacity: 0.8 },
          { offset: 100, color: '#FFBB9E', opacity: 0 },
        ],
        gradientTransform: 'rotate(10)',
      },
    ],
    fill: [
      {
        match: { id: 'Revenue' },
        id: 'area-gradient',
      },
    ],
    tooltip: ({ point }: any) => {
      if (!point) return null;
      return (
        <div style={{
          background: '#334155',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          <div style={{ color: point.serieColor }}>
            {moment(point.data.x as string).format(getDateFormat(selectedPeriod))}
          </div>
          <strong>₦{point?.data?.y?.toLocaleString()}</strong>
        </div>
      );
    },
    crosshairType: 'bottom-left' as const,
    enablePoints: false,
    enableSlices: 'x' as const,
    sliceTooltip: ({ slice }: any) => {
      if (slice.points.length === 0) return null;
      const point = slice.points[0];
      return (
        <div style={{
          background: '#334155',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          <div style={{ color: point.serieColor }}>
            {moment(point.data.x as string).format(getDateFormat(selectedPeriod))}
          </div>
          <strong>₦{point?.data?.y?.toLocaleString()}</strong>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-[#E5E9F0] min-h-[390px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xs font-medium text-[#667085]">Revenue Growth</h3>
          <div className="flex items-center text-sm">
            <span className="text-xl font-medium text-[#344054]">₦{currentPeriodRevenue?.toLocaleString()}</span>
            <span className="ml-2 text-[#475467]">{periodLabel}</span>
            <HiMiniArrowTrendingUp className="text-[20px] ml-2 text-[#69B574]" />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          <button 
            onClick={() => setSelectedPeriod('daily')}
            className={`px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-bl-md rounded-tl-md border ${selectedPeriod === 'daily' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => setSelectedPeriod('weekly')}
            className={`px-3 py-1 text-[#475467] text-xs cursor-pointer border ${selectedPeriod === 'weekly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-3 py-1 text-[#475467] text-xs cursor-pointer border ${selectedPeriod === 'monthly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setSelectedPeriod('yearly')}
            className={`px-3 py-1 text-[#475467] text-xs cursor-pointer border ${selectedPeriod === 'yearly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
          >
            Yearly
          </button>
          <button 
            onClick={() => setSelectedPeriod('all')}
            className={`px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md border ${selectedPeriod === 'all' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
          >
            All time
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveLine
          {...commonProps}
          data={transformedData}
        />
      </div>
    </div>
  );
};

export default RevenueGrowthChart;