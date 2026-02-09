import { Button, Host } from "@expo/ui/swift-ui";
import { buttonStyle } from "@expo/ui/swift-ui/modifiers";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  prominent?: boolean;
  size?: "small" | "regular" | "large" | "extraLarge";
}

export function GlassButton({
  label,
  onPress,
  prominent = false,
  size = "large",
}: GlassButtonProps) {
  if (Platform.OS === "ios") {
    return (
      <Host matchContents style={styles.host}>
        <Button
          onPress={onPress}
          variant={prominent ? "glassProminent" : "glass"}
          controlSize={size}
          modifiers={[
            buttonStyle(prominent ? "glassProminent" : "glass"),
          ]}
        >
          {label}
        </Button>
      </Host>
    );
  }

  // Android fallback
  return (
    <TouchableOpacity
      style={[styles.fallback, prominent && styles.fallbackProminent]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.fallbackText,
          prominent && styles.fallbackTextProminent,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: "stretch",
  },
  fallback: {
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    backgroundColor: "rgba(120, 120, 128, 0.16)",
  },
  fallbackProminent: {
    backgroundColor: "#007AFF",
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  fallbackTextProminent: {
    color: "#fff",
  },
});
