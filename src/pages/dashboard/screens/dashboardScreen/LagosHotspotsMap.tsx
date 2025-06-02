import Images from "@/components/images";
import { useAllBookingsCount } from "@/hooks/useAdmin";
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// Define interface for the data points
interface BookingDataPoint {
  area: string;
  total: number;
  longitude: number;
  latitude: number;
}

const LagosHotspotsMap: React.FC = () => {
  const { data: bookingsCount } = useAllBookingsCount('area-map');
 
  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  // Center map on Lagos
  const center = {
    lat: 6.5244,
    lng: 3.3792
  };

  const apiKey = "AIzaSyAw3wjMqZQWUIkMNHJCHZPcmyPeTfUnuGQ"; // Replace with your actual API key

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  return (
    <div className="bg-white border border-[#E5E9F0] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Hot spots in Lagos</h3>
      
      <div className="h-96 mb-8 flex items-center  rounded-lg overflow-hidden justify-center text-gray-600 font-bold">
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
                    title={point.area}
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