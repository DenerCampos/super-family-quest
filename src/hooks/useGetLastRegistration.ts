import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services";

export const GET_LAST_REGISTRATION_QUERY_KEY = "get-last-registration";

export const useGetLastRegistration = () => {
  const { data, error, isFetching, isLoading, isError } = useQuery({
    queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
    queryFn: () => api.getLatestRegistrations(),
  });

  const queryClient = useQueryClient();

  const refetchLastRegistration = () =>
    queryClient.invalidateQueries({
      queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
    });

  return {
    data,
    error,
    isFetching,
    isLoading,
    isError,
    refetchLastRegistration,
  };
};
