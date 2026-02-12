import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { GlassView } from "expo-glass-effect";
import { memo } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  prominent?: boolean;
  opacity?: number;
}

export const GlassButton = memo(function GlassButton({
  label,
  onPress,
  prominent = false,
  opacity = 1,
}: GlassButtonProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  if (Platform.OS === "ios") {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <GlassView
          glassEffectStyle={prominent ? "regular" : "clear"}
          isInteractive
          style={[
            styles.glassBtn,
            {
              backgroundColor: prominent
                ? theme === "dark"
                  ? "rgba(10,132,255,0.5)"
                  : "rgba(0,122,255,0.4)"
                : theme === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.5)",
              opacity,
            },
          ]}
        >
          <Text
            style={[
              styles.glassBtnText,
              { color: prominent ? "#fff" : colors.accent },
            ]}
          >
            {label}
          </Text>
        </GlassView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.fallback,
        {
          backgroundColor: prominent
            ? colors.accent
            : theme === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.06)",
          opacity,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.fallbackText,
          { color: prominent ? "#fff" : colors.accent },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  glassBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  glassBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  fallback: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
