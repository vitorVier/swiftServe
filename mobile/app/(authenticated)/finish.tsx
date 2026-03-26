import { Button } from "@/components/button";
import { Input } from "@/components/inputs";
import { colors, fontSize, spacing } from "@/constants/theme";
import api from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Finish() {
    const router = useRouter();

    const { orderId, table } = useLocalSearchParams<{
        orderId: string;
        table: string;
    }>();

    const [customer, setCustomer] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleFinishOrder() {
        setLoading(true);

        try {
            await api.put("/order/send", {
                orderId: orderId,
                name: customer ?? ""
            });

            Alert.alert("Sucesso!", "Pedido enviado para a cozinha.");
            router.dismissAll();
            router.replace("/(authenticated)/dashboard");
        } catch (err: any) {
            console.log(err?.response?.data);
            console.log(orderId)
            Alert.alert("Erro!", "Erro ao enviar pedido.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View>
                        <Text style={styles.text}>Deseja finalizar o pedido?</Text>
                        <Text style={styles.table}>Mesa: {table}</Text>
                    </View>

                    <Input
                        placeholder="Nome do cliente (opcional)"
                        placeholderTextColor={colors.gray}
                        value={customer}
                        onChangeText={setCustomer}
                    />

                    <Button
                        title="Finalizar pedido"
                        onPress={handleFinishOrder}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        gap: spacing.xl
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xl,
        gap: spacing.lg
    },
    text: {
        fontSize: fontSize.xl,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "center"
    },
    table: {
        fontSize: fontSize.xl,
        color: colors.primary,
        fontWeight: "bold",
        textAlign: "center"
    }
})
