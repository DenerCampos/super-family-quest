import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services";
import type { PaginatedRegistrations } from "../services/profile";

export const GET_LAST_REGISTRATION_QUERY_KEY = "get-last-registration";

const ITEMS_PER_PAGE = 5;

export const useGetLastRegistration = (familyGroupId?: string | null) => {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    isFetching,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedRegistrations>({
    queryKey: [GET_LAST_REGISTRATION_QUERY_KEY, familyGroupId ?? null],
    queryFn: ({ pageParam }) =>
      api.getLatestRegistrationsPaginated(
        pageParam as number,
        ITEMS_PER_PAGE,
        familyGroupId,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  const registrations = data?.pages.flatMap((page) => page.data) ?? [];

  const refetchLastRegistration = () =>
    queryClient.invalidateQueries({
      queryKey: [GET_LAST_REGISTRATION_QUERY_KEY],
    });

  return {
    registrations,
    error,
    isFetching,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetchLastRegistration,
  };
};
