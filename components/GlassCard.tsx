import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { GlassView } from "expo-glass-effect";
import { Platform, StyleSheet, View, ViewProps } from "react-native";

interface GlassCardProps extends ViewProps {
  variant?: "regular" | "clear";
}

export function GlassCard({
  children,
  style,
  variant = "regular",
  ...props
}: GlassCardProps) {
  const { theme, isDark } = useTheme();
  const colors = Colors[theme];

  if (Platform.OS === "ios") {
    return (
      <GlassView
        glassEffectStyle={variant}
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.45)",
          },
          style,
        ]}
        {...props}
      >
        <View style={styles.content}>{children}</View>
      </GlassView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderWidth: StyleSheet.hairlineWidth,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
  },
  content: {
    padding: 16,
  },
});
