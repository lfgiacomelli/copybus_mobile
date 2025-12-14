import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    Animated,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
    Pressable,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { api } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";

import { UserDTO } from "../../../dtos/UserDTO";
import { CompanyProps } from "../../../types/company";

import { Header } from "../../../components/Header";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Toast } from "../../../components/Toast";

const DetailRow = ({ icon, label, value }: any) => (
    <View style={styles.detailRow}>
        <FontAwesome5 name={icon} size={18} color="#0057ff" style={styles.icon} />
        <View style={styles.textColumn}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    </View>
);
type UserStackParamList = {
    Home: undefined;
    Company: undefined;
    EditCompany: { emp_codigo: number };
};


export function Company() {
    const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();

    const [company, setCompany] = useState<CompanyProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [toast, setToast] = useState({ visible: false, message: "", status: "info" });

    const { user } = useAuth();
    const savedUser = user as UserDTO & { type: "user" };
    const emp_codigo = savedUser?.emp_codigo;

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    const showToast = (status: "success" | "error" | "info", message: string) => {
        setToast({ visible: true, message, status });
        setTimeout(() => setToast({ visible: false, message: "", status: "info" }), 3000);
    };

    async function fetchCompany() {
        if (!emp_codigo) return;

        try {
            setIsLoading(true);
            const res = await api.get(`/companies/${emp_codigo}`);
            const data = res.data.data;

            setCompany(data);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        } catch (error) {
            showToast("error", "Erro ao carregar dados da empresa.");

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCompany();
    }, [emp_codigo]);

    if (isLoading || !company) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0057ff" />
                <Text style={styles.loadingText}>Carregando informações...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title={company.emp_nome} />
            {toast.visible && <Toast message={toast.message} />}

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <Animated.View
                    style={[
                        styles.animatedContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >

                    <View style={styles.headerCard}>
                        <Image
                            source={
                                company.emp_logo
                                    ? { uri: company.emp_logo }
                                    : require("../../../assets/images/company.png")
                            }
                            style={styles.logo}
                            resizeMode="cover"
                        />

                        <Text style={styles.companyName}>{company.emp_nome}</Text>
                        <Text style={styles.companyCNPJ}>{company.emp_cnpj}</Text>

                        <Text style={styles.currentWorkText}>Você atualmente trabalha nesta empresa</Text>
                    </View>


                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contato</Text>
                        <View style={styles.infoBox}>
                            <DetailRow
                                icon="phone"
                                label="Telefone"
                                value={company.emp_telefone || "Não informado"}
                            />
                            <DetailRow
                                icon="envelope"
                                label="E-mail"
                                value={company.emp_email || "Não informado"}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Endereço</Text>
                        <View style={styles.infoBox}>
                            <DetailRow
                                icon="map-marker-alt"
                                label="Localização"
                                value={company.emp_endereco || "Não informado"}
                            />
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Editar informações da empresa:</Text>

                        <Pressable
                            style={styles.editButton}
                            onPress={() => navigation.navigate("EditCompany", { emp_codigo: company.emp_codigo })}
                        >
                            <FontAwesome5 name="edit" size={20} />
                            <Text style={styles.value}>Editar</Text>
                        </Pressable>
                    </View>


                    <View style={{ height: 50 }} />
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f3f6fc",
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f6fc",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#6c757d",
        fontFamily: "Righteous",
    },
    animatedContainer: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },

    headerCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 30,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },

    logo: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 3,
        borderColor: "#e3e8f0",
        marginBottom: 15,
    },
    companyName: {
        fontSize: 26,
        fontFamily: "Righteous",
        color: "#0d1b2a",
        textAlign: "center",
    },
    companyCNPJ: {
        fontSize: 14,
        fontFamily: "Righteous",
        color: "#6c757d",
        marginTop: 4,
    },

    section: {
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: "Righteous",
        color: "#0057ff",
        marginBottom: 10,
        marginLeft: 5,
        textTransform: "uppercase",
    },
    infoBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eef2f8",
    },
    icon: {
        width: 28,
        textAlign: "center",
        marginRight: 12,
    },
    textColumn: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontFamily: "Righteous",
        color: "#7b8a97",
        marginBottom: 2,
    },
    value: {
        fontSize: 17,
        fontFamily: "Righteous",
        color: "#1b1f24",
    },
    currentWorkText: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: "Righteous",
        color: "#0057ff",
        textAlign: "center",
    },
    editButton: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        gap: 10
    }

});
