import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { GlassView } from "expo-glass-effect";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  prominent?: boolean;
}

export function GlassButton({
  label,
  onPress,
  prominent = false,
}: GlassButtonProps) {
  const { theme, isDark } = useTheme();
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
                ? isDark
                  ? "rgba(10,132,255,0.5)"
                  : "rgba(0,122,255,0.4)"
                : isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.5)",
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
            : isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.06)",
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
}

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
