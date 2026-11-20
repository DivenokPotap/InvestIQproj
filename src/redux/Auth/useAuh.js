import { useOnAuthChangeQuery } from "./authApi";

export const useAuth = () => {
  const { data: user, isLoading, isFetching, isError } = useOnAuthChangeQuery();

  return {
    user,
    isLoggedIn: !!user,
    isRefreshing: isLoading || isFetching,
    isError,
  };
};
