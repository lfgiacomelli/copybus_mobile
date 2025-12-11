import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../../contexts/AuthContext";
import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { Toast } from "../../../components/Toast";
import copyBus from "../../../assets/images/copybus.png";

export default function UserSignIn() {
    const navigation = useNavigation<any>();
    const fontLoaded = useRighteousFont();
    const { signInUser } = useAuth();

    const [toast, setToast] = useState({
        visible: false,
        status: "info" as "info" | "error" | "success",
        title: "",
        message: "",
        onHide: () => { }
    });

    const [usu_email, setEmail] = useState("");
    const [usu_password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function showToast(status: "info" | "error" | "success", title: string, message: string) {
        setToast({
            visible: true,
            status,
            title,
            message,
            onHide: () =>
                setToast({
                    visible: false,
                    status: "info",
                    title: "",
                    message: "",
                    onHide: () => { }
                }),
        });
    }

    async function handleLogin() {
        if (!usu_email || !usu_password) {
            return showToast("info", "Campos faltando!", "Preencha todos os campos!");
        }

        try {
            setIsLoading(true);
            await signInUser(usu_email.trim(), usu_password.trim());
        } catch (error) {
            showToast("error", "Erro inesperado!", "Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    }

    if (!fontLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={32} color="#000" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {toast.visible && (
                <Toast
                    status={toast.status}
                    title={toast.title}
                    message={toast.message}
                    onHide={toast.onHide}
                />
            )}

            <View style={styles.logoArea}>
                <Image source={copyBus} style={styles.logo} resizeMode="contain" />
            </View>

            <Text style={[styles.title, { fontFamily: "Righteous" }]}>
                Acesso do Funcionário
            </Text>

            <Text style={[styles.subtitle]}>
                Gerencie suas tarefas e atividades da empresa!
            </Text>


            <TextInput
                placeholder="E-mail"
                placeholderTextColor="#000"
                value={usu_email}
                onChangeText={setEmail}
                style={[styles.input, { fontFamily: "Righteous" }]}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Senha"
                placeholderTextColor="#000"
                secureTextEntry
                value={usu_password}
                onChangeText={setPassword}
                style={[styles.input, { fontFamily: "Righteous" }]}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} activeOpacity={0.8}>
                {isLoading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={[styles.primaryBtnText, { fontFamily: "Righteous" }]}>
                        Entrar
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkBtn}
                onPress={() => navigation.navigate("ManagerSignIn")}
                activeOpacity={0.6}
            >
                <Text style={[styles.linkText, { fontFamily: "Righteous" }]}>
                    Gestor
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2"
    },

    container: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: "center",
        backgroundColor: "#f2f2f2"
    },

    logoArea: {
        alignItems: "center",
        marginBottom: 10
    },

    logo: {
        width: 230,
        height: 230
    },

    title: {
        fontSize: 28,
        fontWeight: "600",
        color: "#000",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#000",
        fontFamily: "Righteous",
        textAlign: "center",
        marginBottom: 28,
        lineHeight: 20,
    },

    input: {
        width: "100%",
        paddingVertical: 14,
        fontSize: 15,
        borderBottomWidth: 1.5,
        borderBottomColor: "#7ba7ff",
        color: "#000",
        marginBottom: 22,
    },

    primaryBtn: {
        backgroundColor: "#0078FF",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 10,
        shadowColor: "#0078FF",
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },

    primaryBtnText: {
        textAlign: "center",
        fontSize: 18,
        color: "#fff",
    },

    linkBtn: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 12,
        borderColor: "#c0c0c0ff",
        marginTop: 22,
        alignItems: "center",
    },

    linkText: {
        fontSize: 15,
        color: "#007bff",
        textDecorationLine: "underline",
    }
});
