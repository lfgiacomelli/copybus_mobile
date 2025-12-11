import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/User/Home";

// Company
import { Company } from "../screens/User/Company/Company";
import { EditCompany } from "../screens/Manager/Companies/EditCompany";

// Users
import { Users } from "../screens/User/Users/Users";
import { AddUser } from "../screens/User/Users/AddUser";
import { EditUser } from "../screens/User/Users/EditUser";
import { User } from "../screens/User/Users/User";

// Vehicles
import { Vehicles } from "../screens/User/Vehicles/Vehicles";
import { AddVehicle } from "../screens/User/Vehicles/AddVehicle";
import { EditVehicle } from "../screens/User/Vehicles/EditVehicle";
import { Vehicle } from "../screens/User/Vehicles/Vehicle";

// Drivers
import { Drivers } from "../screens/User/Drivers/Drivers";
import { AddDriver } from "../screens/User/Drivers/AddDriver";
import { EditDriver } from "../screens/User/Drivers/EditDriver";
import { Driver } from "../screens/User/Drivers/Driver";

import Ionicons from "@expo/vector-icons/Ionicons"; // Expo
// Se não usar Expo: import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* 📌 STACKS DE CADA MENU */

function CompanyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompanyList" component={Company} />
      <Stack.Screen name="EditCompany" component={EditCompany} />
    </Stack.Navigator>
  );
}

function UsersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsersList" component={Users} />
      <Stack.Screen name="AddUser" component={AddUser} />
      <Stack.Screen name="EditUser" component={EditUser} />
      <Stack.Screen name="UserDetails" component={User} />
    </Stack.Navigator>
  );
}

function VehiclesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VehiclesList" component={Vehicles} />
      <Stack.Screen name="AddVehicle" component={AddVehicle} />
      <Stack.Screen name="EditVehicle" component={EditVehicle} />
      <Stack.Screen name="VehicleDetails" component={Vehicle} />
    </Stack.Navigator>
  );
}

function DriversStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriversList" component={Drivers} />
      <Stack.Screen name="AddDriver" component={AddDriver} />
      <Stack.Screen name="EditDriver" component={EditDriver} />
      <Stack.Screen name="DriverDetails" component={Driver} />
    </Stack.Navigator>
  );
}

/* 📌 TAB PRINCIPAL DO USER */
export function UserRoutes() {
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
            case "Empresa":
              iconName = focused ? "business" : "business-outline";
              break;
            case "Funcionários":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Veículos":
              iconName = focused ? "car" : "car-outline";
              break;
            case "Motoristas":
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
      <Tab.Screen name="Empresa" component={CompanyStack} />
      <Tab.Screen name="Funcionários" component={UsersStack} />
      <Tab.Screen name="Veículos" component={VehiclesStack} />
      <Tab.Screen name="Motoristas" component={DriversStack} />
    </Tab.Navigator>
  );
}
