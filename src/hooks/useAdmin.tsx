import { banksList } from "@/api/banks";
import { getBookings, getBookingsCount, getDashboardOperators, getRemittedRevenue, getRevenues } from "@/api/bookingsApi";
import { getCustomers, getCustomersDetails } from "@/api/customersApi";
import { getOperators, getOperatorData, getDrivers, getDriversByOperatorId, getAssetsbyCordinate, getAssets, getOperatorCount } from "@/api/operatorsApi";
import { getFees, getProfile, getServices } from "@/api/settingsApi";
import { getTeams, getTeamsCount } from "@/api/teamsApi";
import { TransactionList } from "@/api/transactionsApi";


import useSWR from "swr";

export const useAllCustomers = () => {
  const { data, isLoading, mutate } = useSWR(
    `users/`,
    () => {
      return getCustomers().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useCustomersData = (userId: string) => {
  const { data, isLoading, mutate } = useSWR(
    `users/`,
    () => {
      return getCustomersDetails(userId).then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};


export const useAllOperators = () => {
  const { data, isLoading, mutate } = useSWR(
    `users/operators/`,
    () => {
      return getOperators().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};


export const useOperatorData = (uid: string) => {
  const { data, isLoading, mutate } = useSWR(
    `users/operators/${uid}/`,
    () => {
      return getOperatorData(uid).then((res) => {
        return res?.data;
      }); 
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};


export const useOperatorCount = (operatorCount: string) => {
  const { data, isLoading, mutate } = useSWR(
    operatorCount ? `/users/operators?component=${operatorCount}` : null,
    () => {
      return getOperatorCount(operatorCount).then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );
  return { data, isLoading, mutate };
};

export const useAllTeam = () => {
  const { data, isLoading, mutate } = useSWR(
    `/accounts/admin-user`,
    () => {
      return getTeams().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useBanksList = () => {
  const { data, isLoading, mutate } = useSWR(
    `/settings/bank-lists`,
    () => {
      return banksList().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useGetAssets = () => {
  const { data, isLoading, mutate } = useSWR(
    `/users/assets`,
    () => {
      return getAssets().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useGetAssetsbyCord = (longitude: string, latitude: string) => {
  const { data, isLoading, mutate } = useSWR(
    `/users/assets`,
    () => {
      return getAssetsbyCordinate(longitude,latitude).then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useGetDrivers = () => {
  const { data, isLoading, mutate } = useSWR(
    `/users/drivers/`,
    () => {
      return getDrivers().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useGetDriversByOperatorId = (operatorId: string | undefined) => {
  const { data, isLoading, mutate } = useSWR(
    operatorId ? `/users/drivers?operator_id=${operatorId}` : null,
    (url) => {
      if (!url || !operatorId) return null; 
      return getDriversByOperatorId(operatorId).then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading, mutate };
};

export const useAllBookings = (ride_status: string = '0') => {
  const { data, isLoading, mutate } = useSWR(
    `/towings?ride_status=${ride_status}`,
    () => {
      return getBookings(ride_status).then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};


export const useRevenues = (operatorEarning: string) => {
  const { data, isLoading, mutate } = useSWR(
    `/towings?component=${operatorEarning}`,
    () => {
      return getRevenues(operatorEarning).then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useAllBookingsCount = (countStatus: string = '0') => {
  const { data, isLoading, mutate } = useSWR(
    `/towings?component=${countStatus}`,
    () => {
      return getBookingsCount(countStatus).then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};



export const useAllService = (type: string | undefined) => {
  const { data, isLoading, mutate } = useSWR(
    type ? `/settings/services?type=${type}` : null,
    (url) => {
      if (!url || !type) return null;
      return getServices(type).then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};


export const useTransactions = () => {
  const { data, isLoading, mutate } = useSWR(
    '/payments/get-transactions',
    () => {
      return TransactionList().then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};


export const useFees = () => {
  const { data, isLoading, mutate } = useSWR(
    `/settings/fees/`,
    () => {
      return getFees().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useAdminProfile = () => {
  const { data, isLoading, mutate } = useSWR(
    `/accounts/profile/`,
    () => {
      return getProfile().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useAllTeamsCount = (countStatus: string = '0') => {
  const { data, isLoading, mutate } = useSWR(
    `/accounts/admin-user?component=${countStatus}`,
    () => {
      return getTeamsCount(countStatus).then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};

export const useDashboardOperators = () => {
  const { data, isLoading, mutate } = useSWR(
    `/towings/get-dashboard-ops/`,
    () => {
      return getDashboardOperators().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};


export const useRemittedRevenue = () => {
  const { data, isLoading, mutate } = useSWR(
    `/towings/get-dashboard-ops/`,
    () => {
      return getRemittedRevenue().then((res) => {
        return res?.data;
      });
    },

    {
      revalidateOnFocus: false,
    },
  );

  return { data, isLoading, mutate };
};
