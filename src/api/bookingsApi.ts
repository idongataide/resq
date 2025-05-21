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