
import { useAuth0 } from "@auth0/auth0-react";

export const LoginAuth0Button = () => {
    const { loginWithPopup } = useAuth0();
    //const { loginWithAuth0 } = useContext(AuthContext);

    return (
        <button className="btn btn-secondary" onClick={() => loginWithPopup()}>Iniciar Sesión</button>
    )
}
