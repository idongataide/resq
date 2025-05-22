import axios from 'axios';

// Create a new axios instance for the wallet service
const walletAPIInstance = axios.create({
  baseURL: 'https://resq-wallet.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

walletAPIInstance.interceptors.request.use(
  async (req) => {
    const authTokens = localStorage.getItem("adminToken")
      ? JSON.parse(localStorage.getItem("adminToken")!)
      : null;

    if (authTokens?.access) {
        console.log('ker')
      req.headers.Authorization = `Bearer ${authTokens?.access}`;
    }
    return req;
  },
  (error) => {
    console.log("error", error);
    return Promise.reject(error);
  },
);

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