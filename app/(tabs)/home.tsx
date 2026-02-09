import { GlassCard } from "@/components/GlassCard";
import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { deleteEntry, getAllEntries } from "@/storage/workoutStorage";
import { WorkoutEntry } from "@/types/workout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HistoryScreen() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const { theme, isDark } = useTheme();
  const colors = Colors[theme];

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function loadData() {
    const all = await getAllEntries();
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
      <GlassCard style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.exerciseName, { color: colors.text }]}>
              {item.exercise}
            </Text>
            <Text style={[styles.details, { color: colors.textSecondary }]}>
              {item.weight} kg × {item.reps} Wdh
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatDate(item.date)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.deleteBtn}
          >
            <FontAwesome name="trash-o" size={20} color={colors.destructive} />
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="calendar-o"
            size={64}
            color={isDark ? "#555" : "#ccc"}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
          ListHeaderComponent={
            <Text style={[styles.screenTitle, { color: colors.text }]}>
              Verlauf
            </Text>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 16,
  },
  list: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  details: {
    fontSize: 15,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
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
  },
});
