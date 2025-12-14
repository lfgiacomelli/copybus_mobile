import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  Text,
  StatusBar as RNStatusBar,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useRighteousFont from "../hooks/useFonts/Righteous";

type HeaderProps = {
  title: string;
  bgColor?: string;
  backButton?: boolean;
};

const COLORS = {
  primary: "#59C173",
  secondary: "#0078ff",
  text: "#FFFFFF",
};

export function Header({
  title,
  bgColor = COLORS.primary,
  backButton = false,
}: HeaderProps) {
  const navigation = useNavigation();
  const fontLoaded = useRighteousFont();
  if (!fontLoaded) return null;

  function handleGoBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: bgColor
        },
      ]}
    >
      <StatusBar style="dark" backgroundColor={bgColor} />

      <View style={[styles.container, { backgroundColor: bgColor }]}>
        {backButton ? (
          <Pressable
            style={styles.backButton}
            onPress={handleGoBack}
            hitSlop={10}
          >
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
  },

  container: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  title: {
    fontFamily: "Righteous",
    fontSize: 20,
    color: "#FFFFFF",
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
