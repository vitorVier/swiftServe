import api from "@/services/api";
import { LoginResponse, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextData {
    user: User | null;
    signed: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Inicializa como true para o check inicial

    useEffect(() => {
        async function loadStorageData() {
            try {
                const storedToken = await AsyncStorage.getItem("@token:restaurante");
                const storedUser = await AsyncStorage.getItem("@user:restaurante");

                if (storedToken && storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.error("Erro ao carregar dados do storage", err);
            } finally {
                setLoading(false);
            }
        }

        loadStorageData();
    }, []);

    async function signIn(email: string, password: string) {
        setLoading(true);
        try {
            const response = await api.post<LoginResponse>("/session", {
                email: email,
                password: password
            });

            const { token, ...userData } = response.data;

            // Salva no AsyncStorage (em paralelo)
            await Promise.all([
                AsyncStorage.setItem("@token:restaurante", token),
                AsyncStorage.setItem("@user:restaurante", JSON.stringify(userData))
            ]);

            setUser(userData);
        } catch (err) {
            // Não captura o erro aqui para que o componente de Login possa tratar o feedback visual
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function signOut() {
        setLoading(true);
        try {
            await AsyncStorage.clear(); // Limpa tudo de uma vez
            setUser(null);
            api.defaults.headers.common["Authorization"] = "";
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            signed: !!user,
            loading,
            signIn,
            signOut,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider")
    return context;
}
