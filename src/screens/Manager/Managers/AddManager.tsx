import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Pressable,
    Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { api } from "../../../services/api";
import { Toast } from "../../../components/Toast";
import { Header } from "../../../components/Header";
import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { ManagerDTO } from "../../../dtos/ManagerDTO";

type ManagersStackParamList = {
    ManagersList: undefined;
    AddManager: undefined;
    EditManager: { ges_codigo: number };
};

export function AddManager() {
    const navigation =
        useNavigation<NativeStackNavigationProp<ManagersStackParamList>>();

    const fontLoaded = useRighteousFont();

    const [manager, setManager] = useState<Partial<ManagerDTO>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{
        visible: boolean;
        title: string;
        status: "info" | "error" | "success";
        message: string;
    }>({ visible: false, title: "", status: "info", message: "" });

    const [statusModalVisible, setStatusModalVisible] = useState(false);

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
                setToast({ visible: false, title: "", status: "info", message: "" });
        }, 3000);
    }

    async function handleSave() {
        if (!manager.ges_nome || !manager.ges_email || !manager.ges_senha) {
            showToast("Campos faltando!", "error", "Nome e e-mail são obrigatórios!");
            return;
        }

        try {
            setIsSaving(true);

            await api.post("/managers", {
                ges_nome: manager.ges_nome,
                ges_email: manager.ges_email,
                ges_senha: manager.ges_senha,
                ges_status: manager.ges_status || "ativo",
            });

            showToast("Gestor criado!", "success", "O gestor foi adicionado com sucesso!");
            await new Promise((res) => setTimeout(res, 1000));
            navigation.navigate("ManagersList");
        } catch (error) {
            console.log(error);
            showToast(
                "Erro inesperado",
                "error",
                "Ocorreu um erro ao adicionar o gestor!"
            );
        } finally {
            if (mountedRef.current) setIsSaving(false);
        }
    }

    if (!fontLoaded) return null;

    return (
        <View style={{ flex: 1 }}>
            <Header title="Adicionar Gestor" backButton />
            {toast.visible && <Toast title={toast.title} status={toast.status} message={toast.message} />}

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={manager.ges_nome || ""}
                    onChangeText={(t) => setManager({ ...manager, ges_nome: t })}
                />

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={manager.ges_email || ""}
                    onChangeText={(t) => setManager({ ...manager, ges_email: t })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    value={manager.ges_senha || ""}
                    onChangeText={(t) => setManager({ ...manager, ges_senha: t })}
                    keyboardType="visible-password"
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Status</Text>

                <Pressable
                    style={styles.picker}
                    onPress={() => setStatusModalVisible(true)}
                >
                    <Text style={{ color: manager.ges_status?.toLocaleLowerCase() ? "#000" : "#aaa", fontFamily: "Righteous" }}>
                        {manager.ges_status?.toUpperCase() || "Selecionar status"}
                    </Text>
                </Pressable>

                <Modal
                    transparent
                    visible={statusModalVisible}
                    animationType="fade"
                    onRequestClose={() => setStatusModalVisible(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setStatusModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            {["Ativo", "Inativo"].map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setManager({ ...manager, ges_status: status });
                                        setStatusModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalOptionText}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Pressable>
                </Modal>

                <TouchableOpacity
                    style={[styles.button, isSaving && { opacity: 0.6 }]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Criar Gestor</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const COLORS = {
    primary: "#59c173",
    text: "#222",
};

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
    picker: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 8,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000066",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 250,
        paddingVertical: 10,
    },
    modalOption: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    modalOptionText: {
        fontSize: 16,
        fontFamily: "Righteous",
    },
});
