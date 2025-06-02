import { axiosAPIInstance } from "./interceptor";

export const getBookings = async (ride_status: string = '0') => {
    try {
      return await axiosAPIInstance
        .get(`/towings?ride_status=${ride_status}`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
};

export const getBookingsCount = async (countStatus: string) => {
  try {
    return await axiosAPIInstance
      .get(`/towings?component=${countStatus}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getRevenues = async (operatorEarning: string) => {
  try {
    return await axiosAPIInstance
      .get(`/towings?component=${operatorEarning}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getDashboardOperators = async () => {
  try {
    return await axiosAPIInstance
      .get(`/towings/get-dashboard-ops/`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};
export const getRemittedRevenue = async () => {
  try {
    return await axiosAPIInstance
      .get(`/towings/stakeholder-daily-revenue/`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getStakeholderPayouts = async () => {
  try {
    return await axiosAPIInstance
      .get(`/towings/stakeholder-revenue/`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const DailyPayout = async () => {
  try {
    return await axiosAPIInstance
      .get(`/towings/daily-revenue/`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const approveTowingRequest = async (requestId: string, data: {
  tow_company_id: string;
  asset_id: string;
  driver_id: string;
  service_id: string;
}) => {
  try {
    const response = await axiosAPIInstance.post(
      `/towings/approve-towing-request/${requestId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectTowingRequest = async (data: { towing_id: string; reason: string }) => {
  try {
    const response = await axiosAPIInstance.post(
      `/towings/cancel-request`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}; 

export const getDailyPayout = async () => {
  try {
    return await axiosAPIInstance
      .get(`/towings/daily-revenue-operator`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};