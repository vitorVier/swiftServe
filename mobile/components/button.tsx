import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "secondary";
    loading?: boolean;
}

export function Button({
    title,
    variant = "primary",
    loading = false,
    disabled,
    style,
    ...rest
}: ButtonProps) {
    const backgroundColor = variant === "primary" ? colors.green : colors.brand;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                (disabled || loading) && styles.buttonDisabled,
                { backgroundColor },
                style,
            ]}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator color={colors.background} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.brand,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    text: {
        color: colors.background,
        fontSize: fontSize.lg,
        fontWeight: "bold"
    }
})