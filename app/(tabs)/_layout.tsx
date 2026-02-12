import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="machines">
        <Label>Machines</Label>
        <Icon sf="dumbbell" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <Icon
          sf="clock.arrow.trianglehead.counterclockwise.rotate.90"
          drawable="custom_settings_drawable"
        />
        <Label>History</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="add" role="search">
        <Label>Add</Label>
        <Icon sf="plus" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
