import React, { useState } from "react";
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useRevenues } from '@/hooks/useAdmin';
// import type { RangePickerProps } from 'antd/es/date-picker';
import generatePicker from 'antd/es/date-picker/generatePicker';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';
import { Moment } from 'moment';
import toast, { Toaster } from "react-hot-toast";

const MomentDatePicker = generatePicker<Moment>(momentGenerateConfig);
const RangePicker = MomentDatePicker.RangePicker;

interface RevenueData {
  date: string;
  amount: number;
}



type TimePeriod = 'weekly' | 'monthly' | 'yearly';

const RevenueGrowthChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('weekly');
  const [customDates, setCustomDates] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Disable dates based on selected period
  const disabledDate = (current: moment.Moment) => {
    if (!current) return false;
    
    const today = moment().endOf('day');
    
    // Can't select dates in the future
    if (current.isAfter(today)) return true;

    // Additional checks based on selectedPeriod for past dates
    if (selectedPeriod === 'weekly') {
      // For weekly view, allow selecting any past date
      return false;
    } else if (selectedPeriod === 'monthly') {
      const twelveMonthsAgo = moment().subtract(12, 'months').startOf('month');
      if (current.isBefore(twelveMonthsAgo)) return true;
    } else if (selectedPeriod === 'yearly') {
      const oneYearAgo = moment().subtract(1, 'year').startOf('year');
      if (current.isBefore(oneYearAgo)) return true;
    }
    
    return false;
  };

  // Handle date range change for custom period
  const handleRangePickerChange = (dates: [Moment | null, Moment | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const start = dates[0];
      const end = dates[1];

      if (selectedPeriod === 'weekly') {
        // For weekly, ensure range is not more than 10 days
        if (end.diff(start, 'days') > 14) {
          toast.error('Date range cannot exceed 10 days for weekly view.');
          setCustomDates(null);
          return;
        }
      }
      setCustomDates([start, end]);
    } else {
      setCustomDates(null);
    }
  };

  // Get the appropriate endpoint based on selected period
  const getEndpoint = (period: TimePeriod) => {
    const today = moment().format('YYYY-MM-DD');
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const startOfYear = moment().startOf('year').format('YYYY-MM-DD');

    const startDate = customDates ? customDates[0].format('YYYY-MM-DD') : '';
    const endDate = customDates ? customDates[1].format('YYYY-MM-DD') : '';

    if (period === 'weekly') {
      return `revenue-growth-weekly&start_date=${startDate || startOfWeek}&end_date=${endDate || today}`;
    } else if (period === 'monthly') {
      return `revenue-growth-monthly&start_date=${startDate || startOfMonth}&end_date=${endDate || today}`;
    } else if (period === 'yearly') {
      return `revenue-growth-yearly&start_date=${startDate || startOfYear}&end_date=${endDate || today}`;
    }

    return 'revenue-growth';
  };

  const { data: graph } = useRevenues(getEndpoint(selectedPeriod));

  console.log(graph,'graph')

  // Transform the API data into the format required by nivo
  const transformedData = React.useMemo(() => {
    if (!graph) return [];

    const revenueData = graph as any[]; // Use 'any' to allow for 'week' or 'date'
    const data = [{
      id: 'Revenue',
      data: revenueData
        .filter(item => {
          // Filter out null/undefined dates/weeks and invalid dates/weeks
          return (item.date !== null && item.date !== undefined && moment(item.date).isValid()) ||
                 (item.week !== null && item.week !== undefined && moment(item.week, 'YYYY-WW').isValid());
        })
        .map(item => {
          let xValue: string;
          if (item.week) {
            // If it's weekly data, convert 'YYYY-Wxx' to the start of the ISO week in YYYY-MM-DD format
            xValue = moment(item.week, 'YYYY-WW').startOf('isoWeek').format('YYYY-MM-DD');
          } else {
            // Otherwise, assume it's a direct date
            xValue = item.date;
          }
          return {
            x: xValue,
            y: item.amount,
          };
        }),
    }];
    console.log('Transformed Data:', data); // Log the transformed data
    return data;
  }, [graph]);

  const maxValue = React.useMemo(() => {
    if (!graph) return 2000;
    return Math.max(...(graph as RevenueData[]).map(item => item.amount)) * 1.2;
  }, [graph]);

  const tickValues = React.useMemo(() => {
    return [0, Math.ceil(maxValue / 4), Math.ceil(maxValue / 2), Math.ceil(maxValue * 3/4), Math.ceil(maxValue)];
  }, [maxValue]);

  // Get the current period's revenue
  const currentPeriodRevenue = React.useMemo(() => {
    if (!graph) return 0;
    const revenueData = graph as any[];

    let sum = 0;

    if (selectedPeriod === 'weekly' && customDates) {
      const start = customDates[0];
      const end = customDates[1];
      sum = revenueData.reduce((acc, item) => {
        const itemDate = moment(item.week, 'YYYY-WW').startOf('isoWeek');
        if (itemDate.isBetween(start, end, 'day', '[]')) {
          return acc + item.amount;
        }
        return acc;
      }, 0);
    } else if (selectedPeriod === 'monthly' && customDates) {
      const start = customDates[0];
      const end = customDates[1];
      sum = revenueData.reduce((acc, item) => {
        const itemDate = moment(item.date);
        if (itemDate.isBetween(start, end, 'month', '[]')) {
          return acc + item.amount;
        }
        return acc;
      }, 0);
    } else if (selectedPeriod === 'yearly' && customDates) {
      const start = customDates[0];
      const end = customDates[1];
      sum = revenueData.reduce((acc, item) => {
        const itemDate = moment(item.date);
        if (itemDate.isBetween(start, end, 'year', '[]')) {
          return acc + item.amount;
        }
        return acc;
      }, 0);
    } else if (selectedPeriod === 'weekly' || selectedPeriod === 'monthly' || selectedPeriod === 'yearly') {
      // For non-custom periods, sum all amounts in the graph data as the backend should return the correct range
      sum = revenueData.reduce((acc, item) => acc + item.amount, 0);
    } else {
      // Fallback for custom or any other case, sum all amounts in graph
      sum = revenueData.reduce((acc, item) => acc + item.amount, 0);
    }
    
    return sum;
  }, [selectedPeriod, customDates, graph]);

  // Get the period label
  const periodLabel = React.useMemo(() => {
    switch (selectedPeriod) {
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
      case 'weekly':
        return 'MMM D';
      case 'monthly':
        return 'MMM';
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

  const handlePeriodButtonClick = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setShowDatePicker(true);
    setCustomDates(null);
  };

  const getPickerType = (period: TimePeriod) => {
    switch (period) {
      case 'monthly':
        return 'month';
      case 'yearly':
        return 'year';
      default:
        return 'date';
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
      tickValues: selectedPeriod === 'monthly' ? 'every 1 month' : undefined,
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
    <div className="bg-white rounded-lg p-6 mb-6 border border-[#E5E9F0] min-h-[390px]">

    <Toaster/>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xs font-medium text-[#667085]">Revenue Growth</h3>
          <div className="flex items-center text-sm">
            <span className="text-xl font-medium text-[#344054]">₦{currentPeriodRevenue?.toLocaleString()}</span>
            <span className="ml-2 text-[#475467]">{periodLabel}</span>
            <HiMiniArrowTrendingUp className="text-[20px] ml-2 text-[#69B574]" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 flex">
            <button 
              onClick={() => handlePeriodButtonClick('weekly')}
              className={`px-3 py-1 text-[#475467] text-xs cursor-pointer border ${selectedPeriod === 'weekly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => handlePeriodButtonClick('monthly')}
              className={`px-3 py-1 text-[#475467] text-xs cursor-pointer border ${selectedPeriod === 'monthly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => handlePeriodButtonClick('yearly')}
              className={`px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md border ${selectedPeriod === 'yearly' ? 'bg-[#FFF3ED] border-[#FF6C2D] text-[#FF6C2D]' : 'border-[#F2F4F7]'}`}
            >
              Yearly
            </button>
          </div>
          {showDatePicker && (
            <RangePicker
              size="small"
              style={{ width: 220 }}
              disabledDate={disabledDate}
              onChange={handleRangePickerChange}
              value={customDates}
              picker={getPickerType(selectedPeriod)}
              ranges={{
                'This Week': [moment().startOf('week'), moment().endOf('week')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'This Year': [moment().startOf('year'), moment().endOf('year')],
              }}
            />
          )}
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