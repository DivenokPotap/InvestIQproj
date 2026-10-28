import { useAuth } from "@/redux/Auth/useAuh"
import { Navigate } from "react-router";


export const RestrictedRoute = ({component, navigateTo="/"}) => {
    const { isLoggedIn, isRefreshing } = useAuth()

    if (isRefreshing) {
        <div>...Loading...</div>
    }

    return isLoggedIn ? <Navigate to={navigateTo}/> : component
}