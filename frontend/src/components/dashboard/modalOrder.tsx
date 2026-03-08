"use client";

import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { formatPrice } from "@/lib/format";
import { Button } from "../ui/button";
import { finishOrder } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
    ChefHat,
    CheckCheck,
    RefreshCcw,
    UtensilsCrossed,
    User,
    Hash,
    ShoppingBag,
    X,
} from "lucide-react";

// ─── Pipeline Types (espelhando contetOrders.tsx)
type PipelineStage = "pending" | "preparing" | "ready";

const STAGE_CONFIG: Record<PipelineStage, {
    label: string;
    badgeClass: string;
    actionLabel: string;
    actionClass: string;
    ActionIcon: React.ElementType;
    next: PipelineStage | null;
}> = {
    pending: {
        label: "Pendente",
        badgeClass: "bg-gray-600/40 text-gray-300 border-gray-500/40",
        actionLabel: "Aceitar pedido",
        actionClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20",
        ActionIcon: ChefHat,
        next: "preparing",
    },
    preparing: {
        label: "Em Preparo",
        badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        actionLabel: "Concluir preparo",
        actionClass: "bg-green-600 hover:bg-green-700 text-white shadow-emerald-900/20",
        ActionIcon: CheckCheck,
        next: "ready",
    },
    ready: {
        label: "Pronto p/ Retirada",
        badgeClass: "bg-green-500/20 text-green-300 border-green-500/40",
        actionLabel: "Finalizar pedido",
        actionClass: "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-brand-primary/20",
        ActionIcon: CheckCheck,
        next: null,
    },
};

interface ModalOrderProps {
    orderId: string | null;
    stage?: PipelineStage;
    onStageChange?: (stage: PipelineStage) => void;
    onClose: () => Promise<void>;
    token: string;
}

export function ModalOrder({ orderId, stage = "pending", onStageChange, onClose, token }: ModalOrderProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const router = useRouter();

    const fetchOrder = async () => {
        if (!orderId) return setOrder(null);
        try {
            setLoading(true);
            const res = await apiClient<Order>(`/order/details?orderId=${orderId}`, {
                method: "GET",
                cache: "no-store",
                token: token!,
            });
            setOrder(res);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrder(); }, [orderId]);

    const calculateTotal = () => {
        if (!order?.items) return 0;
        return order.items.reduce((total, item) => total + item.product.price * item.amount, 0);
    };

    // Stage é controlado pelo pai (contetOrders pipeline Map)
    const config = STAGE_CONFIG[stage];
    const { ActionIcon } = config;

    // Pipeline: avança o estágio ou, no último, finaliza via API
    const handleAction = async () => {
        if (!orderId) return;
        if (config.next) {
            // Propaga a mudança de estágio ao pai para sincronizar card e modal
            onStageChange?.(config.next);
        } else {
            // Último estágio → chama a API de finalização
            setActionLoading(true);
            try {
                const result = await finishOrder(orderId);
                if (result.success) {
                    await onClose();
                    router.refresh();
                } else {
                    console.error(result.error);
                }
            } finally {
                setActionLoading(false);
            }
        }
    };

    return (
        <Dialog open={!!orderId} onOpenChange={() => onClose()}>
            <DialogContent className="p-0 bg-app-card border border-app-border/60 text-white max-w-lg w-full overflow-hidden rounded-2xl shadow-2xl">

                {/* ── Header ── */}
                <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-app-border/40 bg-app-background/40">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-brand-primary/15 border border-brand-primary/20">
                                <UtensilsCrossed className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-white leading-tight">Detalhes do pedido</DialogTitle>
                                <DialogDescription className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    {orderId?.slice(-8).toUpperCase()}
                                </DialogDescription>
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className={cn("text-xs font-semibold border rounded-full px-3 py-1 shrink-0", config.badgeClass)}
                        >
                            {config.label}
                        </Badge>
                    </div>
                </DialogHeader>

                {/* ── Body ── */}
                <div className="px-6 py-5 space-y-5">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="grid grid-cols-2 gap-3">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-xl bg-app-background/60" />
                                ))}
                            </div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 rounded-xl bg-app-background/60" />
                            ))}
                        </div>
                    ) : order ? (
                        <>
                            {/* Info cards: Mesa + Cliente */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-app-background/60 border border-app-border/40 px-4 py-3 flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-brand-primary/10">
                                        <UtensilsCrossed className="w-4 h-4 text-brand-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Mesa</p>
                                        <p className="text-base font-bold text-white">{order.table}</p>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-app-background/60 border border-app-border/40 px-4 py-3 flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                                        <User className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Cliente</p>
                                        <p className="text-base font-bold text-white truncate">{order.name || "Sem nome"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Itens */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                        Itens do pedido
                                    </h3>
                                    <span className="ml-auto text-xs bg-app-background/80 border border-app-border/40 text-gray-400 font-medium rounded-full px-2 py-0.5">
                                        {order.items?.length ?? 0}
                                    </span>
                                </div>

                                <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-app-border scrollbar-track-transparent">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item) => {
                                            const subtotal = item.product.price * item.amount;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-3 bg-app-background/50 border border-app-border/30 rounded-xl px-4 py-3 transition-colors hover:border-app-border/60"
                                                >
                                                    {/* Quantidade badge */}
                                                    <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-brand-primary/15 border border-brand-primary/20 text-brand-primary font-bold text-sm">
                                                        {item.amount}
                                                    </span>

                                                    {/* Nome + preço unit */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.product.price)} / un.</p>
                                                    </div>

                                                    {/* Subtotal */}
                                                    <p className="shrink-0 text-sm font-bold text-white">
                                                        {formatPrice(subtotal)}
                                                    </p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 text-center py-6 text-sm">Nenhum item no pedido.</p>
                                    )}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="rounded-xl bg-brand-primary/5 border border-brand-primary/20 px-4 py-3.5 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Total do pedido</span>
                                <span className="text-xl font-black text-brand-primary">
                                    {formatPrice(calculateTotal())}
                                </span>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* ── Footer ── */}
                <DialogFooter className="px-6 pb-6 pt-0 flex gap-3 sm:gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onClose()}
                        disabled={actionLoading}
                        className="flex-1 border-app-border/60 text-gray-300 bg-transparent hover:bg-app-background/60 hover:text-white hover:border-app-border gap-2"
                    >
                        <X className="w-4 h-4" />
                        Fechar
                    </Button>

                    <Button
                        disabled={loading || actionLoading}
                        onClick={handleAction}
                        className={cn("flex-1 font-semibold gap-2 transition-all", config.actionClass)}
                    >
                        {actionLoading ? (
                            <RefreshCcw className="w-4 h-4 animate-spin" />
                        ) : (
                            <ActionIcon className="w-4 h-4" />
                        )}
                        {actionLoading ? "Processando..." : config.actionLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}