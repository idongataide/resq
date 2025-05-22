import axios from 'axios';

// Get the token from localStorage at the time of instance creation
const authTokens = localStorage.getItem("adminToken")
  ? JSON.parse(localStorage.getItem("adminToken")!)
  : null;

// Create a new axios instance for the wallet service
const walletAPIInstance = axios.create({
  baseURL: 'https://resq-wallet.onrender.com',
  headers: {
    'Content-Type': 'application/json', 
    ...(authTokens?.access && { 'Authorization': `Bearer ${authTokens.access}` }),
  },
});

export const TransactionList = async () => {
    try {
      return await walletAPIInstance
        .get(`/admins/payments/get-transactions`)
        .then((res) => {
          return res?.data;
        });
    } catch (error) {
      return error;
    }
};