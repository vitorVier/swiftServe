"use client"
import { cn } from "@/lib/utils";
import { LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logOutUser } from "@/actions/auth";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { menuItems } from "./sidebar";

export function MobileSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <header className="sticky top-0 z-50 border-b border-app-border bg-app-card">
                <div className="flex h-16 items-center justify-between px-4">
                    <div className="w-10"></div>

                    <h1 className="text-lg font-bold">
                        Dev<span className="text-brand-primary">Pizza</span>
                    </h1>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-brand-primary/55 hover:text-white rounded-md">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent className="w-72 p-0 bg-app-sidebar border-app-border">
                            <SheetHeader className="border-b border-app-border p-6">
                                <SheetTitle className="text-xl text-white font-bold">Menu</SheetTitle>
                            </SheetHeader>

                            {/* Menu */}
                            <nav className="flex flex-col p-4 space-y-4">
                                {menuItems.map(menu => {
                                    const Icon = menu.icon;
                                    const isActive = pathname === menu.href;

                                    return (
                                        <Link href={menu.href} key={menu.title} className={cn(
                                            "flex items-center font-medium gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-300 text-white",
                                            isActive ? 'bg-brand-primary text-white' : 'bg-transparent text-gray-400 border-app-border hover:text-white hover:border-gray-500 hover:bg-white/5'
                                        )}>
                                            <Icon className="w-5 h-5" />
                                            {menu.title}
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="absolute bottom-0 w-full border-t border-app-border p-4">
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
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
        </div>
    )
}