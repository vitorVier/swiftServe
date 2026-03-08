import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-app-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-app-card/60 backdrop-blur-md border border-app-border rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Ícone 404 */}
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20 shadow-[0_0_30px_rgba(234,88,12,0.15)]">
                        <FileQuestion className="w-10 h-10 text-brand-primary" />
                    </div>

                    {/* Textos */}
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Página não encontrada
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                            Oops! A página que você está procurando não existe ou foi movida.
                        </p>
                    </div>

                    {/* Caixa de Ajuda */}
                    <div className="w-full bg-app-background/50 border border-app-border/40 rounded-xl p-4 text-sm text-gray-500">
                        Verifique se o endereço da URL está correto ou retorne com segurança para a página inicial do painel.
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col w-full gap-3 pt-4">
                        <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold flex items-center gap-2">
                            <Link href="/dashboard">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para o Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
