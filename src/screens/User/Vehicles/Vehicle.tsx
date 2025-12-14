import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Image,
    SafeAreaView,
    Animated,
    TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";

import { api } from "../../../services/api";
import { VehiclesProps } from "../../../types/vehicles";
import { RootStackParamList } from "./Vehicles";
import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { Header } from "../../../components/Header";
import { Toast } from "../../../components/Toast";

type RouteProps = NativeStackScreenProps<
    RootStackParamList,
    "VehicleDetails"
>["route"];

export function Vehicle() {
    const route = useRoute<RouteProps>();
    const { vehicle } = route.params;

    const [vehicleData, setVehicleData] = useState<VehiclesProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        status: "info" as "success" | "error" | "info"
    });
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.95));

    const fontLoaded = useRighteousFont();

    const showToast = (status: "success" | "error" | "info", message: string) => {
        setToast({ visible: true, message, status });
        setTimeout(() => setToast({ visible: false, message: "", status: "info" }), 3000);
    };

    async function fetchVehicle() {
        try {
            const response = await api.get(`/vehicles/vehicle/${vehicle.vei_codigo}`);

            if (response.data?.data) {
                setVehicleData(response.data.data);
                setError(null);

                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                setError("Nenhum veículo foi encontrado");
                showToast("error", "Nenhum veículo foi encontrado");
            }
        } catch (err) {
            const errorMessage = "Erro ao buscar veículo!";
            setError(errorMessage);
            showToast("error", errorMessage);
            console.log("Erro ao buscar veículo:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchVehicle();
    }, [vehicle.vei_codigo]);

    if (loading || !fontLoaded) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient
                    colors={["#0078ff", "#0056cc"]}
                    style={styles.gradientHeader}
                >
                    <Header
                        title="Detalhes do Veículo"
                        bgColor="transparent"
                        backButton
                    />
                </LinearGradient>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0078ff" />
                    <Text style={styles.loadingText}>Carregando informações...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !vehicleData) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient
                    colors={["#0078ff", "#0056cc"]}
                    style={styles.gradientHeader}
                >
                    <Header
                        title="Detalhes do Veículo"
                        bgColor="transparent"
                        backButton
                    />
                </LinearGradient>
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={64} color="#DC2626" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchVehicle}
                    >
                        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={["#0078ff", "#0056cc"]}
                style={styles.gradientHeader}
            >
                <Header
                    title={vehicleData.vei_modelo}
                    bgColor="transparent"
                    backButton
                />
            </LinearGradient>

            <Animated.ScrollView
                style={[styles.container, {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.imageWrapper}>
                    <View style={styles.imageContainer}>
                        {vehicleData.vei_imagem ? (
                            <Image
                                source={{ uri: vehicleData.vei_imagem }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.noImageContainer}>
                                <MaterialIcons name="directions-car" size={60} color="#9CA3AF" />
                                <Text style={styles.noImageText}>Sem imagem</Text>
                            </View>
                        )}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.1)']}
                            style={styles.imageGradient}
                        />
                    </View>

                    <View style={styles.plateBadge}>
                        <Text style={styles.plateText}>{vehicleData.vei_placa}</Text>
                    </View>
                </View>

                <View style={styles.mainCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.vehicleTitle}>{vehicleData.vei_modelo}</Text>
                        <View style={[
                            styles.statusBadge,
                            vehicleData.vei_status === "ativo" ? styles.activeBadge : styles.inactiveBadge
                        ]}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>
                                {vehicleData.vei_status.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.vehicleSubtitle}>
                        {vehicleData.vei_prefixo} • {vehicleData.vei_ano}
                    </Text>

                    <View style={styles.infoGrid}>
                        <InfoCard
                            icon="business"
                            label="Empresa"
                            value={vehicleData.emp_nome}
                            color="#3B82F6"
                        />
                        <InfoCard
                            icon="local-shipping"
                            label="Frota"
                            value={vehicleData.fro_nome}
                            color="#10B981"
                        />
                        <InfoCard
                            icon="speed"
                            label="Odômetro"
                            value={`${vehicleData.vei_odometro.toLocaleString("pt-BR")} km`}
                            color="#F59E0B"
                        />
                        <InfoCard
                            icon="date-range"
                            label="Última Atualização"
                            value={new Date(vehicleData.vei_updated_at).toLocaleDateString("pt-BR")}
                            color="#8B5CF6"
                        />
                    </View>

                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Detalhes do Veículo</Text>
                        <DetailRow
                            icon="info-circle"
                            label="Modelo"
                            value={vehicleData.vei_modelo}
                        />
                        <DetailRow
                            icon="hashtag"
                            label="Código"
                            value={String(vehicleData.vei_codigo)}
                        />
                        <DetailRow
                            icon="calendar-alt"
                            label="Ano"
                            value={String(vehicleData.vei_ano)}
                        />
                    </View>
                </View>
            </Animated.ScrollView>

            {toast.visible && (
                <Toast
                    message={toast.message}
                />
            )}
        </SafeAreaView>
    );
}

function InfoCard({ icon, label, value, color }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <View style={styles.infoCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <MaterialIcons name={icon} size={20} color={color} />
            </View>
            <Text style={styles.infoCardLabel}>{label}</Text>
            <Text style={styles.infoCardValue} numberOfLines={2}>{value}</Text>
        </View>
    );
}

function DetailRow({ icon, label, value }: {
    icon: keyof typeof FontAwesome5.glyphMap;
    label: string;
    value: string;
}) {
    return (
        <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
                <FontAwesome5 name={icon} size={16} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    gradientHeader: {
        paddingTop: 10,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: "hidden",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#6B7280",
        fontFamily: "Righteous",
        letterSpacing: 0.5,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        backgroundColor: "#F9FAFB",
    },
    errorText: {
        fontSize: 18,
        color: "#374151",
        textAlign: "center",
        fontFamily: "Righteous",
        marginTop: 16,
        marginBottom: 24,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: "#0078ff",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#0078ff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontFamily: "Righteous",
        fontSize: 16,
        letterSpacing: 0.5,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    imageWrapper: {
        position: "relative",
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 24,
        backgroundColor: "#FFFFFF",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        overflow: "hidden",
    },
    imageContainer: {
        height: 220,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    noImageContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    noImageText: {
        marginTop: 8,
        fontSize: 14,
        color: "#9CA3AF",
        fontFamily: "Righteous",
    },
    imageGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
    },
    plateBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    plateText: {
        fontSize: 20,
        fontFamily: "Righteous",
        color: "#1F2937",
        letterSpacing: 2,
    },
    mainCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    vehicleTitle: {
        fontSize: 28,
        fontFamily: "Righteous",
        color: "#1F2937",
        flex: 1,
        lineHeight: 32,
    },
    vehicleSubtitle: {
        fontSize: 16,
        color: "#6B7280",
        fontFamily: "Righteous",
        marginBottom: 24,
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 12,
    },
    activeBadge: {
        backgroundColor: "#D1FAE5",
    },
    inactiveBadge: {
        backgroundColor: "#FEE2E2",
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontFamily: "Righteous",
        letterSpacing: 0.5,
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    infoCard: {
        width: "48%",
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    infoCardLabel: {
        fontSize: 12,
        color: "#6B7280",
        fontFamily: "Righteous",
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoCardValue: {
        fontSize: 16,
        color: "#1F2937",
        fontFamily: "Righteous",
        lineHeight: 20,
    },
    detailsSection: {
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: "#1F2937",
        fontFamily: "Righteous",
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    detailIcon: {
        width: 32,
        alignItems: "center",
    },
    detailContent: {
        flex: 1,
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: "#6B7280",
        fontFamily: "Righteous",
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        color: "#1F2937",
        fontFamily: "Righteous",
    },
});