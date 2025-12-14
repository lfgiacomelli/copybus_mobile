import { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
    RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { VehiclesProps } from "../../../types/vehicles";
import { UserDTO } from "../../../dtos/UserDTO";

import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

import { api } from "../../../services/api";

import { Header } from "../../../components/Header";
import { VehicleCardColumn } from "../../../components/VehicleCardColumn";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Toast } from "../../../components/Toast";

export type RootStackParamList = {
    Home: undefined;
    VehicleDetails: {
        vehicle: VehiclesProps;
    };
    EditVehicle: {
        vehicle: VehiclesProps
    },
};

type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "Home"
>;


export function Vehicles() {
    const [vehicles, setVehicles] = useState<VehiclesProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState({ visible: false, message: "", status: "info" });

    const fontLoaded = useRighteousFont();
    const navigation = useNavigation<NavigationProps>();

    const { user } = useAuth();
    const savedUser = user as UserDTO & { type: "user" };

    const emp_codigo = savedUser?.emp_codigo;

    const showToast = (status: "success" | "error" | "info", message: string) => {
        setToast({ visible: true, message, status });
        setTimeout(() => setToast({ visible: false, message: "", status: "info" }), 3000);
    };

    async function fetchVehicles() {
        try {
            setError(null);
            const response = await api.get(`/vehicles/${emp_codigo}`);

            if (response.data && response.data.data) {
                const vehiclesData = response.data.data;
                setVehicles(vehiclesData);
            } else {
                setError("Formato de dados inválido da API");
                setVehicles([]);
            }
        } catch (error) {
            showToast("error", "Erro ao carregar veículos.");

            setVehicles([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchVehicles();
    };

    const handleVehiclePress = (vehicle: VehiclesProps) => {
        console.log("Veículo selecionado:", vehicle.vei_modelo);

        navigation.navigate("VehicleDetails", { vehicle });
    };


    useEffect(() => {
        if (!emp_codigo) return;
        fetchVehicles();
    }, [emp_codigo]);

    if (!fontLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={["#0078ff", "#0058cc"]}
                    style={StyleSheet.absoluteFill}
                />
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Header title="Veículos" bgColor="#0078ff" />
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color="#0078ff" />
                    <Text style={styles.loadingMessage}>Carregando veículos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Veículos" bgColor="#0078ff" />
            {toast.visible && <Toast message={toast.message} />}

            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#0078ff"]}
                        tintColor="#0078ff"
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={["#0078ff", "#0058cc"]}
                    style={styles.summaryCard}
                >
                    <View style={styles.summaryContent}>
                        <Text style={styles.summaryTitle}>Resumo da Frota</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{vehicles.length}</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {vehicles.filter(v => v.vei_status === 'ativo').length}
                                </Text>
                                <Text style={styles.statLabel}>Ativos</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {vehicles.filter(v => v.vei_status === 'manutencao').length}
                                </Text>
                                <Text style={styles.statLabel}>Manutenção</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Seção de Veículos */}
                <View style={styles.content}>
                    <View style={styles.headerSection}>
                        <Text style={styles.sectionTitle}>
                            Frota Completa
                        </Text>
                        <Text style={styles.sectionSubtitle}>
                            {vehicles.length} veículos registrados
                        </Text>
                    </View>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <Text
                                style={styles.retryButton}
                                onPress={fetchVehicles}
                            >
                                Tentar novamente
                            </Text>
                        </View>
                    ) : vehicles.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>🚌</Text>
                            <Text style={styles.emptyTitle}>Nenhum veículo encontrado</Text>
                            <Text style={styles.emptySubtitle}>
                                Cadastre um novo veículo para começar
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.vehiclesList}>
                            {vehicles.map((vehicle, index) => (
                                <View key={vehicle.vei_codigo || index} style={styles.vehicleCardWrapper}>
                                    <VehicleCardColumn
                                        vehicle={vehicle}
                                        onPress={() => handleVehiclePress(vehicle)}
                                    />
                                    {index < vehicles.length - 1 && <View style={styles.cardSeparator} />}
                                </View>
                            ))}
                        </View>
                    )}

                    {vehicles.length > 0 && (
                        <View style={styles.extraStats}>
                            <Text style={styles.extraStatsTitle}>Médias da Frota</Text>
                            <View style={styles.extraStatsGrid}>
                                <View style={styles.extraStat}>
                                    <Text style={styles.extraStatIcon}>📅</Text>
                                    <Text style={styles.extraStatValue}>
                                        {Math.round(vehicles.reduce((acc, v) => acc + v.vei_ano, 0) / vehicles.length)}
                                    </Text>
                                    <Text style={styles.extraStatLabel}>Ano Médio</Text>
                                </View>
                                <View style={styles.extraStat}>
                                    <Text style={styles.extraStatIcon}>📏</Text>
                                    <Text style={styles.extraStatValue}>
                                        {Math.round(vehicles.reduce((acc, v) => acc + v.vei_odometro, 0) / vehicles.length).toLocaleString('pt-BR')} km
                                    </Text>
                                    <Text style={styles.extraStatLabel}>Odômetro Médio</Text>
                                </View>
                                <View style={styles.extraStat}>
                                    <Text style={styles.extraStatIcon}>👥</Text>
                                    <Text style={styles.extraStatValue}>
                                        {vehicles.filter(v => v.vei_status === 'ativo').length}/{vehicles.length}
                                    </Text>
                                    <Text style={styles.extraStatLabel}>Disponibilidade</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {vehicles.length} veículos • Última atualização: agora
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        color: "#FFFFFF",
        marginTop: 12,
        fontSize: 16,
        fontFamily: "Righteous",
    },

    loadingContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },

    loadingMessage: {
        marginTop: 16,
        fontSize: 16,
        color: "#6B7280",
        fontFamily: "Righteous",
    },

    container: {
        flex: 1,
    },

    summaryCard: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#0078ff",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    summaryContent: {
        alignItems: "center",
    },

    summaryTitle: {
        fontFamily: "Righteous",
        fontSize: 18,
        color: "#FFFFFF",
        marginBottom: 16,
        letterSpacing: 0.5,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
    },

    statItem: {
        alignItems: "center",
        minWidth: 70,
    },

    statNumber: {
        fontFamily: "Righteous",
        fontSize: 28,
        color: "#FFFFFF",
        marginBottom: 4,
    },

    statLabel: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.9)",
        fontFamily: "Righteous",
        letterSpacing: 0.5,
    },

    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },

    content: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 16,
    },

    headerSection: {
        marginBottom: 20,
    },

    sectionTitle: {
        fontFamily: "Righteous",
        fontSize: 22,
        color: "#111827",
        letterSpacing: 0.5,
    },

    sectionSubtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 4,
        fontWeight: "500",
    },

    errorContainer: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.2)",
        alignItems: "center",
        marginTop: 20,
    },

    errorText: {
        color: "#DC2626",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 12,
        fontFamily: "Righteous",
    },

    retryButton: {
        color: "#DC2626",
        fontSize: 14,
        fontFamily: "Righteous",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#DC2626",
        borderRadius: 8,
    },

    emptyContainer: {
        backgroundColor: "#FFFFFF",
        padding: 40,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.05)",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginTop: 20,
    },

    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },

    emptyTitle: {
        fontFamily: "Righteous",
        fontSize: 18,
        color: "#111827",
        marginBottom: 8,
        textAlign: "center",
    },

    emptySubtitle: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 20,
    },

    vehiclesList: {
        marginTop: 8,
    },

    vehicleCardWrapper: {
        marginBottom: 12,
    },

    cardSeparator: {
        height: 8,
    },

    extraStats: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.05)",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    extraStatsTitle: {
        fontFamily: "Righteous",
        fontSize: 16,
        color: "#111827",
        marginBottom: 16,
        textAlign: "center",
    },

    extraStatsGrid: {
        flexDirection: "row",
        justifyContent: "space-around",
    },

    extraStat: {
        alignItems: "center",
        minWidth: 90,
    },

    extraStatIcon: {
        fontSize: 20,
        marginBottom: 8,
    },

    extraStatValue: {
        fontFamily: "Righteous",
        fontSize: 14,
        color: "#0078ff",
        marginBottom: 4,
        textAlign: "center",
    },

    extraStatLabel: {
        fontSize: 11,
        color: "#6B7280",
        textAlign: "center",
        fontFamily: "Righteous",

    },

    footer: {
        padding: 20,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.05)",
        marginTop: 8,
    },

    footerText: {
        fontSize: 12,
        color: "#9CA3AF",
        fontFamily: "Righteous",
    },
});