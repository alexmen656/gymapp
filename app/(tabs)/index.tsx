import { GlassCard } from "@/components/GlassCard";
import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import {
  deleteExercise,
  getAllEntries,
  getExercises,
  groupByExercise,
} from "@/storage/workoutStorage";
import { ExerciseGroup } from "@/types/workout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ExerciseItem {
  name: string;
  group: ExerciseGroup | null;
}

export default function HomeScreen() {
  const [items, setItems] = useState<ExerciseItem[]>([]);
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

  function handleLongPress(name: string) {
    Alert.alert(
      "Gerät löschen?",
      `\u201E${name}\u201C und alle Einträge löschen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            await deleteExercise(name);
            loadData();
          },
        },
      ],
    );
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
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    kg
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {g.lastReps}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Wdh
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {g.entries.length}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Einträge
                  </Text>
                </View>
              </View>
              <Text style={[styles.lastDate, { color: colors.textSecondary }]}>
                Zuletzt: {formatDate(g.lastDate)}
              </Text>
            </>
          ) : (
            <Text style={[styles.noEntries, { color: colors.textSecondary }]}>
              Noch keine Einträge – tippe zum Hinzufügen
            </Text>
          )}
        </GlassCard>
      </TouchableOpacity>
    );
  }

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
          ListHeaderComponent={
            <Text style={[styles.screenTitle, { color: colors.text }]}>
              Geräte
            </Text>
          }
        />
      )}

      {/* Closing tag for main return */}
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
    paddingTop: 40,
    paddingBottom: 120,
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
});
