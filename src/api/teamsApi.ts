
import { axiosAPIInstance } from "./interceptor";

export const getTeams = async () => {
    try {
      return await axiosAPIInstance
        .get(`/accounts/admin-user`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
 };


 export const addTeams = async (data: any) => {
    try {
      return await axiosAPIInstance
        .post(`/accounts/admin-user`, data)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
 };

 