import {
    createEntry,
    deleteEntry,
    getAllEntries,
    saveEntry,
} from "@/storage/workoutStorage";
import { WorkoutEntry } from "@/types/workout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

export default function ExerciseDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [name]),
  );

  async function loadData() {
    const all = await getAllEntries();
    const filtered = all.filter(
      (e) => e.exercise.toLowerCase() === name?.toLowerCase(),
    );
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    setEntries(filtered);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatShortDate(d: Date) {
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function handleAdd() {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert("Fehler", "Bitte gültiges Gewicht eingeben.");
      return;
    }
    if (!reps || isNaN(Number(reps)) || Number(reps) <= 0) {
      Alert.alert("Fehler", "Bitte gültige Wiederholungen eingeben.");
      return;
    }

    const entry = createEntry(name || "", Number(weight), Number(reps), date);
    await saveEntry(entry);
    setWeight("");
    setReps("");
    setDate(new Date());
    loadData();
  }

  function onDateChange(_: any, selectedDate?: Date) {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  }

  function handleDelete(entry: WorkoutEntry) {
    Alert.alert(
      "Eintrag löschen?",
      `${entry.weight}kg × ${entry.reps} Wdh am ${formatDate(entry.date)}`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            await deleteEntry(entry.id);
            loadData();
          },
        },
      ],
    );
  }

  // Find personal best (max weight)
  const maxWeight =
    entries.length > 0 ? Math.max(...entries.map((e) => e.weight)) : 0;

  function renderItem({ item }: { item: WorkoutEntry }) {
    const isBest = item.weight === maxWeight;
    return (
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <View style={styles.weightRow}>
              <Text style={[styles.weightText, isDark && styles.textDark]}>
                {item.weight} kg
              </Text>
              <Text style={[styles.repsText, isDark && styles.subTextDark]}>
                × {item.reps} Wdh
              </Text>
              {isBest && (
                <View style={styles.bestBadge}>
                  <Text style={styles.bestText}>🏆 PR</Text>
                </View>
              )}
            </View>
            <Text style={[styles.dateLabel, isDark && styles.subTextDark]}>
              {formatDate(item.date)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.deleteBtn}
          >
            <FontAwesome name="trash-o" size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const headerComponent = (
    <>
      {/* Inline Add Form */}
      <View style={[styles.addForm, isDark && styles.addFormDark]}>
        <Text style={[styles.addTitle, isDark && styles.textDark]}>
          Neuer Eintrag
        </Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isDark && styles.subTextDark]}>
              kg
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="0"
              placeholderTextColor={isDark ? "#666" : "#aaa"}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isDark && styles.subTextDark]}>
              Wdh
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="0"
              placeholderTextColor={isDark ? "#666" : "#aaa"}
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.dateRow}
          onPress={() => setShowDatePicker(true)}
        >
          <FontAwesome
            name="calendar"
            size={14}
            color={isDark ? "#888" : "#666"}
          />
          <Text style={[styles.datePickerText, isDark && styles.subTextDark]}>
            {formatShortDate(date)}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              maximumDate={new Date()}
              locale="de"
            />
            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneText}>Fertig</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>💪 Speichern</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      {entries.length > 0 && (
        <View style={[styles.summary, isDark && styles.summaryDark]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, isDark && styles.textDark]}>
              {entries.length}
            </Text>
            <Text style={[styles.summaryLabel, isDark && styles.subTextDark]}>
              Einträge
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, isDark && styles.textDark]}>
              {maxWeight} kg
            </Text>
            <Text style={[styles.summaryLabel, isDark && styles.subTextDark]}>
              Max Gewicht
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, isDark && styles.textDark]}>
              {Math.max(...entries.map((e) => e.reps))}
            </Text>
            <Text style={[styles.summaryLabel, isDark && styles.subTextDark]}>
              Max Wdh
            </Text>
          </View>
        </View>
      )}

      {entries.length > 0 && (
        <Text style={[styles.historyTitle, isDark && styles.textDark]}>
          Verlauf
        </Text>
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <Stack.Screen options={{ title: name || "Übung" }} />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.subTextDark]}>
              Füge deinen ersten Eintrag oben hinzu!
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
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
    paddingBottom: 32,
  },
  addForm: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addFormDark: {
    backgroundColor: "#1e1e1e",
  },
  addTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#1a1a1a",
  },
  inputDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#444",
    color: "#f0f0f0",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  datePickerText: {
    fontSize: 14,
    color: "#666",
  },
  doneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  doneText: {
    color: "#2f95dc",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#2f95dc",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 14,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryDark: {
    backgroundColor: "#1e1e1e",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardDark: {
    backgroundColor: "#1e1e1e",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  weightText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  repsText: {
    fontSize: 15,
    color: "#555",
    marginLeft: 4,
  },
  bestBadge: {
    backgroundColor: "#fef3c7",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  bestText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400e",
  },
  dateLabel: {
    fontSize: 12,
    color: "#999",
  },
  deleteBtn: {
    padding: 8,
  },
  textDark: {
    color: "#f0f0f0",
  },
  subTextDark: {
    color: "#888",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
  },
});
