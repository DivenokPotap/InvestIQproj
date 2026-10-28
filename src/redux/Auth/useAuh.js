import { getToken } from "@/services/api";
import { useSelector } from "react-redux"
import { useGetCurrentQuery } from "./authApi";

export const useAuth = () => {
    const reduxToken = useSelector((state) => state.auth.token);
    const localToken = getToken()

    const token = reduxToken || localToken

    const {
        data: user,
        isLoading,
        isFetching,
        isError
    } = useGetCurrentQuery(undefined, {
        skip: !token,
    });

    return {
        user,
        isLoggedIn: !!token && !!user,
        isRefreshing: !!token && ( isLoading || isFetching),
        isError,
    };
};