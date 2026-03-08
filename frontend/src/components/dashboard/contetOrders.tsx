"use client"

import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { CheckCheck, ChefHat, ClipboardList, EyeIcon, RefreshCcw, ShoppingCart, Timer } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ModalOrder } from "./modalOrder";
import { updateOrderStage } from "@/actions/orders";

// ─── Pipeline Types
type PipelineStage = "pending" | "preparing" | "ready";

const STAGE_CONFIG: Record<PipelineStage, { label: string; badgeClass: string }> = {
    pending: { label: "Pendente", badgeClass: "bg-gray-600/40 text-gray-300 border-gray-500/40" },
    preparing: { label: "Em Preparo", badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
    ready: { label: "Pronto p/ Retirada", badgeClass: "bg-green-500/20 text-green-300 border-green-500/40" },
};

// ─── Time Helpers
function getElapsedMinutes(createdAt: string): number {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
}

function formatElapsed(minutes: number): string {
    if (minutes < 1) return "agora mesmo";
    if (minutes === 1) return "há 1 min";
    if (minutes < 60) return `há ${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `há ${h}h ${m}min` : `há ${h}h`;
}

function getTimeBorderClass(createdAt: string): string {
    const mins = getElapsedMinutes(createdAt);
    if (mins < 15) return "border-green-500/60";
    if (mins < 30) return "border-yellow-500/70";
    return "border-red-500/80 shadow-red-900/30";
}

function getTimeBadgeClass(createdAt: string): string {
    const mins = getElapsedMinutes(createdAt);
    if (mins < 15) return "text-green-400";
    if (mins < 30) return "text-yellow-400";
    return "text-red-400 animate-pulse";
}

export default function ContentOrders({ token }: { token: string }) {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [pipeline, setPipeline] = useState<Map<string, PipelineStage>>(new Map());
    const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());
    const [tick, setTick] = useState(0); // Força re-render a cada minuto para buscar atualização
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchOrders = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const res = await apiClient<Order[]>("/orders?draft=false", {
                method: "GET",
                cache: "no-store",
                token: token!
            });

            const pendingOrders = res.filter(order => !order.status);
            setOrders(pendingOrders);

            // Popula a pipeline inicial com os valores do banco
            setPipeline(prev => {
                const nw = new Map(prev);

                pendingOrders.forEach(o => {
                    if (!actionLoading.has(o.id)) {
                        // Garante que se a API não mandar nada, ele fica pending
                        const currentStage = o.stage || "pending";
                        nw.set(o.id, currentStage);
                    }
                });

                return nw;
            });
        } catch (err) {
            console.error(err);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [token]);

    // refresh time display every minute and fetch latest orders periodically
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTick(t => t + 1);
            fetchOrders(false);
        }, 30_000); // Polling a cada 30 segundos
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [fetchOrders]);



    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const calculateOrderTotal = (order: Order) => {
        if (!order.items) return 0;
        return order.items.reduce((total, item) => total + item.product.price * item.amount, 0);
    };

    const getStage = (orderId: string): PipelineStage => pipeline.get(orderId) ?? "pending";

    const setStage = async (orderId: string, stage: PipelineStage) => {
        setActionLoading(prev => new Set(prev).add(orderId));

        try {
            const result = await updateOrderStage(orderId, stage);

            if (result.success) {
                // Se OK na API, atualizamos a visão local imediatamente para evitar recarregamento perceptível
                setPipeline(prev => new Map(prev).set(orderId, stage));
            } else {
                console.error(result.error);
            }
        } finally {
            setActionLoading(prev => { const s = new Set(prev); s.delete(orderId); return s; });
        }
    };

    const handleFinalize = async (orderId: string) => {
        setActionLoading(prev => new Set(prev).add(orderId));
        try {
            await apiClient(`/order/finish`, {
                method: "PUT",
                body: JSON.stringify({ orderId }),
                token: token!,
            });
            setOrders(prev => prev.filter(o => o.id !== orderId));
            setPipeline(prev => { const m = new Map(prev); m.delete(orderId); return m; });
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(prev => { const s = new Set(prev); s.delete(orderId); return s; });
        }
    };

    // suppress lint warning – tick used to trigger re-render for time
    void tick;

    return (
        <div className="space-y-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-app-border/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-brand-primary" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">Pedidos</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                        {orders.length > 0
                            ? `${orders.length} pedido${orders.length > 1 ? "s" : ""} em aberto`
                            : "Nenhum pedido no momento"}
                    </p>
                </div>

                <div className="shrink-0 self-center">
                    <Button
                        onClick={() => fetchOrders()}
                        disabled={loading}
                        className="bg-white text-black hover:text-white hover:bg-brand-primary gap-2"
                    >
                        <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Atualizar
                    </Button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    Menos de 15 min
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                    15 – 30 min
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
                    Atrasado (&gt;30 min)
                </span>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-64 rounded-xl border border-app-border/30 bg-app-card/30 animate-pulse"
                        />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="bg-app-card/50 p-6 rounded-full mb-4">
                        <ClipboardList className="w-12 h-12 text-gray-600" />
                    </div>
                    <p className="text-gray-400 text-lg font-medium">Nenhum pedido em aberto.</p>
                    <p className="text-gray-600 text-sm mt-1">Os pedidos aparecem aqui quando enviados pela cozinha.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {orders.map((order) => {
                        const stage = getStage(order.id);
                        const config = STAGE_CONFIG[stage];
                        const elapsed = getElapsedMinutes(order.createdAt);
                        const isOverdue = elapsed >= 30;
                        const isLoading = actionLoading.has(order.id);

                        return (
                            <Card
                                key={order.id}
                                className={cn(
                                    "flex flex-col bg-app-card/30 backdrop-blur-sm text-white border-2 transition-all duration-500 shadow-lg",
                                    getTimeBorderClass(order.createdAt),
                                    isOverdue && "shadow-red-900/20"
                                )}
                            >
                                <CardHeader className="pb-3">
                                    {/* Header: Table + Badge row */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Mesa</p>
                                            <CardTitle className="text-2xl font-black text-white">
                                                {order.table}
                                            </CardTitle>

                                            {order.name && (
                                                <p className="text-xs text-gray-400 mt-0.5">Cliente: {order.name}</p>
                                            )}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn("text-xs font-semibold border rounded-full px-2.5 shrink-0", config.badgeClass)}
                                        >
                                            {config.label}
                                        </Badge>
                                    </div>

                                    {/* Timer */}
                                    <div className={cn("flex items-center gap-1 text-xs font-medium mt-1", getTimeBadgeClass(order.createdAt))}>
                                        <Timer className="w-3 h-3" />
                                        {formatElapsed(elapsed)}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex flex-col flex-1 gap-4">
                                    {/* Items list */}
                                    <div className="bg-app-background/40 rounded-lg p-3 space-y-1.5 flex-1 max-h-36 overflow-y-auto">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between gap-2">
                                                    <p className="text-xs text-gray-300 truncate">
                                                        {item.product.name}
                                                    </p>
                                                    <span className="shrink-0 text-xs font-bold text-brand-primary bg-brand-primary/10 rounded px-1.5 py-0.5">
                                                        x{item.amount}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-600">Sem itens</p>
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between border-t border-app-border/30 pt-3">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total</p>
                                        <p className="text-base font-black text-brand-primary">
                                            {formatPrice(calculateOrderTotal(order))}
                                        </p>
                                    </div>

                                    {/* Pipeline Actions */}
                                    <div className="space-y-2 flex flex-wrap justify-between gap-3">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="flex-1 text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-app-border/40 transition-all gap-2"
                                            onClick={() => setSelectedOrder(order.id)}
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                            Detalhes
                                        </Button>

                                        {stage === "pending" && (
                                            <Button
                                                size="sm"
                                                className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2"
                                                onClick={() => setStage(order.id, "preparing")}
                                                disabled={isLoading}
                                            >
                                                <ChefHat className="w-4 h-4" />
                                                Aceitar
                                            </Button>
                                        )}

                                        {stage === "preparing" && (
                                            <Button
                                                size="sm"
                                                className="flex-1 w-full bg-green-600 hover:bg-green-700 text-white font-semibold gap-2"
                                                onClick={() => setStage(order.id, "ready")}
                                                disabled={isLoading}
                                            >
                                                <CheckCheck className="w-4 h-4" />
                                                Concluir
                                            </Button>
                                        )}

                                        {stage === "ready" && (
                                            <Button
                                                size="sm"
                                                className="flex-1 w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold gap-2"
                                                onClick={() => handleFinalize(order.id)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <RefreshCcw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCheck className="w-4 h-4" />
                                                )}
                                                {isLoading ? "Finalizando..." : "Finalizar"}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <ModalOrder
                orderId={selectedOrder}
                stage={selectedOrder ? getStage(selectedOrder) : undefined}
                onStageChange={async (s) => {
                    if (selectedOrder) await setStage(selectedOrder, s);
                }}
                onClose={async () => {
                    setSelectedOrder(null)
                    await fetchOrders();
                }}
                token={token}
            />
        </div>
    )
}