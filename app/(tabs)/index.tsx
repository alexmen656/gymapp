import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import {
  addExercise,
  deleteExercise,
  getAllEntries,
  getExercises,
  groupByExercise,
} from "@/storage/workoutStorage";
import { ExerciseGroup } from "@/types/workout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  const { theme, isDark } = useTheme();
  const colors = Colors[theme];
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
    Alert.alert("Gerät löschen?", `\u201E${name}\u201C und alle Einträge löschen?`, [
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
        onPress={() =>
          router.push({
            pathname: "/exercise/[name]",
            params: { name: item.name },
          })
        }
        onLongPress={() => handleLongPress(item.name)}
        activeOpacity={0.7}
      >
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome
              name="trophy"
              size={18}
              color={isDark ? "#fbbf24" : "#f59e0b"}
              style={styles.icon}
            />
            <Text style={[styles.exerciseName, { color: colors.text }]}>
              {item.name}
            </Text>
          </View>
          {g ? (
            <>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {g.lastWeight}
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    kg
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {g.lastReps}
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Wdh
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {g.entries.length}
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Einträge
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.lastDate, { color: colors.textSecondary }]}
              >
                Zuletzt: {formatDate(g.lastDate)}
              </Text>
            </>
          ) : (
            <Text
              style={[styles.noEntries, { color: colors.textSecondary }]}
            >
              Noch keine Einträge – tippe zum Hinzufügen
            </Text>
          )}
        </GlassCard>
      </TouchableOpacity>
    );
  }

  // FAB: GlassView on iOS, colored button on Android
  const fabContent = (
    <FontAwesome name="plus" size={24} color={isDark ? "#fff" : "#007AFF"} />
  );

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="plus-circle"
            size={64}
            color={isDark ? "#555" : "#ccc"}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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

      {/* FAB with glass effect on iOS */}
      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
        style={styles.fabWrapper}
      >
        {Platform.OS === "ios" ? (
          <GlassView glassEffectStyle="regular" style={styles.fabGlass}>
            {fabContent}
          </GlassView>
        ) : (
          <View style={[styles.fabFallback, { backgroundColor: colors.accent }]}>
            {fabContent}
          </View>
        )}
      </TouchableOpacity>

      {/* Add Exercise Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
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
              <GlassButton
                label="Abbrechen"
                onPress={() => {
                  setNewName("");
                  setShowAddModal(false);
                }}
              />
              <GlassButton
                label="Hinzufügen"
                onPress={handleAddExercise}
                prominent
              />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingTop: 100,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
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
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  lastDate: {
    fontSize: 12,
    textAlign: "right",
  },
  noEntries: {
    fontSize: 13,
    fontStyle: "italic",
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
    textAlign: "center",
    lineHeight: 24,
  },
  fabWrapper: {
    position: "absolute",
    bottom: 100,
    right: 24,
  },
  fabGlass: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  fabFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
