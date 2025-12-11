import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { api } from "../../../services/api";
import { Toast } from "../../../components/Toast";
import { CompanyProps } from "../../../types/company";
import { Header } from "../../../components/Header";
import useRighteousFont from "../../../hooks/useFonts/Righteous";

type CompaniesStackParamList = {
  CompaniesList: undefined;
  AddCompany: undefined;
  EditCompany: { emp_codigo: number };
};

export function AddCompany() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CompaniesStackParamList>>();

  const fontLoaded = useRighteousFont();

  const [company, setCompany] = useState<Partial<CompanyProps>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; title: string; status: "info" | "error" | "success"; message: string }>({ visible: false, title: "", status: "info", message: "" });

  const mountedRef = useRef(true);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  function showToast(title: string, status: "info" | "error" | "success", message: string) {
    if (!mountedRef.current) return;
    setToast({ visible: true, title, status, message });

    toastTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setToast({ visible: false, title: "", status: "info", message: "" });
    }, 3000);
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showToast("Permita para prosseguir", "info", "Permissão para acessar imagens é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setCompany((prev) => ({ ...prev, emp_logo: uri }));
    }
  }

  async function handleSave() {
    if (!company.emp_nome || !company.emp_email || !company.emp_cnpj || !company.emp_endereco || !company.emp_telefone) {
      showToast("Campos faltando!", "error", "Todos os campos são obrigatórios!");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      Object.entries(company).forEach(([key, value]) => {
        if (key !== "emp_logo" && value) {
          formData.append(key, String(value));
        }
      });

      if (company.emp_logo && company.emp_logo.startsWith("file")) {
        const filename = company.emp_logo.split("/").pop()!;
        const ext = filename.split(".").pop()?.toLowerCase();
        const type = `image/${ext === "jpg" ? "jpeg" : ext}`;

        formData.append("emp_logo", {
          uri: company.emp_logo,
          name: filename,
          type,
        } as any);
      }

      await api.post("/managers/companies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Empresa criada!","success", "A empresa foi inserida no sistema!");
      await new Promise((res) => setTimeout(res, 1000));
      navigation.navigate("CompaniesList");
    } catch (error) {
      console.log(error);
      showToast("Erro inesperado", "error", "Tivemos um erro ao adicionar essa empresa!");
    } finally {
      if (mountedRef.current) setIsSaving(false);
    }
  }

  if (!fontLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <Header title="Adicionar Empresa" backButton />
      {toast.visible && <Toast title={toast.title} status={toast.status} message={toast.message} />}

      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.logoContainer} onPress={pickImage}>
          <Image
            source={{
              uri: company.emp_logo || "https://via.placeholder.com/120",
            }}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Selecionar logo</Text>
        </Pressable>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={company.emp_nome || ""}
          onChangeText={(t) => setCompany({ ...company, emp_nome: t })}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={company.emp_email || ""}
          onChangeText={(t) => setCompany({ ...company, emp_email: t })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={company.emp_telefone || ""}
          onChangeText={(t) => setCompany({ ...company, emp_telefone: t })}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          value={company.emp_endereco || ""}
          onChangeText={(t) => setCompany({ ...company, emp_endereco: t })}
        />

        <Text style={styles.label}>CNPJ</Text>
        <TextInput
          style={styles.input}
          value={company.emp_cnpj || ""}
          onChangeText={(t) => setCompany({ ...company, emp_cnpj: t })}
        />

        <TouchableOpacity
          style={[styles.button, isSaving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar Empresa</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const COLORS = {
  primary: "#59c173",
  text: "#222",
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 6,
  },
  logoText: {
    color: COLORS.primary,
    fontFamily: "Righteous",
    fontSize: 14,
  },
  label: {
    fontFamily: "Righteous",
    fontSize: 14,
    marginTop: 18,
    marginBottom: 6,
    color: COLORS.text,
  },
  input: {
    fontFamily: "Righteous",
    fontSize: 15,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  button: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
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
