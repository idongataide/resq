import axios from 'axios';

// Get the token from localStorage at the time of instance creation
const authTokens = localStorage.getItem("adminToken")
  ? JSON.parse(localStorage.getItem("adminToken")!)
  : null;

// Create a new axios instance for the wallet service
const walletAPIInstance = axios.create({
  baseURL: import.meta.env.VITE_WALLET_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(authTokens?.access && { 'Authorization': `Bearer ${authTokens.access}` }),
  },
});

export const TransactionList = async () => {
    try {
      return await walletAPIInstance
        .get(`/payments/get-transactions`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
};



export const getTransactionCount = async (operatorCount: string) => {
  try {
    return await walletAPIInstance
      .get(`/payments/get-transactions?component=${operatorCount}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};