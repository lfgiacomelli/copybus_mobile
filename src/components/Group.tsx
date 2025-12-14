import { TouchableOpacity, Text, StyleSheet } from "react-native";
export function Group({ name, isActive, onPress }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={[
                styles.groupContainer,
                isActive && styles.groupActive,
            ]}
        >
            <Text
                style={[
                    styles.groupText,
                    isActive && styles.groupTextActive,
                ]}
            >
                {name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    groupContainer: {
        marginRight: 12,
        minWidth: 110,
        height: 42,
        backgroundColor: "#F2F2F2",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    groupActive: {
        backgroundColor: "#EAF2FF",
        borderWidth: 1,
        borderColor: "#0078ff",
    },

    groupText: {
        fontFamily: "Righteous",
        color: "#9CA3AF",
        fontSize: 12,
        textTransform: "uppercase",
    },

    groupTextActive: {
        color: "#0078ff",
    },

    groupList: {
        paddingHorizontal: 24,
    },

    groupFlatList: {
        marginBottom: 20,
        maxHeight: 44,
        minHeight: 44,
    },

});
