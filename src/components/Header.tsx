import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  Text,
  StatusBar as RNStatusBar,
  Platform,
  Pressable,
} from "react-native";
import useRighteousFont from "../hooks/useFonts/Righteous";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type HeaderProps = {
  title: string;
  backButton?: boolean; // 👈 nova prop booleana
};

const COLORS = {
  primary: "#59C173",
  text: "#FFFFFF",
};

export function Header({ title, backButton = false }: HeaderProps) {
  const navigation = useNavigation();
  const fontLoaded = useRighteousFont();
  if (!fontLoaded) return null;

  function handleGoBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      <View style={styles.container}>
        {backButton ? (
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={styles.backButtonPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },

  container: {
    width: "100%",
    height: 60,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  title: {
    fontFamily: "Righteous",
    fontSize: 20,
    color: COLORS.text,
    letterSpacing: 0.8,
    textAlign: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonPlaceholder: {
    width: 40,
  },
});
