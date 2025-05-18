import React, { useEffect } from "react";
import { useOnboardingStore } from "../global/store";
import DashboardLayout from "../layouts/dashboardLayout";

const MainRouter: React.FC = () => {
  const { accessToken, isAuthorized } = useOnboardingStore();

  useEffect(() => {
    // Add any initialization logic here if needed
  }, []);

  if (!accessToken || !isAuthorized) {
    return <DashboardLayout />;
  }

  return <div>Please login to access the dashboard</div>;
};

export default MainRouter;
