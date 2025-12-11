import { useState } from "react";
import { Image } from "react-native";

export function CompanyLogo({ logoUrl }: { logoUrl?: string }) {
  const [error, setError] = useState(false);

  return (
    <Image
      source={
        !error && logoUrl
          ? { uri: logoUrl }
          : require("../assets/images/company.png")
      }
      style={{ width: 80, height: 80, borderRadius: 12 }}
      onError={() => setError(true)}
      resizeMode="cover"
    />
  );
}
