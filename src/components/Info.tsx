import { View, Text, StyleSheet } from "react-native";
import useRighteousFont from "../hooks/useFonts/Righteous";

type InfoProps = {
    text: string;
};

export function Info({ text }: InfoProps) {
    const fontLoaded = useRighteousFont();
    if (!fontLoaded) return null;

    return (
        <View style={styles.box}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        marginHorizontal: 15,
        marginVertical: 12,
        padding: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingBottom: 10,

        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontFamily: "Righteous",
        fontSize: 16,
        color: "#555555",
        textAlign: "center",
        lineHeight: 24,
        fontWeight: "400",
        paddingVertical: 4,
    },
});

export default Info;