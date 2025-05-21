import React from "react";
import { useNavigate } from "react-router-dom";
import { useAllBookingsCount } from "@/hooks/useAdmin";

const BookingCategory: React.FC = () => {
  const navigate = useNavigate();

  const { data: bookingsCount } = useAllBookingsCount('count-status');


  const bookingCategories = [
    {
      count: bookingsCount?.pending || '00',
      title: "Pending request",
      description: "Manage incoming requests for customer tow booking",
      action: "View →",
      path: "pending"
    },
    {
      count: bookingsCount?.approved || '00',
      title: "Accepted request",
      description: "Manage and assign operators to customer requests",
      action: "View →",
      path: "accepted"
    },
    {
      count: bookingsCount?.arrived || '00',
      title: "Ongoing request",
      description: "Monitor ongoing request and mark as completed when done",
      action: "View →",
      path: "ongoing"
    },
    {
      count: bookingsCount?.completed || '00',
      title: "Completed request",
      description: "Overview of completed customer requests",
      action: "View →",
      path: "completed"
    },
    {
      count: bookingsCount?.cancelled || '00',
      title: "Rejected requests",
      description: "Overview of rejected customer requests",
      action: "View →",
      path: "rejected"
    },
  ];

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <main>
      <div className="py-1 px-6 mt-10">
        <div className="flex px-4 justify-between mb-6 items-center">
          <h1 className="text-[18px] text-[#667085] font-[700]">Bookings</h1>        
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 px-4 lg:grid-cols-4 gap-4">
          {bookingCategories.map((category, index) => (
            <div 
              key={index} 
              className="p-5 border border-[#E5E9F0] cursor-pointer bg-[#fff] rounded-lg shadow-xm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 will-change-transform"
              onClick={() => handleCategoryClick(category.path)}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <span className="text-[26px] font-bold">{category.count}</span>
                  <h2 className="text-[16px] text-[#667085] font-medium mt-1">{category.title}</h2>
                  <p className="text-[14px] text-[#667085] mt-1">{category.description}</p>
                </div>
                <button className="text-[#FF6C2D] text-[14px] cursor-pointer font-medium hover:text-blue-700 mt-4 self-end">
                  {category.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BookingCategory;