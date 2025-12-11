import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Routes } from "./src/routes";
import { AuthProvider } from "./src/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    async function hideSplash() {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    }

    hideSplash();
  }, [appIsReady]);

  if (!appIsReady) return null; 

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
