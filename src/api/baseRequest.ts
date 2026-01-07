import axios from "axios";
// const URL = import.meta.env.VITE_APP_ENDPOINT;

// Helper function to get userType from store
const getUserType = () => {
  if (typeof window !== 'undefined') {
    try {
      const storeData = localStorage.getItem("navPaths");
      if (storeData) {
        const parsed = JSON.parse(storeData);
        return parsed?.state?.userType || "";
      }
    } catch (e) {
      console.error("Error reading userType from store:", e);
    }
  }
  return "";
};

// Helper function to get role from store
const getRole = () => {
  if (typeof window !== 'undefined') {
    try {
      const storeData = localStorage.getItem("navPaths");
      if (storeData) {
        const parsed = JSON.parse(storeData);
        return parsed?.state?.role || "";
      }
    } catch (e) {
      // Ignore errors
    }
  }
  return "";
};

export const requestClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/admins',
});

requestClient.interceptors.request.use(
  async (config) => {
    const userType = getUserType();
    const role = getRole();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (userType === 'lastma' || role === 'lastma_admin') {
      config.baseURL = baseUrl ? `${baseUrl.replace(/\/$/, '')}/lastmadmins` : '/lastmadmins';
    } else {
      config.baseURL = baseUrl ? `${baseUrl.replace(/\/$/, '')}/admins` : '/admins';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const withAuthHeadersHOC =
  <T>(
    fn: (
      config: { headers: { Authorization: string } },
      ...args: unknown[]
    ) => Promise<T>,
  ) =>
  (accessToken: string, ...args: unknown[]): Promise<T> =>
    fn({ headers: { Authorization: `Bearer ${accessToken}` } }, ...args);
