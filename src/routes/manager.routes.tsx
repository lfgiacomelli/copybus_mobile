import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Manager/Home";

import { Companies } from "../screens/Manager/Companies";
import { AddCompany } from "../screens/Manager/Companies/AddCompany";
import { EditCompany } from "../screens/Manager/Companies/EditCompany";

import { Managers } from "../screens/Manager/Managers/Managers";
import { AddManager } from "../screens/Manager/Managers/AddManager";
import { EditManager } from "../screens/Manager/Managers/EditManager";

import Ionicons from "@expo/vector-icons/Ionicons"; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CompaniesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompaniesList" component={Companies} />
      <Stack.Screen name="AddCompany" component={AddCompany} />
      <Stack.Screen name="EditCompany" component={EditCompany} />
    </Stack.Navigator>
  );
}

function ManagersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManagersList" component={Managers} />
      <Stack.Screen name="AddManager" component={AddManager} />
      <Stack.Screen name="EditManager" component={EditManager} />
    </Stack.Navigator>
  );
}

export function ManagerRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Empresas":
              iconName = focused ? "business" : "business-outline";
              break;
            case "Gestores":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0f0c0cff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Empresas" component={CompaniesStack} />
      <Tab.Screen name="Gestores" component={ManagersStack} />
    </Tab.Navigator>
  );
}
