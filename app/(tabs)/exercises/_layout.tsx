import { Stack } from "expo-router";

export default function ExercisesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Exercises" }}
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
