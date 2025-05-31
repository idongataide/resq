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

export const getFeesCategory = async (feeVariable: any) => {
  try {
    return await axiosAPIInstance
      .get(`/settings/fees?component=${feeVariable}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getFeesCount = async () => {
  try {
    return await axiosAPIInstance
      .get(`/settings/fees?component=count`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addFees = async (data: any) => {
  try {
    return await axiosAPIInstance
      .post(`/settings/fees`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateFee = async (feeId: string, data: { amount: string; tag: string; otp: string }) => {
  try {
    return await axiosAPIInstance
      .put(`/settings/fees/${feeId}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteFee = async (feeId: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/settings/fees/${feeId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addService = async (data: { amount: string; type: string; name: string; otp: string }) => {
  try {
    return await axiosAPIInstance
      .post(`/settings/services`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateService = async (service_id: string, data: { amount: string; type: string; name: string; otp: string }) => {
  try {
    return await axiosAPIInstance
      .put(`/settings/services/${service_id}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteService = async (service_id: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/settings/services/${service_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getServicesCount = async () => {
  try {
    return await axiosAPIInstance
      .get(`/settings/services?component=count`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getStakeholders = async () => {
  try {
    const response = await axiosAPIInstance.get('/users/stakeholders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addStakeholder = async (data: { 
  name: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  otp: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/users/stakeholders`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateStakeholder = async (stakeholderId: string, data: { 
  name: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  amount: string;
  amount_type: 'percentage' | 'amount';
  otp: string;
}) => {
  try {
    return await axiosAPIInstance
      .put(`/users/stakeholders/${stakeholderId}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteStakeholder = async (stakeholderId: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/users/stakeholders/${stakeholderId}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const getStakeholdersCount = async () => {
  try {
    const response = await axiosAPIInstance.get('/users/stakeholders?component=count');
    return response.data;
  } catch (error) {
    throw error;
  }
};
  