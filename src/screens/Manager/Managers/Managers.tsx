import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Alert
} from "react-native";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { api } from "../../../services/api";
import { Toast } from "../../../components/Toast";
import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { ManagerDTO } from "../../../dtos/ManagerDTO";
import { Header } from "../../../components/Header";

import { useAuth } from "../../../hooks/useAuth";
import Info from "../../../components/Info";

type ManagerStackParamList = {
    Managers: undefined;
    EditManager: { ges_codigo: number };
    AddManager: undefined;
};

type Props = NativeStackNavigationProp<ManagerStackParamList, "Managers">;

const COLORS = {
    background: "#F7F9FC",
    card: "#FFFFFF",
    primary: "#0340fd",
    text: "#1A1A1A",
    textSecondary: "#767676",
    border: "#E2E8F0",
};

export function Managers() {
    const [managers, setManagers] = useState<ManagerDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "", status: "info" });

    const { user } = useAuth();


    const navigation = useNavigation<Props>();
    const fontsLoaded = useRighteousFont();

    const showToast = (status: "success" | "error" | "info", message: string) => {
        setToast({ visible: true, message, status });
        setTimeout(() => setToast({ visible: false, message: "", status: "info" }), 3000);
    };

    const fetchManagers = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/managers/");
            setManagers(res.data.data || []);
        } catch {
            showToast("error", "Erro ao carregar gestores.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchManagers();
        }, [fetchManagers])
    );

    const handleDelete = (ges_codigo: number) => {
        if (!ges_codigo) return;
        if (managers.length == 1) return;
        Alert.alert(
            "Excluir Gestor",
            "Tem certeza? Essa ação não poderá ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/managers/${ges_codigo}`);
                            showToast("success", "Gestor excluído com sucesso!");
                            fetchManagers();
                        } catch {
                            showToast("error", "Erro ao excluir gestor.");
                        }
                    },
                },
            ]
        );
    };

    function renderDeleteButton(item: ManagerDTO) {
        if (managers.length > 1) {
            if (user?.type === "manager") {
                const managerUser = user as ManagerDTO & { type: "manager" };

                if (managerUser.ges_codigo === item.ges_codigo) {
                    return null;
                }
            }

            return (
                <Pressable
                    style={[styles.iconButton, { backgroundColor: "#FFE5E5" }]}
                    onPress={() => handleDelete(item.ges_codigo)}
                >
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </Pressable>
            );
        }

        return null;
    }

    function renderIfLogged(item: ManagerDTO) {
        if (user?.type === "manager") {
            const managerUser = user as ManagerDTO & { type: "manager" };
            if (managerUser.ges_codigo !== item.ges_codigo) return null;
        }

        return (
            <View style={styles.loggedTag}>
                <Text style={styles.loggedText}>Logado</Text>
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: ManagerDTO; index: number }) => {
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

                    <Text style={styles.name}>{item.ges_nome}</Text>
                    <Text style={styles.subText}>{item.ges_email}</Text>
                    <Text style={styles.subText}>Status: {item.ges_status}</Text>
                </View>

                <View style={styles.actions}>
                    <Pressable
                        style={styles.iconButton}
                        onPress={() =>
                            navigation.navigate("EditManager", { ges_codigo: item.ges_codigo! })
                        }
                    >
                        <Ionicons name="create-outline" size={22} color={COLORS.primary} />
                    </Pressable>
                    {renderDeleteButton(item)}
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
            <Header title="Gestores" />
            {toast.visible && <Toast message={toast.message} />}
            <Info text="Acesso a todos os funcionários da CopyBus" />

            <FlatList
                data={managers}
                onRefresh={fetchManagers}
                refreshing={isLoading}
                renderItem={renderItem}
                keyExtractor={(i) => i.ges_codigo!.toString()}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.empty}>
                            <Ionicons name="person-outline" size={70} color={COLORS.textSecondary} />
                            <Text style={styles.emptyText}>Nenhum gestor cadastrado</Text>
                        </View>
                    ) : null
                }
            />

            <Pressable
                style={styles.addButton}
                onPress={() => navigation.navigate("AddManager")}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        minHeight: 120,
        flexDirection: "row",
        justifyContent: "space-between",
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
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.background + "AA",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    loadingText: { fontFamily: "Righteous", marginTop: 8, color: COLORS.textSecondary },
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
        color: "#00796B",
        fontFamily: "Righteous",
    },
});
