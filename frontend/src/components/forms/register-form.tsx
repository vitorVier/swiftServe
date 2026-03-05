"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useActionState, useEffect } from "react";
import { registerUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(registerUser, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.success && state?.redirectTo) { router.replace(state.redirectTo) }
    }, [state, router])

    return (
        <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto shadow-xl transition-all duration-300 hover:border-brand-primary/30">
            <CardHeader className="text-white text-center text-3xl md:text-4xl font-bold">
                <CardTitle className="tracking-tight">Dev<span className="text-brand-primary">Pizza</span></CardTitle>
                <CardDescription className="text-gray-400 text-sm font-normal">
                    Preencha os dados abaixo para criar sua conta
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="space-y-4" action={formAction}>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white font-medium">Nome</Label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                type="text"
                                placeholder="Digite seu nome..."
                                id="name"
                                name="name"
                                required
                                minLength={3}
                                className="text-white bg-app-background/50 border border-app-border pl-10 focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-all rounded-md h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white font-medium">E-mail</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                type="email"
                                placeholder="Digite seu email..."
                                id="email"
                                name="email"
                                required
                                className="text-white bg-app-background/50 border border-app-border pl-10 focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-all rounded-md h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white font-medium">Senha</Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                type="password"
                                placeholder="Digite sua senha..."
                                id="password"
                                name="password"
                                required
                                className="text-white bg-app-background/50 border border-app-border pl-10 focus-visible:ring-1 focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-all rounded-md h-11"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 h-11 rounded-md transition-all active:scale-[0.98] mt-2 group flex items-center justify-center gap-2 font-medium cursor-pointer"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Cadastrando...
                            </>
                        ) : (
                            <>
                                Cadastrar
                                <ArrowRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>

                    <div className="pt-2">
                        <p className="text-center text-sm text-gray-400">
                            Já tem uma conta?{" "}
                            <Link href="/login" className="text-brand-primary font-medium hover:underline hover:text-brand-primary/80 transition-colors">
                                Faça seu login.
                            </Link>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}