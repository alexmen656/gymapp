import Colors from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  cancelAllNotifications,
  scheduleWorkoutReminder,
} from "@/utils/notifications";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { theme, isDark, mode, setMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const colors = Colors[theme];
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  React.useEffect(() => {
    async function loadNotificationStatus() {
      const enabled = await AsyncStorage.getItem("reminderScheduled");
      setNotificationsEnabled(enabled === "true");
    }
    loadNotificationStatus();
  }, []);

  async function toggleNotifications(value: boolean) {
    setNotificationsEnabled(value);
    if (value) {
      await scheduleWorkoutReminder();
      Alert.alert(
        "Benachrichtigungen aktiviert",
        "Du erhältst täglich um 18:00 Uhr eine Erinnerung für dein Workout!",
      );
    } else {
      await cancelAllNotifications();
      Alert.alert(
        "Benachrichtigungen deaktiviert",
        "Alle Erinnerungen wurden entfernt.",
      );
    }
  }

  const themeOptions = [
    { label: t("systemMode"), value: "system" as const },
    { label: t("lightMode"), value: "light" as const },
    { label: t("darkMode"), value: "dark" as const },
  ];

  const languageOptions = [
    { label: "Deutsch", value: "de" as const },
    { label: "English", value: "en" as const },
  ];

  async function openURL(url: string) {
    await WebBrowser.openBrowserAsync(url);
  }

  function renderSettingSection(title: string, children: React.ReactNode) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
        {children}
      </View>
    );
  }

  function renderDropdown(
    label: string,
    options: Array<{ label: string; value: string }>,
    selectedValue: string,
    onSelect: (value: string) => void,
  ) {
    /*      <Text style={[styles.settingLabel, { color: colors.text }]}>
          {label}
        </Text>*/
    return (
      <View style={styles.settingRow}>
        <View style={styles.dropdownContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownOption,
                {
                  backgroundColor:
                    selectedValue === option.value
                      ? colors.tint + "40"
                      : colors.background,
                  borderColor:
                    selectedValue === option.value
                      ? colors.tint
                      : "transparent",
                  borderWidth: selectedValue === option.value ? 2 : 0,
                },
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  {
                    color:
                      selectedValue === option.value
                        ? colors.tint
                        : colors.text,
                    fontWeight: selectedValue === option.value ? "700" : "500",
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function renderLinkButton(icon: string, label: string, onPress: () => void) {
    return (
      <TouchableOpacity
        style={[
          styles.linkButton,
          { backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5" },
        ]}
        onPress={onPress}
      >
        <View style={styles.linkButtonContent}>
          <FontAwesome name={icon as any} size={18} color={colors.tint} />
          <Text style={[styles.linkButtonText, { color: colors.text }]}>
            {label}
          </Text>
        </View>
        <FontAwesome
          name="chevron-right"
          size={14}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    );
  }

  function renderToggleSetting(
    icon: string,
    label: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void,
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
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#767577", true: colors.tint + "80" }}
          thumbColor={value ? colors.tint : "#f4f3f4"}
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
              {t("settings")}
            </Text>
          </View>

          {/* Theme Selection */}
          {renderSettingSection(
            t("theme"),
            renderDropdown(t("theme"), themeOptions, mode, (value) =>
              setMode(value as any),
            ),
          )}

          {/* Language Selection */}
          {renderSettingSection(
            t("language"),
            renderDropdown(t("language"), languageOptions, language, (value) =>
              setLanguage(value as any),
            ),
          )}

          {/* Notifications */}
          {renderSettingSection(
            "Benachrichtigungen",
            renderToggleSetting(
              "bell",
              "Tägliche Erinnerung",
              "Erhalte täglich um 18:00 Uhr eine Erinnerung",
              notificationsEnabled,
              toggleNotifications,
            ),
          )}

          {/* Links Section */}
          {renderSettingSection(
            "Links",
            <View style={styles.linksContainer}>
              {renderLinkButton("lock", t("privacyPolicy"), () =>
                openURL("https://github.com"),
              )}
              {renderLinkButton("file-text", t("termsOfUse"), () =>
                openURL("https://github.com"),
              )}
            </View>,
          )}

          {/* About Section */}
          {renderSettingSection(
            t("aboutTitle"),
            <View
              style={[
                styles.aboutCard,
                { backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5" },
              ]}
            >
              <View style={styles.aboutHeader}>
                <FontAwesome name="github" size={32} color={colors.tint} />
                <Text style={[styles.aboutText, { color: colors.text }]}>
                  {t("openSource")}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.githubButton, { backgroundColor: colors.tint }]}
                onPress={() => openURL("https://github.com")}
              >
                <FontAwesome name="github" size={18} color="#fff" />
                <Text style={styles.githubButtonText}>{t("viewOnGithub")}</Text>
              </TouchableOpacity>
            </View>,
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "800",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingRow: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dropdownOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownOptionText: {
    fontSize: 13,
    textAlign: "center",
  },
  linksContainer: {
    gap: 10,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  linkButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  linkButtonText: {
    fontSize: 15,
    fontWeight: "500",
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
  aboutCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  aboutHeader: {
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  aboutText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  githubButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  githubButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
