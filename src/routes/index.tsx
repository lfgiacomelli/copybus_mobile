import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { AuthRoutes } from "./auth.routes";
import { ManagerRoutes } from "./manager.routes";
import { UserRoutes } from "./user.routes";
import { ActivityIndicator, View } from "react-native";

export function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user?.type === "manager" && <ManagerRoutes />}
      {user?.type === "user" && <UserRoutes />}
      {!user && <AuthRoutes />}
    </NavigationContainer>
  );
}
