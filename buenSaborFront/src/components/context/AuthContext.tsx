import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";
import { UsuarioCliente } from "../../models/Usuario";

export type AuthState = {
    usuario: UsuarioCliente | null;
};

export type AuthContextType = {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
};

export const AuthContext = createContext<AuthContextType>({
    auth: { usuario: null },
    setAuth: () => { }
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // const [auth, setAuth] = useState<AuthState>({ usuario: null });
    const [auth, setAuth] = useState<AuthState>(() => {
        const storedUser = localStorage.getItem('usuario');
        return storedUser ? { usuario: JSON.parse(storedUser) } : { usuario: null };
    });

    useEffect(() => {
        if (auth.usuario) {
            localStorage.setItem('usuario', JSON.stringify(auth.usuario));
        } else {
            localStorage.removeItem('usuario');
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
