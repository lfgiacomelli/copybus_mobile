import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useRighteousFont from "../hooks/useFonts/Righteous";

const { width } = Dimensions.get("window");

type VehicleCardProps = {
  image: string;
  model: string;
  prefix: number;
  fleet: string;
  status?: "active" | "maintenance" | "inactive";
  lastMaintenance?: string;
  passengers?: number;
};

export function VehicleCard({
  image,
  model,
  prefix,
  fleet,
  status = "active",
}: VehicleCardProps) {
  const fontLoaded = useRighteousFont();

  const statusConfig = {
    active: { color: "#10B981", label: "Ativo", bg: "rgba(16, 185, 129, 0.1)" },
    maintenance: { color: "#F59E0B", label: "Manutenção", bg: "rgba(245, 158, 11, 0.1)" },
    inactive: { color: "#EF4444", label: "Inativo", bg: "rgba(239, 68, 68, 0.1)" },
  };

  const statusInfo = statusConfig[status];

  if (!fontLoaded) {
    return (
      <View style={[styles.skeletonCard, styles.card]}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonText} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F8FAFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
        
        <View style={styles.prefixContainer}>
          <Text style={styles.prefixLabel}>Prefixo</Text>
          <Text style={styles.prefixValue}>{prefix}</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.1)"]}
          style={styles.imageOverlay}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.model} numberOfLines={1}>
          {model}
        </Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.fleetContainer}>
            <Text style={styles.fleetLabel}>Frota</Text>
            <View style={styles.fleetBadge}>
              <Text style={styles.fleetText}>{fleet}</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.75,
    minWidth: 280,
    borderRadius: 24,
    marginRight: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 120, 255, 0.09)",
    marginVertical: 4,
  },

  skeletonCard: {
    opacity: 0.7,
  },

  skeletonImage: {
    width: "100%",
    height: 100,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },

  skeletonText: {
    height: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  prefixContainer: {
    alignItems: "flex-end",
  },

  prefixLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  prefixValue: {
    fontSize: 22,
    fontFamily: "Righteous",
    color: "#0078ff",
    lineHeight: 22,
  },

  imageContainer: {
    position: "relative",
    marginBottom: 16,
    borderRadius: 18,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 140,
    resizeMode: "contain",
    backgroundColor: "#F3F4F6",
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },

  info: {
    gap: 12,
  },

  model: {
    fontFamily: "Righteous",
    fontSize: 18,
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 4,
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  fleetContainer: {
    gap: 4,
  },

  fleetLabel: {
    fontFamily: "Righteous",
    fontSize: 16,
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },

  fleetBadge: {
    backgroundColor: "rgba(0, 120, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 120, 255, 0.2)",
  },

  fleetText: {
    color: "#0078ff",
    fontSize: 12,
    fontFamily: "Righteous",
    letterSpacing: 0.5,
  },

});