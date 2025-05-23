import React from "react";
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import { HiMiniArrowTrendingUp } from "react-icons/hi2";


const RevenueGrowthChart: React.FC = () => {

  const dates = [
    '2023-03-30',
    '2023-03-31',
    '2023-04-01',
    '2023-04-02',
    '2023-04-03',
    '2023-04-04',
    '2023-04-05',
    '2023-04-06',
    '2023-04-07',
  ];

  const revenueData = [500, 800, 550, 1050, 1100, 1500, 1500, 1200, 2000];

  const maxValue = Math.max(...revenueData) * 1.2;
  const tickValues = [0, 500, 1000, 1500, 2000];


  const data = [
    {
      id: 'Revenue',
      data: dates.map((date, index) => ({
        x: date,
        y: revenueData[index],
      })),
    },
  ];

  const commonProps = {
    margin: { top: 0, right: 20, bottom: 20, left: 50 },
    xScale: {
      type: 'time' as const,
      format: '%Y-%m-%d',
      precision: 'day' as const,
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
        format: (value: string) => moment(value).format('MMM D'),
    },
  
    axisLeft: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: tickValues, 
        legend: '',
        legendOffset: -40,
        legendPosition: 'middle' as const,
        format: (value: number) => `₦${value}`,
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
            {moment(point.data.x as string).format('MMM D')} • 10:20am
          </div>
          <strong>₦{point.data.y * 100}</strong>
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
            {moment(point.data.x as string).format('MMM D')} • 10:20am
          </div>
          <strong>₦{point.data.y * 100}</strong>
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
            <span className="text-xl font-medium text-[#344054]">₦150,008</span>
            <span className="ml-2 text-[#475467]">This week</span>
            <HiMiniArrowTrendingUp className="text-[20px] ml-2 text-[#69B574]" />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-bl-md rounded-tl-md  border border-[#F2F4F7]">Daily</button>
          <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer  border border-[#F2F4F7]">Weekly</button>
          <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">Monthly</button>
          <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer  border border-[#F2F4F7]">Yearly</button>
          <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">All time</button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveLine
          {...commonProps}
          data={data}
        />
      </div>
      {/* <div className="text-sm text-[#667085] mt-2">(x100)</div> */}
    </div>
  );
};

export default RevenueGrowthChart;