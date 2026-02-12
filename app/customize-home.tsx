import { GlassCard } from "@/components/GlassCard";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HomeViewSettings {
  showProgressionAlert: boolean;
  showStats: boolean;
  showChart: boolean;
  showTopExercises: boolean;
}

export default function CustomizeHomeScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[theme];
  const router = useRouter();

  const [settings, setSettings] = useState<HomeViewSettings>({
    showProgressionAlert: true,
    showStats: true,
    showChart: true,
    showTopExercises: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const saved = await AsyncStorage.getItem("homeViewSettings");
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading home view settings:", error);
    }
  }

  async function updateSetting(key: keyof HomeViewSettings, value: boolean) {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(
        "homeViewSettings",
        JSON.stringify(newSettings),
      );
    } catch (error) {
      console.error("Error saving home view settings:", error);
    }
  }

  function renderToggleSetting(
    icon: string,
    label: string,
    description: string,
    settingKey: keyof HomeViewSettings,
  ) {
    return (
      <View
        style={[
          styles.toggleSetting,
          { backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5" },
        ]}
      >
        <View style={styles.toggleSettingLeft}>
          <FontAwesome name={icon as any} size={20} color={colors.tint} />
          <View style={styles.toggleSettingText}>
            <Text style={[styles.toggleSettingLabel, { color: colors.text }]}>
              {label}
            </Text>
            <Text
              style={[
                styles.toggleSettingDescription,
                { color: colors.textSecondary },
              ]}
            >
              {description}
            </Text>
          </View>
        </View>
        <Switch
          value={settings[settingKey]}
          onValueChange={(value) => updateSetting(settingKey, value)}
          trackColor={{ false: "#767577", true: colors.tint + "80" }}
          thumbColor={settings[settingKey] ? colors.tint : "#f4f3f4"}
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>
              {t("customizeHomeTitle")}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <GlassCard style={styles.infoCard}>
            <FontAwesome name="info-circle" size={20} color={colors.tint} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {t("customizeHomeInfo")}
            </Text>
          </GlassCard>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("customizeViewTitle")}
            </Text>

            <View style={styles.settingsContainer}>
              {renderToggleSetting(
                "arrow-circle-up",
                t("progressionAlert"),
                t("progressionAlertDesc"),
                "showProgressionAlert",
              )}

              {renderToggleSetting(
                "bar-chart",
                t("statistics"),
                t("statisticsDesc"),
                "showStats",
              )}

              {renderToggleSetting(
                "line-chart",
                t("trendChart"),
                t("trendChartDesc"),
                "showChart",
              )}

              {renderToggleSetting(
                "trophy",
                t("topExercises"),
                t("topExercisesDesc"),
                "showTopExercises",
              )}
            </View>
          </View>

          <GlassCard style={styles.tipCard}>
            <FontAwesome name="lightbulb-o" size={18} color="#FFD700" />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              <Text style={{ fontWeight: "700" }}>{t("tip")}:</Text>{" "}
              {t("customizeTip")}
            </Text>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "800",
  },
  infoCard: {
    flexDirection: "row",
    padding: 8,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  settingsContainer: {
    gap: 12,
  },
  toggleSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  toggleSettingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  toggleSettingText: {
    flex: 1,
  },
  toggleSettingLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  toggleSettingDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  tipCard: {
    flexDirection: "row",
    padding: 8,
    gap: 10,
    alignItems: "flex-start",
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
