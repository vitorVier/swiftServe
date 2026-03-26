import { colors, fontSize, spacing } from "@/constants/theme";
import api from "@/services/api";
import { Category, OrderItem, Product } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Select } from "@/components/select";
import { QuantityControl } from "@/components/quantityControl";
import { Button } from "@/components/button";
import { OrderItems } from "@/components/orderItems";

export default function Order() {
    const { orderId, table } = useLocalSearchParams<{
        orderId: string;
        table: string;
    }>();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [loadingAddItem, setLoadingAddItem] = useState(false);
    const [items, setItems] = useState<OrderItem[]>([]);

    const router = useRouter();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadCategories();
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            loadProducts(selectedCategory);
        } else {
            setProducts([]);
            setSelectedCategory("");
        }
    }, [selectedCategory])

    async function loadCategories() {
        setLoadingCategories(true);

        try {
            const response = await api.get<Category[]>("categories");
            setCategories(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingCategories(false);
        }
    }

    async function loadProducts(categoryId: string) {
        setLoadingProducts(true);

        try {
            const response = await api.get<Product[]>(`category/products`, {
                params: { categoryId: categoryId }
            });
            setProducts(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingProducts(false);
        }
    }

    async function handleAddItem() {
        setLoadingAddItem(true);

        try {
            const response = await api.post<OrderItem>('/order/add', {
                orderId: orderId,
                productId: selectedProduct,
                amount: quantity
            });

            setItems([...items, response.data]);
            setSelectedCategory("");
            setSelectedProduct("");
            setQuantity(1);
            setLoadingAddItem(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingAddItem(false);
        }
    }

    async function handleRemoveItem(itemId: string) {
        try {
            await api.delete('/order/remove', {
                params: { itemId: itemId }
            });

            const updatedItems = items.filter(item => item.id !== itemId);
            setItems(updatedItems);
            Alert.alert("Item removido com sucesso!", "Seu item foi removido do pedido.");
        } catch (err) {
            Alert.alert("Erro!", "Erro ao remover item do pedido.");
        }
    }

    function handleAdvance() {
        if (items.length === 0) return;
        router.push({
            pathname: "/(authenticated)/finish",
            params: { orderId: orderId, table: table }
        })
        console.log(orderId);
        console.log(table);
    }

    if (loadingCategories) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.headerContent}>
                    <Pressable style={styles.closeButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color={colors.primary} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Novo Pedido</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={[styles.scrollContainer, { paddingBottom: items.length > 0 ? 140 : insets.bottom + spacing.xl }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formCard}>
                    <Select
                        label="Categoria"
                        placeholder="Selecione uma categoria"
                        options={categories.map(category => ({
                            label: category.name,
                            value: category.id
                        }))}
                        selectedValue={selectedCategory}
                        onValueChange={setSelectedCategory}
                    />

                    {loadingProducts ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.brand} />
                        </View>
                    ) : (
                        selectedCategory ? (
                            <Select
                                label="Produto"
                                placeholder="Selecione um produto"
                                options={products.map(product => ({
                                    label: product.name,
                                    value: product.id
                                }))}
                                selectedValue={selectedProduct}
                                onValueChange={setSelectedProduct}
                            />
                        ) : null
                    )}
                </View>

                {selectedProduct && (
                    <View style={styles.formCard}>
                        <View style={styles.quantityContainer}>
                            <Text style={styles.quantityTitle}>Quantidade</Text>
                            <QuantityControl
                                quantity={quantity}
                                onIncrement={() => setQuantity((quantity) => quantity + 1)}
                                onDecrement={() => {
                                    if (quantity <= 1) { setQuantity(1); return; }
                                    setQuantity((quantity) => quantity - 1);
                                }}
                            />
                        </View>

                        <Button
                            title="Adicionar item"
                            onPress={handleAddItem}
                            loading={loadingAddItem}
                            variant="secondary"
                        />
                    </View>
                )}

                {items.length > 0 && (
                    <View style={styles.itemsSection}>
                        <Text style={styles.itemsTitle}>Itens do Pedido</Text>

                        <View style={styles.itemsList}>
                            {items.map(item => (
                                <OrderItems
                                    key={item.id}
                                    item={item}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            {items.length > 0 && (
                <View style={[styles.absoluteFooter, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.lg }]}>
                    <Button
                        title="Finalizar pedido"
                        onPress={handleAdvance}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.backgroundInput,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 12
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: "bold",
        color: colors.primary
    },
    closeButton: {
        top: 1,
        padding: spacing.xs,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.borderColor
    },
    scrollContent: {
        flex: 1,
        padding: spacing.lg,
    },
    scrollContainer: {
        gap: spacing.lg,
    },
    formCard: {
        backgroundColor: colors.backgroundInput,
        borderRadius: 16,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.borderColor,
        gap: spacing.sm
    },
    loadingContainer: {
        paddingVertical: spacing.xl,
        justifyContent: "center",
        alignItems: "center"
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        marginBottom: spacing.xs
    },
    quantityTitle: {
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: "600"
    },
    itemsSection: {
        marginTop: spacing.xs,
        gap: spacing.md
    },
    itemsTitle: {
        color: colors.primary,
        fontWeight: "bold",
        fontSize: fontSize.lg,
        marginLeft: spacing.xs
    },
    itemsList: {
        gap: spacing.sm
    },
    absoluteFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.backgroundInput,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.borderColor,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    }
})