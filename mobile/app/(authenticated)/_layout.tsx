import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Stack, Redirect } from "expo-router";

export default function AuthenticatedLayout() {
    const { signed, loading } = useAuth();

    if (loading) return null;

    if (!signed) return <Redirect href="/login" />;

    return (
        <Stack screenOptions={{
            headerShown: true,
            headerStyle: {
                backgroundColor: colors.background
            },
            headerTintColor: colors.primary,
            headerTitleStyle: {
                fontWeight: "bold"
            },
            headerShadowVisible: false
        }}>
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        </Stack>
    )
}