import { ReactNode } from "react"


const ProtectedRoute = ({children}:{children: ReactNode}) => {
 if(!document.cookie.includes('accessToken')){
    window.location.href = "/auth"
    return 
 }
 return children
}

export default ProtectedRoute
