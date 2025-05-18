
import { axiosAPIInstance } from "./interceptor";

export const getCustomers = async () => {
    try {
      return await axiosAPIInstance
        .get(`/users/`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
  };