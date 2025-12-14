import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { MaterialIcons } from "@expo/vector-icons";

import useRighteousFont from "../hooks/useFonts/Righteous";

import { VehiclesProps } from "../types/vehicles";

interface VehicleCardColumnProps {
  vehicle: VehiclesProps;
  onPress?: () => void;
}

export function VehicleCardColumn({ vehicle, onPress }: VehicleCardColumnProps) {
  const fontLoaded = useRighteousFont();

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, {
      color: string;
      label: string;
      bg: string;
      icon: keyof typeof MaterialIcons.glyphMap;
    }> = {
      'ativo': {
        color: "#10B981",
        label: "Operacional",
        bg: "rgba(16, 185, 129, 0.1)",
        icon: "check-circle"
      },
      'manutencao': {
        color: "#F59E0B",
        label: "Em Manutenção",
        bg: "rgba(245, 158, 11, 0.1)",
        icon: "build"
      },
      'inativo': {
        color: "#EF4444",
        label: "Inativo",
        bg: "rgba(239, 68, 68, 0.1)",
        icon: "block"
      },
    };

    return statusMap[status.toLowerCase()] || statusMap['ativo'];
  };

  const statusInfo = getStatusConfig(vehicle.vei_status);

  const formatOdometro = (odometro: number) => {
    return odometro.toLocaleString('pt-BR') + ' km';
  };

  const formatYear = (year: number) => {
    return year.toString();
  };

  if (!fontLoaded) {
    return (
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: '60%' }]} />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Card Principal */}
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header com Status e Ações */}
        <View style={styles.header}>
          <View style={styles.statusSection}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
              <MaterialIcons
                name={statusInfo.icon}
                size={14}
                color={statusInfo.color}
                style={styles.statusIcon}
              />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>

            <View style={styles.prefixTag}>
              <Text style={styles.prefixLabel}>Prefixo</Text>
              <Text style={styles.prefixValue}>{vehicle.vei_prefixo}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: vehicle.vei_imagem || 'https://via.placeholder.com/300x180?text=Ônibus'
                }}
                style={styles.image}
                resizeMode="contain"
              />
              <LinearGradient
                colors={["rgba(0, 0, 0, 0.4)", "transparent"]}
                style={styles.imageGradient}
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>#{vehicle.vei_prefixo}</Text>
              </View>
            </View>

            <View style={styles.basicInfo}>
              <Text style={styles.model} numberOfLines={2}>
                {vehicle.vei_modelo}
              </Text>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <MaterialIcons name="badge" size={14} color="#6B7280" />
                  <Text style={styles.infoLabel}>Placa:</Text>
                  <Text style={styles.infoValue}>{vehicle.vei_placa}</Text>
                </View>

                <View style={styles.infoItem}>
                  <MaterialIcons name="calendar-today" size={14} color="#6B7280" />
                  <Text style={styles.infoLabel}>Ano:</Text>
                  <Text style={styles.infoValue}>{formatYear(vehicle.vei_ano)}</Text>
                </View>

                <View style={styles.infoItem}>
                  <MaterialIcons name="speed" size={14} color="#6B7280" />
                  <Text style={styles.infoLabel}>Odômetro:</Text>
                  <Text style={styles.infoValue}>{formatOdometro(vehicle.vei_odometro)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.bottomRow}>
            <View style={styles.fleetSection}>
              <View style={styles.fleetHeader}>
                <MaterialIcons name="business" size={16} color="#0078ff" />
                <Text style={styles.fleetTitle}>Frota</Text>
              </View>
              <View style={styles.fleetBadge}>
                <Text style={styles.fleetCode}>{vehicle.fro_codigo}</Text>
                <View style={styles.fleetDivider} />
                <Text style={styles.fleetName} numberOfLines={1}>
                  {vehicle.fro_nome}
                </Text>
              </View>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailItem}>
                <MaterialIcons name="settings" size={14} color="#9CA3AF" />
                <Text style={styles.detailLabel}>Código:</Text>
                <Text style={styles.detailValue}>#{vehicle.vei_codigo}</Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialIcons name="apartment" size={14} color="#9CA3AF" />
                <Text style={styles.detailLabel}>Empresa:</Text>
                <Text style={styles.detailValue}>{vehicle.emp_nome}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.lastUpdate}>
            <MaterialIcons name="update" size={12} color="#9CA3AF" />
            <Text style={styles.lastUpdateText}>
              Atualizado em {vehicle?.vei_updated_at
                ? new Date(vehicle.vei_updated_at).toLocaleDateString("pt-BR")
                : ""}
            </Text>

          </View>
          <View style={styles.activityDot} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },

  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 120, 255, 0.08)',
  },

  skeletonCard: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },

  skeletonImage: {
    height: 100,
    backgroundColor: '#E5E7EB',
  },

  skeletonContent: {
    padding: 16,
    gap: 8,
  },

  skeletonLine: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(0, 120, 255, 0.02)',
  },

  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  statusIcon: {
    marginRight: 4,
  },

  statusText: {
    fontSize: 12,
    fontFamily: "Righteous",

    letterSpacing: 0.3,
  },

  prefixTag: {
    alignItems: 'center',
  },

  prefixLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: "Righteous",
    marginBottom: 2,
  },

  prefixValue: {
    fontSize: 20,
    fontFamily: 'Righteous',
    color: '#0078ff',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },

  urgencyText: {
    fontSize: 10,
    color: '#EF4444',
    fontFamily: "Righteous",
  },

  content: {
    padding: 16,
  },

  topRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },

  image: {
    width: '100%',
    resizeMode: "contain",
    height: '100%',
    backgroundColor: '#F3F4F6',
  },

  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: "Righteous",

    textAlign: 'center',
  },

  basicInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  model: {
    fontFamily: 'Righteous',
    fontSize: 18,
    color: '#111827',
    lineHeight: 22,
    marginBottom: 8,
  },

  infoGrid: {
    gap: 6,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: "Righteous",

    minWidth: 55,
  },

  infoValue: {
    fontSize: 13,
    color: '#374151',
    fontFamily: "Righteous",

    flex: 1,
  },

  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 12,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  fleetSection: {
    flex: 1,
  },

  fleetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  fleetTitle: {
    fontSize: 13,
    color: '#374151',
    fontFamily: "Righteous",

  },

  fleetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 120, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 120, 255, 0.15)',
    maxWidth: 150,
  },

  fleetCode: {
    fontSize: 12,
    fontFamily: 'Righteous',
    color: '#0078ff',

  },

  fleetDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0, 120, 255, 0.3)',
    marginHorizontal: 8,
  },

  fleetName: {
    fontSize: 12,
    color: '#374151',
    fontFamily: "Righteous",

    flex: 1,
  },

  detailsSection: {
    alignItems: 'flex-end',
    gap: 4,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  detailValue: {
    fontSize: 11,
    color: '#374151',
    fontFamily: "Righteous",

  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },

  actionPrimary: {
    backgroundColor: '#0078ff',
    borderColor: '#0078ff',
  },

  actionText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: "Righteous",

  },

  actionTextPrimary: {
    color: '#FFFFFF',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.03)',
  },

  lastUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  lastUpdateText: {
    fontFamily: "Righteous",
    fontSize: 10,
    color: '#9CA3AF',
  },

  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
});