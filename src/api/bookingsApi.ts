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