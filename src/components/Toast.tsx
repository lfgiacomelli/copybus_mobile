import React, { useEffect, useRef } from "react";
import { Animated, Text, Dimensions, StyleSheet } from "react-native";

import useRighteousFont from "../hooks/useFonts/Righteous";

type ToastProps = {
  title?: string;
  message: string;
  status?: "success" | "error" | "info";
  duration?: number;
  onHide?: () => void;
};

const colors = {
  success: "#2cd131ff",
  error: "#c92115ff",
  info: "#2196F3",
};

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  status = "info",
  duration = 3000,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onHide && onHide());
    }, duration);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors[status], transform: [{ translateY }] },
      ]}
    >
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: width,
    paddingVertical: 30,
    paddingHorizontal: 20,
    zIndex: 9999,
    elevation: 9999,
  },
  title: {
    textAlign: "center",
    fontFamily: "Righteous",
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10
  },
  message: {
    fontFamily: "Righteous",
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
});
