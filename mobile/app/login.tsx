import { Button } from "@/components/button";
import { Input } from "@/components/inputs";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, Platform, Alert } from "react-native";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();
    const router = useRouter();

    async function handleLogin() {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Preencha todos os campos")
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            router.replace("/(authenticated)/dashboard");
        } catch (err: any) {
            if (err.response?.status === 400) {
                Alert.alert("Dados inválidos", "E-mail ou senha incorretos.");
            } else {
                Alert.alert("Erro", "Não foi possível conectar ao servidor. Tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={"padding"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Swift<Text style={styles.logoBrand}>Serve</Text></Text>

                    <Text style={styles.logoSubtitle}>Garçom app</Text>
                </View>

                <View style={styles.formContainer}>
                    <Input
                        label="E-mail"
                        placeholder="Digite seu e-mail..."
                        icon="mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        label="Senha"
                        placeholder="Digite sua senha..."
                        secureTextEntry={true}
                        icon="lock"
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button title="Acessar" loading={loading} onPress={handleLogin} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: "center",
    },
    scrollContent: {
        justifyContent: "center",
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: spacing.xl,
    },
    logoText: {
        fontSize: 34,
        fontWeight: "bold",
        color: colors.primary,
    },
    logoBrand: {
        color: colors.brand
    },
    logoSubtitle: {
        fontSize: fontSize.lg,
        color: colors.primary,
    },
    formContainer: {
        gap: spacing.md,
    }
})