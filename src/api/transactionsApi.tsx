import { axiosAPIInstance } from "./interceptor";

export const TransactionList = async () => {
    try {
      return await axiosAPIInstance
        .get(`/payments/get-transactions`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
 };