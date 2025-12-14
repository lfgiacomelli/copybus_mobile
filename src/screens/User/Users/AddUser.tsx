import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { api } from "../../../services/api";
import { Toast } from "../../../components/Toast";
import { Header } from "../../../components/Header";
import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { UserDTO } from "../../../dtos/UserDTO";
import { useAuth } from "../../../hooks/useAuth";

type UsersStackParamList = {
    UsersList: undefined;
    AddUser: undefined;
    EditUser: { usu_codigo: number };
};

const COLORS = {
    primary: "#0078ff",
    text: "#222",
};

export function AddUser() {
    const navigation =
        useNavigation<NativeStackNavigationProp<UsersStackParamList>>();

    const { user } = useAuth();
    const loggedUser = user as UserDTO & { type: "user" };
    const emp_codigo = loggedUser?.emp_codigo;

    const fontLoaded = useRighteousFont();

    const [newUser, setNewUser] = useState<
        Partial<UserDTO & { usu_senha?: string }>
    >({});
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{
        visible: boolean;
        title: string;
        status: "info" | "error" | "success";
        message: string;
    }>({ visible: false, title: "", status: "info", message: "" });

    const mountedRef = useRef(true);
    const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    }, []);

    function showToast(
        title: string,
        status: "info" | "error" | "success",
        message: string
    ) {
        if (!mountedRef.current) return;

        setToast({ visible: true, title, status, message });

        toastTimerRef.current = setTimeout(() => {
            if (mountedRef.current)
                setToast({
                    visible: false,
                    title: "",
                    status: "info",
                    message: "",
                });
        }, 3000);
    }

    async function handleSave() {
        if (!newUser.usu_nome || !newUser.usu_email || !newUser.usu_senha) {
            showToast(
                "Campos obrigatórios",
                "error",
                "Nome, e-mail e senha são obrigatórios!"
            );
            return;
        }

        try {
            setIsSaving(true);

            await api.post("/users", {
                usu_nome: newUser.usu_nome,
                usu_email: newUser.usu_email,
                usu_senha: newUser.usu_senha,
                emp_codigo,
            });

            showToast(
                "Usuário criado!",
                "success",
                "O usuário foi adicionado com sucesso!"
            );

            await new Promise((res) => setTimeout(res, 1000));
            navigation.navigate("UsersList");
        } catch (error) {
            console.log(error);
            showToast(
                "Erro inesperado",
                "error",
                "Ocorreu um erro ao adicionar o usuário!"
            );
        } finally {
            if (mountedRef.current) setIsSaving(false);
        }
    }

    if (!fontLoaded) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Adicionar Usuário" backButton />
            {toast.visible && (
                <Toast
                    title={toast.title}
                    status={toast.status}
                    message={toast.message}
                />
            )}

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={newUser.usu_nome || ""}
                    onChangeText={(t) =>
                        setNewUser({ ...newUser, usu_nome: t })
                    }
                />

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={newUser.usu_email || ""}
                    onChangeText={(t) =>
                        setNewUser({ ...newUser, usu_email: t })
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    value={newUser.usu_senha || ""}
                    onChangeText={(t) =>
                        setNewUser({ ...newUser, usu_senha: t })
                    }
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={[styles.button, isSaving && { opacity: 0.6 }]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Criar Usuário</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontFamily: "Righteous",
        fontSize: 14,
        marginTop: 18,
        marginBottom: 6,
        color: COLORS.text,
    },
    input: {
        fontFamily: "Righteous",
        fontSize: 15,
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        backgroundColor: "#e6e6e6ff",
    },
    button: {
        marginTop: 30,
        backgroundColor: COLORS.primary,
        height: 52,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    buttonText: {
        fontFamily: "Righteous",
        fontSize: 16,
        color: "#fff",
    },
});
