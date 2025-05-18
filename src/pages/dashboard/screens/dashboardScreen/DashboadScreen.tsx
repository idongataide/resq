import React from "react";


const DashboadScreen: React.FC = () => {

  return (
    <div className="w-full p-6">
      <main className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="h-[150px] border-gray-500 rounded-md  bg-zinc-300 animate-pulse"></div>
        <div className="h-[150px] border-gray-500 rounded-md  bg-zinc-300 animate-pulse"></div>
        <div className="h-[150px] border-gray-500 rounded-md  bg-zinc-300 animate-pulse"></div>
        <div className="h-[150px] border-gray-500 rounded-md  bg-zinc-300 animate-pulse"></div>
      </main>

      <main className="grid grid-cols-1 md:grid-cols-5 mt-10 gap-5">
        <div className="h-[600px] border-gray-500 rounded-md  bg-zinc-300 animate-pulse col-span-1 md:col-span-3"></div>
        <div className="h-[600px] border-gray-500 rounded-md  bg-zinc-300 animate-pulse col-span-1 md:col-span-2"></div>
      </main>
    </div>
  );
};

export default DashboadScreen;
