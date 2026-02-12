import { useLanguage } from "@/contexts/LanguageContext";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>{t("home")}</Label>
        <Icon sf="house" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="exercises">
        <Label>{t("exercises")}</Label>
        <Icon sf="dumbbell" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <Icon
          sf="clock.arrow.trianglehead.counterclockwise.rotate.90"
          drawable="custom_settings_drawable"
        />
        <Label>{t("history")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="add" role="search">
        <Label>{t("add")}</Label>
        <Icon sf="plus" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
