import { axiosAPIInstance } from "./interceptor";

export const getBookings = async (ride_status: string = '0', cancelled_by?: string, start_date?: string, end_date?: string) => {
    try {
      const response = await axiosAPIInstance.get(
        `/towings?ride_status=${ride_status}${cancelled_by ? `&cancelled_by=${cancelled_by}` : ''}${start_date ? `&start_date=${start_date}` : ''}${end_date ? `&end_date=${end_date}` : ''}`
      );
      return response?.data;
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

export const getDashboardOperators = async (date: string) => {
  try {
    return await axiosAPIInstance
      .get(`/towings/get-dashboard-ops?${date}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const getRemittedRevenue = async (date: string) => {
  try {
    return await axiosAPIInstance
      .get(`/towings/stakeholder-daily-revenue${date}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getStakeholderPayouts = async (queryString: string = '') => {
  try {
    return await axiosAPIInstance
      .get(`/towings/stakeholder-revenue/${queryString}`)
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

export const getDailyPayout = async (date: string) => {
  try {
    return await axiosAPIInstance
      .get(`/towings/daily-revenue-operator?${date}`)
      .then((res) => {  
        return res?.data;
      }); 
  } catch (error) {
    return error;
  }
};