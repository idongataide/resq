import { axiosAPIInstance } from "./interceptor";
import { getUserType } from "./transactionsApi";
import { getRole } from "./transactionsApi";

const getTeamsEndpoint = (type: string = '') => {
  const userType = getUserType();
  const role = getRole();
  
  return (userType === 'lastma' || role === 'lastma_admin') 
    ? '/users' 
    : `/accounts/admin-user?type=${type}`;
};

export const getTeams = async (type: string = '') => {
  try {
    const endpoint = getTeamsEndpoint(type);
    return await axiosAPIInstance
      .get(endpoint)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  } 
};

export const addTeams = async (data: any, type: string = '') => {
  try {
    const endpoint = getTeamsEndpoint(type);
    return await axiosAPIInstance
      .post(endpoint, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getTeamsCount = async (countStatus: string, type: string = '') => {
  try {
    const endpoint = getTeamsEndpoint(type);
    const url = endpoint.includes('?') 
      ? `${endpoint}&component=${countStatus}`
      : `${endpoint}?component=${countStatus}`;
    
    return await axiosAPIInstance
      .get(url)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteTeams = async (id: string, type: string = '') => {
  try {
    const endpoint = getTeamsEndpoint(type);
    return await axiosAPIInstance
      .delete(`${endpoint}/${id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};