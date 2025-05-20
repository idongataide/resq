
import { axiosAPIInstance } from "./interceptor";

export const getServices = async (type: any) => {
    try {
      return await axiosAPIInstance
        .get(`/settings/services?type=${type}`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
 };