import { useQuery } from "@tanstack/react-query";
import { api } from "../services";
import type { Groups, Merchant, Payments } from "../services/resources";

export const useGetAutoFillExpenses = () => {
  return useQuery<{
    stores: Merchant[];
    payments: Payments[];
    groups: Groups[];
  }>({
    queryKey: ["autofill-expenses"],
    queryFn: async () => {
      const [storesResponse, paymentsResponse, groupsResponse] =
        await Promise.all([
          api.getStores({ page: 1, limit: 100 }),
          api.getPayments({ page: 1, limit: 100 }),
          api.getGroups({ page: 1, limit: 100 }),
        ]);

      return {
        stores: storesResponse.data,
        payments: paymentsResponse.data,
        groups: groupsResponse.data,
      };
    },
  });
};
