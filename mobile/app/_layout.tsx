import { colors } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(authenticated)/dashboard" />
      </Stack>
    </AuthProvider>
  )
}