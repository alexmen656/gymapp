import { Stack } from "expo-router";

export default function MachinesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Machines" }}
      />
      <Stack.Screen
        name="exercise/[name]"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
