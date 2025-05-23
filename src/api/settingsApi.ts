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

 
export const getFees = async () => {
  try {
    return await axiosAPIInstance
      .get(`settings/fees`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getProfile = async () => {
  try {
    return await axiosAPIInstance
      .get(`accounts/profile`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateProfile = async (data: {
  first_name: string;
  last_name: string;
  phone_number: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`accounts/update-profile`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updatePassword = async (data: {
  old_password: string;
  new_password: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`accounts/update-profile`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const set2FA = async (data: {
  password: string;
  '2fa_code': string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`accounts/set2fa`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};