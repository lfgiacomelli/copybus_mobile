import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/User/Home";

import { Company } from "../screens/User/Company/Company";
import { EditCompany } from "../screens/User/Company/EditCompany";

import { Users } from "../screens/User/Users/Users";
import { AddUser } from "../screens/User/Users/AddUser";
import { EditUser } from "../screens/User/Users/EditUser";

import { Vehicles } from "../screens/User/Vehicles/Vehicles";
import { AddVehicle } from "../screens/User/Vehicles/AddVehicle";
import { EditVehicle } from "../screens/User/Vehicles/EditVehicle";
import { Vehicle } from "../screens/User/Vehicles/Vehicle";

import { Fleet } from "../screens/User/Fleets/Fleet";
import { Fleets } from "../screens/User/Fleets/Fleets";
import { AddFleet } from "../screens/User/Fleets/AddFleet";
import { EditFleet } from "../screens/User/Fleets/EditFleet";

import { Drivers } from "../screens/User/Drivers/Drivers";
import { AddDriver } from "../screens/User/Drivers/AddDriver";
import { EditDriver } from "../screens/User/Drivers/EditDriver";
import { Driver } from "../screens/User/Drivers/Driver";

import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();


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

function FleetsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FleetsList" component={Fleets} />
      <Stack.Screen name="Fleet" component={Fleet} />
      <Stack.Screen name="AddFleet" component={AddFleet} />
      <Stack.Screen name="EditFleet" component={EditFleet} />
    </Stack.Navigator>
  );
}

function UserTabs() {
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
              iconName = focused ? "bus" : "bus-outline";
              break;
            case "Motoristas":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          if (iconName === "bus") {
            return (
              <FontAwesome5
                name={iconName as any}
                size={size}
                color={color}
              />
            );
          }

          return (
            <Ionicons
              name={iconName as any}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: "#0f0c0cff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
        },
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

export function UserRoutes() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="UserTabs" component={UserTabs} />
      <RootStack.Screen name="FleetsStack" component={FleetsStack} />
    </RootStack.Navigator>
  );
}
