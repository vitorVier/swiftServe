import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { Text, View, StyleSheet, Modal, Pressable, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

interface SelectOptions {
    label: string;
    value: string;
}

interface SelectProps {
    options: SelectOptions[];
    label?: string;
    placeholder?: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
}

export function Select({
    options,
    label,
    placeholder = "Selecione",
    selectedValue,
    onValueChange
}: SelectProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedOption = options.find(option => option.value === selectedValue);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <Pressable
                style={styles.selectButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.selectText}>{displayText}</Text>
                <Feather name="chevron-down" size={14} color={colors.primary} />
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label || "Selecione uma opção"}</Text>

                            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Feather name="x" size={16} color={colors.red} />
                            </Pressable>
                        </View>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.optionButton}
                                    onPress={() => {
                                        onValueChange(item.value)
                                        setModalVisible(false)
                                    }}
                                >
                                    <Text style={[styles.optionText, selectedOption?.value === item.value && styles.optionSelected]}>{item.label}</Text>
                                    {selectedOption?.value === item.value && (
                                        <Feather name="check" size={14} color={colors.green} />
                                    )}
                                </Pressable>
                            )}
                        >

                        </FlatList>
                    </View>
                </Pressable>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingBottom: 8
    },
    label: {
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: "600",
        marginLeft: spacing.xs,
        marginBottom: spacing.sm,
        opacity: 0.9,
    },
    selectButton: {
        backgroundColor: colors.backgroundInput || "rgba(255,255,255,0.03)",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        height: 54,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
    },
    selectText: {
        flex: 1,
        color: colors.primary,
        fontSize: fontSize.md,
        fontWeight: "500"
    },
    placeholderText: {
        color: "rgba(255,255,255,0.4)"
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: colors.background,
        width: "100%",
        maxHeight: "75%",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
        paddingBottom: spacing.xl,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)"
    },
    modalTitle: {
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: "bold"
    },
    closeButton: {
        padding: spacing.sm,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 20,
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.03)"
    },
    optionText: {
        color: colors.primary,
        fontSize: fontSize.md,
        opacity: 0.8
    },
    optionSelected: {
        color: colors.brand || colors.green,
        fontWeight: "700",
        opacity: 1
    }
})