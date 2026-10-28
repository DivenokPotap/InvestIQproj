import { useAuth } from "@/redux/Auth/useAuh"
import { Navigate } from "react-router";


export const PrivateRoute = ({component, navigateTo="/"}) => {
    const { isLoggedIn } = useAuth()
    
    const shouldRedirect = !isLoggedIn;

    return shouldRedirect ? <Navigate to={navigateTo}/> : component
}