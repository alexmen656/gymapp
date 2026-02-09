import { GlassCard } from "@/components/GlassCard";
import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { getAllEntries } from "@/storage/workoutStorage";
import { WorkoutEntry } from "@/types/workout";
import {
  analyzeWeightProgression,
  getExerciseChartData,
  getTopExercisesByVolume,
  getWorkoutStats,
} from "@/utils/analytics";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function HomeScreen() {
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

  const stats = getWorkoutStats(entries);
  const progressionSuggestions = analyzeWeightProgression(entries);
  const topExercises = getTopExercisesByVolume(entries, 3);

  const screenWidth = Dimensions.get("window").width;

  function renderProgressionAlert() {
    if (progressionSuggestions.length === 0) return null;

    return (
      <GlassCard
        style={[
          styles.alertCard,
          { borderLeftColor: colors.tint, borderLeftWidth: 4 },
        ]}
      >
        <View style={styles.alertHeader}>
          <FontAwesome name="arrow-circle-up" size={24} color={colors.tint} />
          <Text style={[styles.alertTitle, { color: colors.text }]}>
            Bereit für mehr?
          </Text>
        </View>
        {progressionSuggestions.slice(0, 2).map((suggestion, index) => (
          <View key={index} style={styles.suggestion}>
            <Text style={[styles.suggestionText, { color: colors.text }]}>
              <Text style={{ fontWeight: "700" }}>{suggestion.exercise}</Text>:
              5× bei {suggestion.currentWeight}kg → Versuche{" "}
              {suggestion.suggestedWeight}kg! 💪
            </Text>
          </View>
        ))}
      </GlassCard>
    );
  }

  function renderStats() {
    return (
      <View style={styles.statsGrid}>
        <GlassCard style={styles.statCard}>
          <FontAwesome name="trophy" size={24} color={colors.tint} />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {stats.totalWorkouts}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Workouts
          </Text>
        </GlassCard>

        <GlassCard style={styles.statCard}>
          <FontAwesome name="fire" size={24} color="#FF6B6B" />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {Math.round(stats.totalVolume / 1000)}k
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total kg
          </Text>
        </GlassCard>

        <GlassCard style={styles.statCard}>
          <FontAwesome name="list" size={24} color="#4ECDC4" />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {stats.uniqueExercises}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Übungen
          </Text>
        </GlassCard>
      </View>
    );
  }

  function renderTopExercises() {
    if (topExercises.length === 0) return null;

    return (
      <GlassCard style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Top Übungen (Volumen)
        </Text>
        {topExercises.map((item, index) => (
          <View key={index} style={styles.topExerciseRow}>
            <View
              style={[
                styles.rankBadge,
                { backgroundColor: colors.tint + "40" },
              ]}
            >
              <Text style={[styles.rankText, { color: colors.tint }]}>
                {index + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.topExerciseName, { color: colors.text }]}>
                {item.exercise}
              </Text>
            </View>
            <Text style={[styles.volumeText, { color: colors.textSecondary }]}>
              {Math.round(item.volume)} kg
            </Text>
          </View>
        ))}
      </GlassCard>
    );
  }

  function renderChart() {
    if (topExercises.length === 0 || entries.length < 5) return null;

    const topExercise = topExercises[0].exercise;
    const chartData = getExerciseChartData(entries, topExercise, 10);

    if (chartData.data.length < 2) return null;

    return (
      <GlassCard style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Trend: {topExercise}
        </Text>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: chartData.data }],
          }}
          width={screenWidth - 64}
          height={200}
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: isDark ? "#1a1a1a" : "#f0f0f0",
            backgroundGradientTo: isDark ? "#2a2a2a" : "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => {
              const hex = colors.tint.replace("#", "");
              const alpha = Math.round(opacity * 255)
                .toString(16)
                .padStart(2, "0");
              return `#${hex}${alpha}`;
            },
            labelColor: (opacity = 1) => {
              const hex = colors.textSecondary.replace("#", "");
              const alpha = Math.round(opacity * 255)
                .toString(16)
                .padStart(2, "0");
              return `#${hex}${alpha}`;
            },
            style: { borderRadius: 16 },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: colors.tint,
            },
          }}
          bezier
          style={styles.chart}
        />
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
            name="line-chart"
            size={64}
            color={isDark ? "#555" : "#ccc"}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Starte dein erstes Workout!
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Deine Analytics werden hier angezeigt
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.screenTitle, { color: colors.text }]}>
            Hello, Alex! 👋
          </Text>

          {renderProgressionAlert()}
          {renderStats()}
          {renderChart()}
          {renderTopExercises()}
        </ScrollView>
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
    marginBottom: 20,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 32,
  },
  alertCard: {
    marginBottom: 16,
    padding: 16,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  suggestion: {
    marginTop: 4,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    minWidth: 0,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  topExerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontSize: 14,
    fontWeight: "700",
  },
  topExerciseName: {
    fontSize: 15,
    fontWeight: "600",
  },
  volumeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
