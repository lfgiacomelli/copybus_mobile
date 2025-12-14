import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Platform,
    StatusBar as RNStatusBar,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { api } from "../../../services/api";
import { Toast } from "../../../components/Toast";
import { Header } from "../../../components/Header";
import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { UserDTO } from "../../../dtos/UserDTO";

type UsersStackParamList = {
    UsersList: undefined;
    EditUser: { usu_codigo: number };
};

type EditUserRouteProp = RouteProp<UsersStackParamList, "EditUser">;

const PRIMARY_COLOR = "#0078ff";

export function EditUser() {
    const navigation =
        useNavigation<NativeStackNavigationProp<UsersStackParamList>>();
    const route = useRoute<EditUserRouteProp>();
    const { usu_codigo } = route.params;

    const fontLoaded = useRighteousFont();

    const [user, setUser] = useState<UserDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: "",
    });

    const mountedRef = useRef(true);
    const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    }, []);

    const fetchUser = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/users/user/${usu_codigo}`);
            const data = response.data?.data ?? response.data;
            if (mountedRef.current) setUser(data);
        } catch {
            if (mountedRef.current) {
                setToast({
                    visible: true,
                    message: "Erro ao carregar usuário",
                });
            }
        } finally {
            if (mountedRef.current) setIsLoading(false);
        }
    }, [usu_codigo]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleUpdate = useCallback(async () => {
        if (!user) return;

        try {
            setIsUpdating(true);
            const payload = {
                usu_nome: user.usu_nome,
                usu_email: user.usu_email,
            };

            await api.put(`/users/${usu_codigo}`, payload);

            if (mountedRef.current) {
                setToast({
                    visible: true,
                    message: "Usuário atualizado com sucesso!",
                });

                toastTimerRef.current = setTimeout(() => {
                    if (mountedRef.current) {
                        setToast({ visible: false, message: "" });
                        navigation.navigate("UsersList");
                    }
                }, 2000);
            }
        } catch {
            if (mountedRef.current) {
                setToast({
                    visible: true,
                    message: "Erro ao atualizar usuário",
                });

                toastTimerRef.current = setTimeout(() => {
                    if (mountedRef.current)
                        setToast({ visible: false, message: "" });
                }, 3000);
            }
        } finally {
            if (mountedRef.current) setIsUpdating(false);
        }
    }, [user, usu_codigo, navigation]);

    if (!fontLoaded) return null;

    if (isLoading || !user) {
        return (
            <View style={{ flex: 1 }}>
                {toast.visible && <Toast message={toast.message} />}
                <Header title="Editar Usuário" backButton />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    <Text style={styles.loadingText}>
                        Carregando usuário...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {toast.visible && <Toast message={toast.message} />}
            <Header title="Editar Usuário" backButton />

            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={user.usu_nome ?? ""}
                    onChangeText={(text) =>
                        setUser((prev) =>
                            prev ? { ...prev, usu_nome: text } : prev
                        )
                    }
                    autoCapitalize="words"
                />

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={user.usu_email}
                    onChangeText={(text) =>
                        setUser((prev) =>
                            prev ? { ...prev, usu_email: text } : prev
                        )
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        isUpdating && { opacity: 0.7 },
                    ]}
                    onPress={handleUpdate}
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Atualizar Usuário
                        </Text>
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
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop:
            Platform.OS === "android"
                ? RNStatusBar.currentHeight ?? 0
                : 0,
    },
    loadingText: {
        marginTop: 12,
        fontFamily: "Righteous",
    },
    label: {
        fontFamily: "Righteous",
        fontSize: 14,
        marginTop: 18,
        marginBottom: 6,
        color: "#222",
    },
    input: {
        fontFamily: "Righteous",
        fontSize: 15,
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: PRIMARY_COLOR,
    },
    button: {
        marginTop: 30,
        backgroundColor: PRIMARY_COLOR,
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
