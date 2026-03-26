import { OrderItem } from "@/types";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, spacing } from "@/constants/theme";
import { formatPrice } from "@/utils/format";

interface OrderItemsProps {
    item: OrderItem;
    onRemove: (itemId: string) => Promise<void>;
}

export function OrderItems({ item, onRemove }: OrderItemsProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.productName}>{item.product?.name}</Text>
                <Text style={styles.productAmount}>{item.amount}x {formatPrice(Number(item.product?.price))}</Text>
            </View>

            <Pressable style={styles.deleteButton} onPress={() => onRemove(item.id)}>
                <Ionicons name="trash" size={18} color={colors.red} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundInput,
        borderRadius: 8,
        padding: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: colors.borderColor
    },
    content: {
        flex: 1
    },
    productName: {
        color: colors.primary,
        fontSize: fontSize.lg,
        marginBottom: 4
    },
    productAmount: {
        color: colors.gray,
        fontSize: fontSize.md,
    },
    deleteButton: {
        padding: spacing.sm,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.borderColor
    }
})