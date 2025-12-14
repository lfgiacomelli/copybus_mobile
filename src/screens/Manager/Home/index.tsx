import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../../../components/Header";

const { width } = Dimensions.get("window");
const cardSpacing = 16;
const cardPaddingHorizontal = 20;
const cardWidth = (width - cardPaddingHorizontal * 2 - cardSpacing) / 2;

export function Home() {
    const { signOut } = useAuth();
    const navigation = useNavigation<any>();

    const handleNavigation = (screenName: string) => {
        navigation.navigate(screenName);
    };

    const moduleCards = [
        {
            icon: "building",
            color: "#0d6efd",
            title: "Ver Empresas",
            desc: "Visualize e edite empresas cadastradas.",
            onPress: () =>
                navigation.navigate("Empresas", {
                    screen: "CompaniesList",
                }),
        },
        {
            icon: "plus-circle",
            color: "#28a745",
            title: "Adicionar Empresa",
            desc: "Cadastre uma nova empresa.",
            onPress: () =>
                navigation.navigate("Empresas", {
                    screen: "AddCompany",
                }),
        },
        {
            icon: "users",
            color: "#0d6efd",
            title: "Ver Gestores",
            desc: "Gerencie acessos e permissões.",
            onPress: () =>
                navigation.navigate("Gestores", {
                    screen: "ManagersList",
                }),
        },
        {
            icon: "user-plus",
            color: "#0d6efd",
            title: "Adicionar Gestor",
            desc: "Crie uma nova conta de gestor.",
            onPress: () =>
                navigation.navigate("Gestores", {
                    screen: "AddManager",
                }),
        },
    ];



    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0d6efd" />

            <Header title="CopyBus" />

            <ScrollView style={styles.scrollViewContent}>
                <View style={styles.welcomeBlock}>
                    <View style={styles.welcomeTextContainer}>
                        <Text style={styles.welcomeTitle}>Bem-vindo(a)!</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Gerencie empresas e gestores do CopyBus.
                        </Text>
                    </View>

                    <Image
                        source={require("../../../assets/images/copybus.png")}
                        style={styles.welcomeImage}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.sectionTitle}>Gerenciamento de Módulos</Text>

                <View style={styles.cardsGrid}>
                    {moduleCards.map((card, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.card, { width: cardWidth }]}
                            onPress={card.onPress}
                        >
                            <FontAwesome5 name={card.icon} size={30} color={card.color} />
                            <Text style={styles.cardTitle}>{card.title}</Text>
                            <Text style={styles.cardDesc}>{card.desc}</Text>
                        </TouchableOpacity>
                    ))}

                </View>
                <TouchableOpacity style={styles.logoutFull} onPress={signOut}>
                    <FontAwesome5 name="sign-out-alt" size={26} color="#fff" />
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        © {new Date().getFullYear()} CopyBus. Todos os direitos reservados.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f6fa",
    },

    scrollViewContent: {
        flex: 1,
    },

    welcomeBlock: {
        backgroundColor: "#ffffff",
        padding: 20,
        marginBottom: 25,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    welcomeTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    welcomeTitle: {
        fontSize: 24,
        fontFamily: "Righteous",
        color: "#333",
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontFamily: "Righteous",
        fontSize: 14,
        color: "#6c757d",
    },
    welcomeImage: {
        width: 100,
        height: 100,
    },

    sectionTitle: {
        fontSize: 20,
        fontFamily: "Righteous",
        marginLeft: cardPaddingHorizontal,
        marginBottom: 18,
        color: "#555",
    },

    cardsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        paddingHorizontal: cardPaddingHorizontal,
        gap: cardSpacing,
        marginBottom: 25,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    cardTitle: {
        fontSize: 15,
        fontFamily: "Righteous",
        color: "#333",
        marginTop: 12,
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        textAlign: "center",
        color: "#6c757d",
        fontFamily: "Righteous"
    },

    logoutFull: {
        marginHorizontal: cardPaddingHorizontal,
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

    footer: {
        paddingVertical: 20,
        alignItems: "center",
    },
    footerText: {
        fontSize: 13,
        color: "#6c757d",
    },
});
