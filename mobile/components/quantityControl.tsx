import { colors, fontSize, spacing } from "@/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface QunatityControlProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

export function QuantityControl({ quantity, onIncrement, onDecrement }: QunatityControlProps) {
    return (
        <View style={styles.container}>
            <Pressable style={[styles.button, quantity <= 1 && { opacity: 0.3 }]} onPress={onDecrement}>
                <Text style={styles.buttonText}>-</Text>
            </Pressable>

            <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{quantity}</Text>
            </View>

            <Pressable style={styles.button} onPress={onIncrement}>
                <Text style={styles.buttonText}>+</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm
    },
    button: {
        borderRadius: 8,
        backgroundColor: colors.red,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
    },
    quantityContainer: {
        minWidth: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
    },
    buttonText: {
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: "bold"
    },
    quantityText: {
        color: colors.primary,
        fontSize: fontSize.xl,
        fontWeight: "bold"
    }
})