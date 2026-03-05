import Link from "next/link";

export default async function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Você não tem permissão para acessar esta página!</h1>
            <Link href="/login" className="text-blue-500 hover:underline">
                Faça login com uma conta de administrador para acessa esta página
            </Link>
        </div>
    )
}