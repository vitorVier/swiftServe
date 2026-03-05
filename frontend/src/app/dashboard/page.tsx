import { requiredAdmin } from "@/lib/auth"

export default async function Dashboard() {
    const user = await requiredAdmin();

    return (
        <div>
            <h1>Bem-vindo {user.name}</h1>
        </div>
    )
}