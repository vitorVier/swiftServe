import { cookies } from "next/headers";
import { apiClient } from "./api";
import { User } from "./types";
import { redirect } from "next/navigation";

// get token from cookie
const COOKIE_NAME = "restaurant_token"

export async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function setToken(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: true,
        secure: process.env.NODE_ENV === "production"
    })
}

export async function removeToken() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getUser(): Promise<User | null> {
    // Devolve detalhes do usuário logado, caso o usuário não estiver logado ou o token for inválido, devolve nulo
    try {
        const token = await getToken();
        if (!token) return null;

        const user = await apiClient<User>("/me", { token: token })

        return user;
    } catch (err) {
        // console.error(err)
        return null;
    }
}

export async function requiredAdmin(): Promise<User> { // Se o usuário não estiver logado ou não for admin, redireciona para a página de login ou de acesso negado. Caso contrário, devolve o usuário
    const user = await getUser();
    if (!user) redirect("/login");
    if (user.role !== "ADMIN") redirect("/access-denied");
    return user;
}