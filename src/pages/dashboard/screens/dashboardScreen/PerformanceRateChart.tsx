import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PerformanceRateChart: React.FC = () => {
  // Booking data: 62% Successful, 22% Pending, 16% Rejected
  const bookingData = [
    { label: 'Successful', percentage: 62, color: '#34B27B' }, // Green
    { label: 'Pending', percentage: 22, color: '#CE4B4B' }, // Yellow
    { label: 'Rejected', percentage: 16, color: '#EFC15D' }, // Red
  ];

  const data = {
    labels: bookingData.map(item => item.label),
    datasets: [
      {
        data: bookingData.map(item => item.percentage),
        backgroundColor: bookingData.map(item => item.color),
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Add cutout to make it a doughnut chart
    plugins: {
      legend: {
        display: false, // Hide default legend as we have a custom one
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-[#E5E9F0]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-[#344054]">Performance rate</h3>
        <div className="text-sm text-gray-500">
          <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-bl-md rounded-tl-md  border border-[#F2F4F7]">Daily</button>
          <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer  border border-[#F2F4F7]">Weekly</button>
          <button className="px-3 py-1 text-[#475467] text-xs cursor-pointer rounded-br-md rounded-tr-md  border border-[#F2F4F7]">Monthly</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center min-h-[300px] ">
        <div className="w-[168px] h-[168px] flex items-center justify-center relative">
           <Pie data={data} options={options} />
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-xl font-bold text-[#475467]">62%</div>
              <div className="text-sm text-[#667085]">Successful booking</div>
           </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-8 text-sm">
          {bookingData.map((item) => (
            <p key={item.label} className="mb-1 text-[#344054] text-md">
              <span className={`inline-block w-3 h-3 mr-2 rounded-full`} style={{ backgroundColor: item.color }}></span>
              {item.percentage}% {item.label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceRateChart; 