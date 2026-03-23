import { useState } from "react";
import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
    placeholder?: string;
    label?: string;
    error?: string | boolean;
    icon?: keyof typeof Feather.glyphMap;
    containerStyle?: ViewStyle;
}

export function Input({
    label,
    error,
    icon,
    style,
    containerStyle,
    onFocus,
    onBlur,
    ...rest
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    function handleFocus(e: any) {
        setIsFocused(true);
        onFocus?.(e);
    }

    function handleBlur(e: any) {
        setIsFocused(false);
        onBlur?.(e);
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[
                    styles.label,
                    isFocused && { color: colors.brand }
                ]}>
                    {label}
                </Text>
            )}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    !!error && styles.inputError,
                ]}
            >
                {icon && (
                    <Feather
                        name={icon}
                        size={20}
                        color={isFocused ? colors.brand : colors.gray}
                        style={styles.icon}
                    />
                )}

                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={colors.gray}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    textAlignVertical="center"
                    {...rest}
                />
            </View>

            {typeof error === "string" && error !== "" && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: spacing.xs,
    },
    label: {
        color: colors.gray,
        fontSize: fontSize.md,
        marginBottom: spacing.xs,
        fontWeight: "500",
    },
    inputContainer: {
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        borderWidth: 1.5,
        borderColor: colors.borderColor,
    },
    input: {
        flex: 1,
        height: 52, // Altura fixa para evitar saltos
        color: colors.primary,
        fontSize: fontSize.lg,
        paddingVertical: 0, // Garante que o texto não "pule" em diferentes sistemas
    },
    inputFocused: {
        borderColor: colors.brand,
    },
    inputError: {
        borderColor: colors.red,
    },
    icon: {
        marginRight: spacing.sm,
    },
    errorText: {
        color: colors.red,
        fontSize: fontSize.sm,
        marginTop: spacing.xs,
        fontWeight: "400",
    }
})