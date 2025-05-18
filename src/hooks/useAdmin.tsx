import { banksList } from "@/api/banks";
import { getCustomers } from "@/api/customersApi";
import { getOperators, getOperatorData, getAssets, getDrivers } from "@/api/operatorsApi";
import { getTeams } from "@/api/teamsApi";


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
    `/settings/bank-lists`,
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

