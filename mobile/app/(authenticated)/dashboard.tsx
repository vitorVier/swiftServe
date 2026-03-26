import { Button } from "@/components/button";
import { Input } from "@/components/inputs";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { Order } from "@/types";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Dashboard() {
    const { signOut } = useAuth();
    const insets = useSafeAreaInsets();

    const [tableNumber, setTableNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleCreateOrder() {
        if (!tableNumber.trim()) {
            Alert.alert("Atenção", "Preencha o número da mesa para prosseguir!");
            return;
        }

        const table = parseInt(tableNumber);

        if (isNaN(table) || table <= 0) {
            Alert.alert("Atenção", "Número da mesa inválido!");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post<Order>("/order", { table: table });
            router.push({
                pathname: "/(authenticated)/order",
                params: {
                    table: response.data.table.toString(),
                    orderId: response.data.id
                }
            });

            setTableNumber("");
        } catch (err) {
            Alert.alert("Error", "Erro ao criar pedido!")
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={colors.background} />

            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
                        <TouchableOpacity
                            onPress={signOut}
                            style={styles.signOutButton}
                        >
                            <Text style={styles.signOutText}>Sair</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>Swift<Text style={styles.logoBrand}>Serve</Text></Text>
                        </View>

                        <Text style={styles.title}>Novo Pedido</Text>
                        <Input
                            placeholder="Número da mesa"
                            value={tableNumber}
                            onChangeText={setTableNumber}
                            keyboardType="numeric"
                        />
                        <Button style={styles.button} title="Iniciar Pedido" onPress={handleCreateOrder} />
                    </View>
                </ScrollView>

            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardContainer: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.md
    },
    signOutButton: {
        backgroundColor: "rgba(255, 69, 58, 0.15)",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 69, 58, 0.3)",
    },
    signOutText: {
        color: colors.red,
        fontSize: fontSize.sm,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
        marginTop: -40,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 48,
    },
    logoText: {
        fontSize: 40,
        fontWeight: "900",
        color: colors.primary,
        letterSpacing: -1,
    },
    logoBrand: {
        color: colors.brand,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "left",
        marginBottom: spacing.sm,
        opacity: 0.9,
    },
    button: {
        marginTop: spacing.md,
        height: 58,
        borderRadius: 18,
        backgroundColor: colors.brand,
        shadowColor: colors.brand,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    }
})