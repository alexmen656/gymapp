import {
  addExercise,
  deleteExercise,
  getAllEntries,
  getExercises,
  groupByExercise,
} from "@/storage/workoutStorage";
import { ExerciseGroup } from "@/types/workout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface ExerciseItem {
  name: string;
  group: ExerciseGroup | null;
}

export default function HomeScreen() {
  const [items, setItems] = useState<ExerciseItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function loadData() {
    const [exercises, entries] = await Promise.all([
      getExercises(),
      getAllEntries(),
    ]);
    const groups = groupByExercise(entries);

    // Merge: every saved exercise shows up, with group data if available
    const result: ExerciseItem[] = exercises.map((name) => ({
      name,
      group:
        groups.find((g) => g.exercise.toLowerCase() === name.toLowerCase()) ??
        null,
    }));

    setItems(result);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function handleAddExercise() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await addExercise(trimmed);
    setNewName("");
    setShowAddModal(false);
    loadData();
  }

  function handleLongPress(name: string) {
    Alert.alert("Gerät löschen?", `„${name}" und alle Einträge löschen?`, [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          await deleteExercise(name);
          loadData();
        },
      },
    ]);
  }

  function renderItem({ item }: { item: ExerciseItem }) {
    const g = item.group;
    return (
      <TouchableOpacity
        style={[styles.card, isDark && styles.cardDark]}
        onPress={() =>
          router.push({
            pathname: "/exercise/[name]",
            params: { name: item.name },
          })
        }
        onLongPress={() => handleLongPress(item.name)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <FontAwesome
            name="trophy"
            size={18}
            color={isDark ? "#fbbf24" : "#f59e0b"}
            style={styles.icon}
          />
          <Text style={[styles.exerciseName, isDark && styles.textDark]}>
            {item.name}
          </Text>
        </View>
        {g ? (
          <>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statValue, isDark && styles.textDark]}>
                  {g.lastWeight}
                </Text>
                <Text style={[styles.statLabel, isDark && styles.subTextDark]}>
                  kg
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statValue, isDark && styles.textDark]}>
                  {g.lastReps}
                </Text>
                <Text style={[styles.statLabel, isDark && styles.subTextDark]}>
                  Wdh
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statValue, isDark && styles.textDark]}>
                  {g.entries.length}
                </Text>
                <Text style={[styles.statLabel, isDark && styles.subTextDark]}>
                  Einträge
                </Text>
              </View>
            </View>
            <Text style={[styles.lastDate, isDark && styles.subTextDark]}>
              Zuletzt: {formatDate(g.lastDate)}
            </Text>
          </>
        ) : (
          <Text style={[styles.noEntries, isDark && styles.subTextDark]}>
            Noch keine Einträge – tippe zum Hinzufügen
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="plus-circle"
            size={64}
            color={isDark ? "#555" : "#ccc"}
          />
          <Text style={[styles.emptyText, isDark && styles.subTextDark]}>
            Noch keine Geräte.{"\n"}Tippe + um ein Gerät hinzuzufügen!
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB to add new exercise */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Exercise Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, isDark && styles.modalContentDark]}
          >
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>
              Neues Gerät
            </Text>
            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder="z.B. Bankdrücken, Beinpresse..."
              placeholderTextColor={isDark ? "#666" : "#aaa"}
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
              autoFocus
              onSubmitEditing={handleAddExercise}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  setNewName("");
                  setShowAddModal(false);
                }}
              >
                <Text
                  style={[styles.modalCancelText, isDark && styles.subTextDark]}
                >
                  Abbrechen
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleAddExercise}
              >
                <Text style={styles.modalSaveText}>Hinzufügen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  containerDark: {
    backgroundColor: "#111",
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#1e1e1e",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  lastDate: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  noEntries: {
    fontSize: 13,
    color: "#aaa",
    fontStyle: "italic",
  },
  textDark: {
    color: "#f0f0f0",
  },
  subTextDark: {
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2f95dc",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2f95dc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 360,
  },
  modalContentDark: {
    backgroundColor: "#1e1e1e",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#1a1a1a",
  },
  modalInputDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#444",
    color: "#f0f0f0",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },
  modalCancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    fontSize: 15,
    color: "#888",
  },
  modalSave: {
    backgroundColor: "#2f95dc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
