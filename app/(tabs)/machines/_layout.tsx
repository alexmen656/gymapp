import { useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function MachinesLayout() {
  const { isDark } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Machines" }}
      />
      <Stack.Screen
        name="exercise/[name]"
        options={{
          /* headerShown: false,
          headerTransparent: true,
          headerBlurEffect: isDark ? "dark" : "light",
          headerTintColor: isDark ? "#fff" : "#000",
          headerStyle: { backgroundColor: "transparent" },*/

          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
