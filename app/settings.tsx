import Colors from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { theme, isDark, mode, setMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const colors = Colors[theme];

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
    return (
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          {label}
        </Text>
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

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          {t("settings")}
        </Text>

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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 24,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
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
