import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Pressable,
    Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { api } from "../../../services/api";

import { UserDTO } from "../../../dtos/UserDTO";

import { Header } from "../../../components/Header";
import Info from "../../../components/Info";
import { Toast } from "../../../components/Toast";

import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { useAuth } from "../../../hooks/useAuth";


type UsersStackParamList = {
    Users: undefined;
    AddUser: undefined;
    EditUser: { usu_codigo: number };
};


const COLORS = {
    background: "#F7F9FC",
    card: "#FFFFFF",
    primary: "#0340fd",
    text: "#1A1A1A",
    textSecondary: "#767676",
    border: "#E2E8F0",
};

export function Users() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        status: "info" as "success" | "error" | "info",
    });

    const { user } = useAuth();

    const fontsLoaded = useRighteousFont();
    const navigation = useNavigation<NativeStackNavigationProp<UsersStackParamList, "Users">>();


    const savedUser = user as UserDTO & { type: "user" };
    const emp_codigo = savedUser?.emp_codigo;

    const showToast = (status: "success" | "error" | "info", message: string) => {
        setToast({ visible: true, message, status });
        setTimeout(
            () => setToast({ visible: false, message: "", status: "info" }),
            3000
        );
    };
    const handleDelete = (usu_codigo: number) => {
        if (!usu_codigo) return;
        if (users.length == 1) return;
        Alert.alert(
            "Excluir Funcionário?",
            "Tem certeza? Essa ação não poderá ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/users/${usu_codigo}`);
                            showToast("success", "Funcionário excluído com sucesso!");
                            fetchUsers();
                        } catch {
                            showToast("error", "Erro ao excluir funcionário.");
                        }
                    },
                },
            ]
        );
    };

    function renderIfLogged(item: UserDTO) {
        if (user?.type === "user") {
            const userLogged = user as UserDTO & { type: "user" };
            if (userLogged.usu_codigo !== item.usu_codigo) return null;
        }

        return (
            <View style={styles.loggedTag}>
                <Text style={styles.loggedText}>Logado</Text>
            </View>
        );
    }

    function renderDeleteButton(item: UserDTO) {
        if (users.length > 1) {
            if (user?.type === "user") {
                const userLogged = user as UserDTO & { type: "user" };

                if (userLogged?.usu_codigo === item.usu_codigo) {
                    return null;
                }
            }

            return (
                <Pressable
                    style={[styles.iconButton, { backgroundColor: "#FFE5E5" }]}
                    onPress={() => handleDelete(item.usu_codigo)}
                >
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </Pressable>
            );
        }

        return null;
    }

    const fetchUsers = useCallback(async () => {
        if (!emp_codigo) return;

        try {
            setIsLoading(true);
            const res = await api.get(`/users/${emp_codigo}`);
            setUsers(res.data.data || []);
        } catch {
            showToast("error", "Erro ao carregar funcionários.");
        } finally {
            setIsLoading(false);
        }
    }, [emp_codigo]);


    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [fetchUsers])
    );

    const renderItem = ({ item, index }: { item: UserDTO; index: number }) => {
        const fadeAnim = new Animated.Value(0);
        const slideAnim = new Animated.Value(20);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true,
        }).start();

        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true,
        }).start();

        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <View style={{ flex: 1 }}>
                    {renderIfLogged(item)}
                    <Text style={styles.name}>{item.usu_nome || "Funcionário"}</Text>
                    <Text style={styles.subText}>{item.usu_email}</Text>
                    <View style={styles.actions}>
                        <Pressable
                            style={styles.iconButton}
                            onPress={() =>
                                navigation.navigate("EditUser", { usu_codigo: item.usu_codigo })
                            }
                        >
                            <Ionicons name="create-outline" size={22} color={COLORS.primary} />
                        </Pressable>
                        {renderDeleteButton(item)}
                    </View>
                </View>

            </Animated.View>
        );
    };

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            )}

            <Header title={"Funcionários"} />
            {toast.visible && <Toast message={toast.message} />}

            <Info text="Funcionários vinculados à empresa" />

            <FlatList
                data={users}
                onRefresh={fetchUsers}
                refreshing={isLoading}
                renderItem={renderItem}
                keyExtractor={(item) => item.usu_codigo.toString()}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.empty}>
                            <Ionicons
                                name="people-outline"
                                size={70}
                                color={COLORS.textSecondary}
                            />
                            <Text style={styles.emptyText}>
                                Nenhum usuário cadastrado
                            </Text>
                        </View>
                    ) : null
                }
            />
            <Pressable
                style={styles.addButton}
                onPress={() => navigation.navigate("AddUser")}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        minHeight: 100,
        flexDirection: "row",
        alignItems: "center",
    },
    name: {
        fontFamily: "Righteous",
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 4,
    },
    subText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontFamily: "Righteous",
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.background + "AA",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    loadingText: {
        fontFamily: "Righteous",
        marginTop: 8,
        color: COLORS.textSecondary,
    },
    empty: {
        marginTop: 80,
        alignItems: "center",
        gap: 10,
    },
    emptyText: {
        fontFamily: "Righteous",
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    loggedTag: {
        alignSelf: "flex-start",
        backgroundColor: "#E0F7FA",
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 6,
        marginBottom: 6,
    },
    loggedText: {
        fontSize: 12,
        color: "#0078ff",
        fontFamily: "Righteous",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
    },
    iconButton: {
        backgroundColor: "#E6F0FF",
        padding: 10,
        borderRadius: 10,
    },
    addButton: {
        position: "absolute",
        bottom: 28,
        right: 28,
        width: 60,
        height: 60,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        elevation: 5,
    },
});
