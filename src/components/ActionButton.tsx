import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import type { ComponentProps } from "react";

type ActionProps = {
    title: string;
    icon: ComponentProps<typeof Ionicons>["name"];
    onPress: () => void;
};

export function ActionButton({ title, icon, onPress }: ActionProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={styles.actionButton}
        >
            <Ionicons name={icon} size={24} color="#fff" />
            <Text style={styles.actionButtonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    actionButton: {
        height: 52,
        backgroundColor: "#0078ff",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },

    actionButtonText: {
        fontFamily: "Righteous",
        color: "#FFFFFF",
        fontSize: 14,
        letterSpacing: 0.5,
    },
});
