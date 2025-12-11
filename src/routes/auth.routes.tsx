import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManagerSignIn from '../screens/Manager/ManagerSignIn';
import UserSignIn from '../screens/User/UserSignIn';

const Stack = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserSignIn" component={UserSignIn} />
      <Stack.Screen name="ManagerSignIn" component={ManagerSignIn} />
    </Stack.Navigator>
  );
}
