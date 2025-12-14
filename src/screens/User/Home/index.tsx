import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "../../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import useRighteousFont from "../../../hooks/useFonts/Righteous";

import { Group } from "../../../components/Group";
import { ActionButton } from "../../../components/ActionButton";
import { VehicleCard } from "../../../components/VehicleCard";
import { Header } from "../../../components/Header";

import logotipo from "../../../assets/images/copybus.png";
import logotipo_2 from "../../../assets/images/copybus_2.png";

import { UserDTO } from "../../../dtos/UserDTO";
import { VehiclesProps } from "../../../types/vehicles";
import { api } from "../../../services/api";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export function Home() {
    const navigation = useNavigation<any>();
    const fontLoaded = useRighteousFont();
    const { user, signOut } = useAuth();
    const savedUser = user as UserDTO & { type: "user" };

    const emp_codigo = savedUser?.emp_codigo;

    const userName = savedUser?.usu_nome
        ?.trim()
        .split(/\s+/)
        .slice(0, 2)
        .join(" ");



    const groups = ["Veículos", "Frotas", "Funcionários", "Motoristas", "Empresa"];
    const [groupSelected, setGroupSelected] = useState(groups[0]);
    const [vehicles, setVehicles] = useState<VehiclesProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchVehicles() {
        try {
            setIsLoading(true);
            const response = await api.get(`/vehicles/${emp_codigo}`);

            const vehiclesData = response.data.data;
            setVehicles(vehiclesData);
            console.log(vehiclesData);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const lastVehicles = vehicles
        .slice(-4)
        .reverse();


    function renderActions() {
        switch (groupSelected) {
            case "Veículos":
                return (
                    <>
                        <ActionButton
                            title="Cadastrar Veículo"
                            icon="car"
                            onPress={() =>
                                navigation.navigate("Veículos", {
                                    screen: "AddVehicle",
                                })
                            }
                        />
                        <ActionButton
                            title="Acessar lista de veículos"
                            icon="list"
                            onPress={() =>
                                navigation.navigate("Veículos", {
                                    screen: "VehiclesList",
                                })
                            }
                        />
                        {!isLoading ? (<View style={styles.vehiclesSection}>
                            <Text style={styles.sectionTitle}>
                                Últimos veículos adicionados
                            </Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                {lastVehicles.map((vehicle) => (
                                    <VehicleCard
                                        key={vehicle.vei_codigo}
                                        image={vehicle.vei_imagem}
                                        model={vehicle.vei_modelo}
                                        prefix={vehicle.vei_prefixo}
                                        fleet={vehicle.fro_nome}
                                    />
                                ))}
                            </ScrollView>
                        </View>) : (
                            null
                        )}

                    </>
                );

            case "Funcionários":
                return (
                    <>
                        <ActionButton
                            title="Cadastrar Funcionário"
                            icon="person-add-outline"
                            onPress={() =>
                                navigation.navigate("Funcionários", {
                                    screen: "AddUser",
                                })
                            }
                        />
                        <ActionButton
                            title="Acessar lista de Funcionários"
                            icon="person-outline"
                            onPress={() =>
                                navigation.navigate("Funcionários", {
                                    screen: "UsersList",
                                })
                            }
                        />
                        <TouchableOpacity style={styles.logoutFull} onPress={signOut}>
                            <FontAwesome5 name="sign-out-alt" size={26} color="#fff" />
                            <Text style={styles.logoutText}>Sair</Text>
                        </TouchableOpacity>
                    </>
                );

            case "Motoristas":
                return (
                    <>
                        <ActionButton
                            title="Cadastrar Motorista"
                            icon="person-add-outline"
                            onPress={() =>
                                navigation.navigate("Motoristas", {
                                    screen: "AddDriver",
                                })
                            }
                        />
                        <ActionButton
                            title="Acessar lista de Motoristas"
                            icon="person-circle-outline"
                            onPress={() =>
                                navigation.navigate("Motoristas", {
                                    screen: "DriversList",
                                })
                            }
                        />
                    </>
                );
            case "Frotas":
                return (
                    <>
                        <ActionButton
                            title="Cadastrar Frotas"
                            icon="add-circle-sharp"
                            onPress={() =>
                                navigation.navigate("FleetsStack", {
                                    screen: "AddFleet",
                                })
                            }
                        />
                        <ActionButton
                            title="Acessar lista de frotas"
                            icon="file-tray-full"
                            onPress={() =>
                                navigation.navigate("FleetsStack", {
                                    screen: "FleetsList"
                                })
                            }
                        />
                    </>
                );
            case "Empresa":
                return (
                    <>
                        <ActionButton
                            title="Acessar dados da empresa"
                            icon="file-tray"
                            onPress={() =>
                                navigation.navigate("Empresa", {
                                    screen: "Company",
                                })
                            }
                        />
                    </>
                );

            default:
                return null;
        }
    }

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


    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={["#0078ff", "#0058cc"]}
                style={styles.headerGradient}
            >
                <Header title="CopyBus" bgColor="transparent" />

                <View style={styles.userInfo}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={styles.welcomeText}>Bem-vindo,</Text>
                            <Text style={styles.userName}>{userName}!</Text>
                        </View>
                        <View>
                            <Image source={logotipo_2} style={styles.miniLogo} />
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={["#FFFFFF", "#F8FAFF"]}
                    style={styles.logoCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.logoContainer}>
                        <Image source={logotipo} style={styles.logo} />
                    </View>

                    <Text style={styles.subtitle}>
                        Gestão inteligente da sua frota
                    </Text>
                    <View style={styles.divider} />
                    <Text style={styles.statsText}>
                    </Text>
                </LinearGradient>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                        Recursos
                    </Text>
                    <FlatList
                        data={groups}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Group
                                name={item}
                                isActive={groupSelected === item}
                                onPress={() => setGroupSelected(item)}
                                icon={
                                    item === "Veículos" ? "car" :
                                        item === "Funcionários" ? "users" :
                                            "user-circle"
                                }
                            />
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.groupList}
                        style={styles.groupFlatList}
                    />
                </View>

                <LinearGradient
                    colors={["#FFFFFF", "#F9FAFB"]}
                    style={styles.contentCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.contentTitle}>
                                {groupSelected}
                            </Text>
                            <Text style={styles.contentSubtitle}>
                                Gerenciamento completo
                            </Text>
                        </View>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>
                                {groups.indexOf(groupSelected) + 1}/{groups.length}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <Text style={styles.contentDescription}>
                        Funcionalidades para {groupSelected.toLowerCase()}
                    </Text>

                    <View style={styles.actionsContainer}>
                        {renderActions()}
                    </View>
                </LinearGradient>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        CopyBus • Sistema de Gestão de Frota
                    </Text>
                    <Text style={styles.footerVersion}>
                        v2.1.0 • Última atualização: hoje
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

    headerGradient: {
        paddingBottom: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#0078ff",
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 15,
    },

    userInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        marginTop: 16,
    },

    welcomeText: {
        fontFamily: "Righteous",
        fontSize: 14,
        color: "rgba(255,255,255,0.9)",
        letterSpacing: 0.5,
    },

    userName: {
        fontFamily: "Righteous",
        fontSize: 22,
        color: "#FFFFFF",
        marginTop: 2,
    },
    container: {
        flex: 1,
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

    logoCard: {
        marginHorizontal: 20,
        marginTop: -40,
        marginBottom: 24,
        paddingVertical: 32,
        borderRadius: 24,
        alignItems: "center",
        shadowColor: "#0078ff",
        shadowOpacity: 0.15,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
        borderWidth: 1,
        borderColor: "rgba(0,120,255,0.1)",
    },

    logoContainer: {
        marginTop: 40,
        position: "relative",
    },

    logo: {
        width: 230,
        height: 230,
        zIndex: 2,
    },

    subtitle: {
        fontFamily: "Righteous",
        fontSize: 16,
        color: "#4B5563",
        fontWeight: "500",
        marginBottom: 16,
        letterSpacing: 0.5,
    },

    divider: {
        width: 60,
        height: 3,
        backgroundColor: "#0078ff",
        borderRadius: 2,
    },

    statsText: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "500",
        letterSpacing: 0.3,
    },

    sectionContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },

    sectionTitle: {
        fontFamily: "Righteous",
        fontSize: 18,
        color: "#1F2937",
        marginBottom: 16,
        letterSpacing: 0.5,
    },

    groupList: {
        gap: 12,
    },

    groupFlatList: {
        minHeight: 44,
    },

    contentCard: {
        marginHorizontal: 20,
        marginBottom: 30,
        borderRadius: 24,
        padding: 28,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 25,
        shadowOffset: { width: 0, height: 5 },
        elevation: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    contentTitle: {
        fontFamily: "Righteous",
        fontSize: 26,
        color: "#111827",
        letterSpacing: 0.5,
    },

    contentSubtitle: {
        fontFamily: "Righteous",
        fontSize: 14,
        color: "#6B7280",
        marginTop: 4,
        fontWeight: "500",
    },

    categoryBadge: {
        backgroundColor: "#0078ff",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    categoryBadgeText: {
        color: "#FFFFFF",
        fontFamily: "Righteous",
        fontSize: 16,
    },

    separator: {
        height: 1,
        backgroundColor: "rgba(0,0,0,0.05)",
        marginBottom: 24,
    },

    contentDescription: {
        fontSize: 15,
        color: "#6B7280",
        marginBottom: 32,
        lineHeight: 22,
        textAlign: "center",
        fontFamily: "Righteous"
    },

    actionsContainer: {
        gap: 16,
        marginBottom: 32,
    },

    statsContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(0,120,255,0.05)",
        borderRadius: 16,
        padding: 20,
        justifyContent: "space-around",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,120,255,0.1)",
    },

    statItem: {
        alignItems: "center",
    },

    statNumber: {
        fontFamily: "Righteous",
        fontSize: 28,
        color: "#0078ff",
        marginBottom: 4,
    },

    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "600",
        letterSpacing: 0.5,
    },

    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: "rgba(0,120,255,0.2)",
    },

    footer: {
        padding: 24,
        alignItems: "center",
        marginBottom: 20,
    },

    footerText: {
        fontFamily: "Righteous",
        fontSize: 14,
        color: "#9CA3AF",
        letterSpacing: 0.5,
        marginBottom: 4,
    },

    footerVersion: {
        fontSize: 12,
        color: "#D1D5DB",
        letterSpacing: 0.3,
    },
    vehiclesSection: {
        marginBottom: 32,
    },
    miniLogo: {
        width: 100,
        height: 100
    },
    logoutFull: {
        backgroundColor: "#dc3545",
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        gap: 10,
        marginBottom: 30,
        elevation: 3,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: "Righteous",
        color: "#fff",
    },

});