"use client"
import { cn } from "@/lib/utils";
import { LogOut, Package, ShoppingCart, Tags } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logOutUser } from "@/actions/auth";

export const menuItems = [
    {
        title: "Pedidos",
        href: "/dashboard",
        icon: ShoppingCart
    },
    {
        title: "Produtos",
        href: "/dashboard/products",
        icon: Package
    },
    {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Tags
    }
];

export function Sidebar({ userName }: { userName: string }) {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-app-border bg-app-sidebar">
            {/* Header */}
            <div className="border-b border-app-border p-6">
                <h2 className="text-xl font-bold text-white">Dev<span className="text-brand-primary">Pizza</span></h2>
                <p className="text-sm text-gray-300 mt-1">Bem-vindo(a), {userName}</p>
            </div>

            {/* Menu */}
            <nav className="flex flex-1 flex-col p-4 space-y-3">
                {menuItems.map(menu => {
                    const Icon = menu.icon;
                    const isActive = pathname === menu.href;

                    return (
                        <Link href={menu.href} key={menu.title} className={cn(
                            "flex items-center font-medium gap-3 px-3 py-3 text-sm rounded-lg transition-colors duration-300",
                            isActive ? 'bg-brand-primary text-white' : 'bg-transparent text-gray-400 border-app-border hover:text-white hover:border-gray-500 hover:bg-white/5'
                        )}>
                            <Icon className="w-5 h-5" />
                            {menu.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-app-border p-4">
                <form action={logOutUser}>
                    <Button
                        type="submit"
                        variant="ghost"
                        className="w-full justify-start gap-3 text-white hover:bg-white/5 hover:text-red-500"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </Button>
                </form>
            </div>
        </aside>
    )
}