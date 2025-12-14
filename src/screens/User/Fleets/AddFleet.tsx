import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";

export function AddFleet(){
    const navigation = useNavigation();
    return (
        <Button title="voltar" onPress={()=>navigation.goBack()} />
    )
}