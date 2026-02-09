import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GlassView } from "expo-glass-effect";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

function ThemeToggle() {
  const { mode, cycleMode, isDark } = useTheme();
  const iconName =
    mode === "system" ? "circle-o" : mode === "dark" ? "moon-o" : "sun-o";

  return (
    <TouchableOpacity onPress={cycleMode} style={styles.themeToggle}>
      <FontAwesome
        name={iconName}
        size={20}
        color={isDark ? "#fff" : "#1a1a1a"}
      />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const colors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: true,
        headerRight: () => <ThemeToggle />,
        headerStyle: {
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
        },
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
          },
          default: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
          },
        }),
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <GlassView
              glassEffectStyle="regular"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Geräte",
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Verlauf",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="history" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    marginRight: 16,
    padding: 8,
  },
});
