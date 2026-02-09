import { deleteEntry, getAllEntries } from "@/storage/workoutStorage";
import { WorkoutEntry } from "@/types/workout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

export default function HistoryScreen() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function loadData() {
    const all = await getAllEntries();
    // Sort by date descending
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEntries(all);
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

  function handleDelete(entry: WorkoutEntry) {
    Alert.alert(
      "Eintrag löschen?",
      `${entry.exercise}: ${entry.weight}kg × ${entry.reps} Wdh`,
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

  function renderItem({ item }: { item: WorkoutEntry }) {
    return (
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.exerciseName, isDark && styles.textDark]}>
              {item.exercise}
            </Text>
            <Text style={[styles.details, isDark && styles.subTextDark]}>
              {item.weight} kg × {item.reps} Wdh
            </Text>
            <Text style={[styles.date, isDark && styles.subTextDark]}>
              {formatDate(item.date)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.deleteBtn}
          >
            <FontAwesome name="trash-o" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="calendar-o"
            size={64}
            color={isDark ? "#555" : "#ccc"}
          />
          <Text style={[styles.emptyText, isDark && styles.subTextDark]}>
            Noch keine Trainingseinträge.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#1e1e1e",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  details: {
    fontSize: 15,
    color: "#555",
    marginBottom: 2,
  },
  date: {
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
  },
});
