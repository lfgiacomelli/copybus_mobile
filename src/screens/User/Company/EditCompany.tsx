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
    Image,
    Pressable,
    Linking,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { api } from "../../../services/api";
import { Toast } from "../../../components/Toast";
import { CompanyProps } from "../../../types/company";
import { Header } from "../../../components/Header";
import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { CompanyLogo } from "../../../components/CompanyLogo";

type RootStackParamList = {
    EditCompany: { emp_codigo: number };
};

type CompaniesStackParamList = {
    CompaniesList: undefined;
    AddCompany: undefined;
    EditCompany: { emp_codigo: number };
};

type EditCompanyRouteProp = RouteProp<RootStackParamList, "EditCompany">;

export function EditCompany() {

    const navigation = useNavigation<NativeStackNavigationProp<CompaniesStackParamList>>();
    const route = useRoute<EditCompanyRouteProp>();
    const { emp_codigo } = route.params;

    const fontLoaded = useRighteousFont();

    const [company, setCompany] = useState<CompanyProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: "",
    });

    const mountedRef = useRef(true);
    const toastTimerRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    }, []);

    const fetchCompany = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/managers/companies/${emp_codigo}`);
            const data = response.data?.data ?? response.data;
            if (mountedRef.current) setCompany(data);
        } catch (err) {
            if (mountedRef.current) {
                setToast({ visible: true, message: "Erro ao carregar empresa" });
                toastTimerRef.current = setTimeout(() => {
                    if (mountedRef.current) setToast({ visible: false, message: "" });
                }, 3000) as unknown as number;
            }
        } finally {
            if (mountedRef.current) setIsLoading(false);
        }
    }, [emp_codigo]);

    useEffect(() => {
        fetchCompany();
    }, [fetchCompany]);

    const handleUpdate = useCallback(async () => {
        if (!company) return;
        try {
            setIsUpdating(true);
            await api.put(`/managers/companies/${emp_codigo}`, company);
            if (mountedRef.current) {
                setToast({ visible: true, message: "Empresa atualizada com sucesso!" });
                toastTimerRef.current = setTimeout(() => {
                    if (mountedRef.current) setToast({ visible: false, message: "" });
                }, 3000) as unknown as number;
                navigation.navigate("CompaniesList");
            }
        } catch (err) {
            if (mountedRef.current) {
                setToast({ visible: true, message: "Erro ao atualizar empresa" });
                toastTimerRef.current = setTimeout(() => {
                    if (mountedRef.current) setToast({ visible: false, message: "" });
                }, 3000) as unknown as number;
            }
        } finally {
            if (mountedRef.current) setIsUpdating(false);
        }
    }, [company, emp_codigo, navigation]);

    if (isLoading || !company) {
        return (
            <View style={{ flex: 1 }}>
                {toast.visible && <Toast message={toast.message} />}
                <Header title="Editar Empresa" />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0078FF" />
                    <Text style={{ marginTop: 12, fontFamily: "Righteous" }}>Carregando empresa...</Text>
                </View>
            </View>
        );
    }
    return (
        <View style={{ flex: 1 }}>
            <Header title="Editar Empresa" backButton />
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <CompanyLogo logoUrl={company.emp_logo} />


                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={styles.linkText}>A imagem só pode ser alterada pelo website</Text>
                        <Pressable onPress={() => Linking.openURL("http://192.168.1.106/copybus/views/gestor/login.php")} style={styles.linkBtn}>
                            <Text style={styles.linkText}>Acessar website</Text>
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={company.emp_nome}
                    onChangeText={(text) => setCompany((prev) => (prev ? { ...prev, emp_nome: text } : prev))}
                    autoCapitalize="words"
                    returnKeyType="next"
                />

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={company.emp_email}
                    onChangeText={(text) => setCompany((prev) => (prev ? { ...prev, emp_email: text } : prev))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                />

                <Text style={styles.label}>Telefone</Text>
                <TextInput
                    style={styles.input}
                    value={company.emp_telefone ?? ""}
                    onChangeText={(text) => setCompany((prev) => (prev ? { ...prev, emp_telefone: text } : prev))}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                />

                <Text style={styles.label}>Endereço</Text>
                <TextInput
                    style={styles.input}
                    value={company.emp_endereco ?? ""}
                    onChangeText={(text) => setCompany((prev) => (prev ? { ...prev, emp_endereco: text } : prev))}
                    returnKeyType="next"
                />

                <Text style={styles.label}>CNPJ</Text>
                <TextInput
                    style={styles.input}
                    value={company.emp_cnpj ?? ""}
                    onChangeText={(text) => setCompany((prev) => (prev ? { ...prev, emp_cnpj: text } : prev))}
                    returnKeyType="done"
                />

                <TouchableOpacity
                    style={[styles.button, isUpdating && { opacity: 0.8 }]}
                    onPress={handleUpdate}
                    disabled={isUpdating}
                    activeOpacity={0.85}
                >
                    {isUpdating ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Atualizar Empresa</Text>
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
        paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight ?? 0 : 0,
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
        borderBottomColor: "#0078FF",
    },
    button: {
        marginTop: 30,
        backgroundColor: "#0078FF",
        height: 52,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        fontFamily: "Righteous",
        fontSize: 16,
        color: "#fff",
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 20,
        marginBottom: 10
    },
    linkBtn: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 12,
        borderColor: "#c0c0c0",
        marginTop: 22,
        alignItems: "center",
    },
    linkText: {
        fontFamily: "Righteous",
    }
});
