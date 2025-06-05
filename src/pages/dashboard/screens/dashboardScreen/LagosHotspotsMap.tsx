import Images from "@/components/images";
import { useAllBookingsCount } from "@/hooks/useAdmin";
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// Define interface for the data points
interface BookingDataPoint {
  area: string;
  total: number;
  longitude: number;
  latitude: number;
}

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';

const LagosHotspotsMap: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');
  const [dateRange, setDateRange] = useState<{ start_date: string; end_date: string }>({
    start_date: '',
    end_date: ''
  });

  // Function to calculate date range based on selected period
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
      case 'yearly':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        endDate = new Date(); // Current date
        break;
    }

    setDateRange({
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    });
  };

  // Update date range when period changes
  useEffect(() => {
    calculateDateRange(selectedPeriod);
  }, [selectedPeriod]);

  // Format the query string correctly
  const queryString = dateRange.start_date 
    ? `area-map&start_date=${dateRange.start_date}&end_date=${dateRange.end_date}`
    : 'area-map';

  const { data: bookingsCount } = useAllBookingsCount(queryString);

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  // Center map on Lagos
  const center = {
    lat: 6.5244,
    lng: 3.3792
  };

  const apiKey = import.meta.env.VITE_GMAPS_API_KEY; // Replace with your actual API key

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  return (
    <div className="bg-white border border-[#E5E9F0] rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Hot spots in Lagos</h3>
        <div className="text-sm text-gray-500">
          <button 
            onClick={() => setSelectedPeriod('daily')}
            className={`px-3 py-1 text-xs cursor-pointer rounded-bl-md rounded-tl-md border border-[#F2F4F7] ${
              selectedPeriod === 'daily' ? 'text-[#fff] bg-[#E86229]' : 'text-[#475467]'
            }`}
          >
            Daily
          </button>
          <button 
            onClick={() => setSelectedPeriod('weekly')}
            className={`px-3 py-1 text-xs cursor-pointer border border-[#F2F4F7] ${
              selectedPeriod === 'weekly' ? 'text-[#fff] bg-[#E86229]' : 'text-[#475467]'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-3 py-1 text-xs cursor-pointer border border-[#F2F4F7] ${
              selectedPeriod === 'monthly' ? 'text-[#fff] bg-[#E86229]' : 'text-[#475467]'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setSelectedPeriod('yearly')}
            className={`px-3 py-1 text-xs cursor-pointer border border-[#F2F4F7] ${
              selectedPeriod === 'yearly' ? 'text-[#fff] bg-[#E86229]' : 'text-[#475467]'
            }`}
          >
            Yearly
          </button>
          <button 
            onClick={() => setSelectedPeriod('all')}
            className={`px-3 py-1 text-xs cursor-pointer rounded-br-md rounded-tr-md border border-[#F2F4F7] ${
              selectedPeriod === 'all' ? 'text-[#fff] bg-[#E86229]' : 'text-[#475467]'
            }`}
          >
            All time
          </button>
        </div>
      </div>
      
      <div className="h-96 mb-8 flex items-center rounded-lg overflow-hidden justify-center text-gray-600 font-bold">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            {/* Add markers here based on the data */}
            {bookingsCount?.map((point: BookingDataPoint, index: number) => (
              <Marker
                key={index}
                position={{
                  lat: point.latitude,
                  lng: point.longitude
                }}
                title={`${point.area} (${point.total} requests)`}
              />
            ))}
          </GoogleMap>
        ) : (
          <img src={Images.map} alt="Filter" className="w-full rounded-lg" /> // Fallback to image if map not loaded
        )}
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <p><span className="inline-block w-3 h-3 mr-1 rounded-sm bg-orange-500"></span>High demand area</p>
        <p><span className="inline-block w-3 h-3 mr-1 rounded-sm bg-green-500"></span>Partial demand area</p>
      </div>
    </div>
  );
};

export default LagosHotspotsMap;