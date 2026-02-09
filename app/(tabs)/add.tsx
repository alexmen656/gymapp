import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { addExercise } from "@/storage/workoutStorage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const { theme, isDark } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();

  // Automatically show the modal when this screen is focused
  useEffect(() => {
    setShowAddModal(true);
  }, []);

  async function handleAddExercise() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await addExercise(trimmed);
    setNewName("");
    setShowAddModal(false);
    // Navigate back to home after adding
    router.replace("/(tabs)/");
  }

  function handleModalClose() {
    setShowAddModal(false);
    // Navigate back to home when modal is closed
    router.replace("/(tabs)/");
  }

  return (
    <View style={styles.container}>
      {/* Add Exercise Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: colors.modalOverlay },
          ]}
        >
          <GlassCard style={styles.modalCard} variant="regular">
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Neues Gerät
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="z.B. Bankdrücken, Beinpresse..."
              placeholderTextColor={colors.textSecondary}
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
              autoFocus
              onSubmitEditing={handleAddExercise}
            />
            <View style={styles.modalButtons}>
              <GlassButton label="Abbrechen" onPress={handleModalClose} />
              <GlassButton
                label="Hinzufügen"
                onPress={handleAddExercise}
                prominent
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  modalInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },
});
