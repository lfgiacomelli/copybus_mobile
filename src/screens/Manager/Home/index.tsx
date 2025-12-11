import React, { useState } from "react";
import { View, Button } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";

export function Home() {
    const { signOut } = useAuth();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            
            <Button title="deslogar" onPress={()=> signOut()} />
        </View>
    );
}
