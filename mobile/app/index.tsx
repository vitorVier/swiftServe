import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
    const { signed, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        )
    }

    if (signed) {
        return <Redirect href="/(authenticated)/dashboard" />
    } else {
        return <Redirect href="/login" />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
    }
})