import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Animated
} from "react-native";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { api } from "../../../services/api";
import { Toast } from "../../../components/Toast";
import useRighteousFont from "../../../hooks/useFonts/Righteous";
import { CompanyProps } from "../../../types/company";
import { Header } from "../../../components/Header";
import { Info } from "../../../components/Info";

type ManagerStackParamList = {
  Companies: undefined;
  EditCompany: { emp_codigo: number };
  AddCompany: undefined;
};

type Props = NativeStackNavigationProp<ManagerStackParamList, "Companies">;

const COLORS = {
  background: "#F7F9FC",
  card: "#FFFFFF",
  primary: "#0340fd",
  text: "#1A1A1A",
  textSecondary: "#767676",
  border: "#E2E8F0",
};

export function Companies() {
  const [companies, setCompanies] = useState<CompanyProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", status: "info" });

  const navigation = useNavigation<Props>();
  const fontsLoaded = useRighteousFont();

  const showToast = (status: "success" | "error" | "info", message: string) => {
    setToast({ visible: true, message, status });
    setTimeout(() => setToast({ visible: false, message: "", status: "info" }), 3000);
  };

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/managers/companies/");
      setCompanies(res.data.data);
    } catch {
      showToast("error", "Erro ao carregar empresas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCompanies();
    }, [fetchCompanies])
  );

  const handleDelete = (id?: number) => {
    if (!id) return;
    Alert.alert(
      "Excluir Empresa",
      "Tem certeza? Essa ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/managers/companies/${id}`);
              showToast("success", "Empresa excluída com sucesso!");
              fetchCompanies();
            } catch {
              showToast("error", "Erro ao excluir empresa.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: CompanyProps, index: number }) => {
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
        <View style={styles.row}>
          <Image
            source={{ uri: item.emp_logo || "https://via.placeholder.com/70" }}
            style={styles.logo}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.emp_nome}</Text>
            {item.emp_cnpj && <Text style={styles.subText}>CNPJ: {item.emp_cnpj}</Text>}
            {item.emp_email && <Text style={styles.subText}>{item.emp_email}</Text>}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.navigate("EditCompany", { emp_codigo: item.emp_codigo! })}
          >
            <Ionicons name="create-outline" size={22} color={COLORS.primary} />
          </Pressable>

          <Pressable
            style={[styles.iconButton, { backgroundColor: "#FFE5E5" }]}
            onPress={() => handleDelete(item.emp_codigo)}
          >
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </Pressable>
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
      <Header title="Empresas" />
      {toast.visible && <Toast message={toast.message} />}
      <Info text="Acesso às empresas no CopyBus" />
      <FlatList
        data={companies}
        onRefresh={fetchCompanies}
        refreshing={isLoading}
        renderItem={renderItem}
        keyExtractor={(i) => i.emp_codigo!.toString()}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Ionicons name="business-outline" size={70} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>Nenhuma empresa cadastrada</Text>
            </View>
          ) : null
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("AddCompany")}
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
    height: 150
  },
  row: { flexDirection: "row", gap: 14 },
  logo: { width: 60, height: 60, borderRadius: 12, backgroundColor: "#D9E3F0" },
  name: {
    fontFamily: "Righteous",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: "Righteous",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
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
});
