import { GlassCard } from "@/components/GlassCard";
import Colors from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import {
  createEntry,
  deleteEntry,
  getAllEntries,
  saveEntry,
} from "@/storage/workoutStorage";
import { WorkoutEntry } from "@/types/workout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { theme, isDark } = useTheme();
  const colors = Colors[theme];

  const isFilled = useMemo(
    () => !!(weight.trim() && reps.trim()),
    [weight, reps],
  );

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

  const maxWeight =
    entries.length > 0 ? Math.max(...entries.map((e) => e.weight)) : 0;

  const screenWidth = Dimensions.get("window").width;

  function getChartData(type: "weight" | "reps" | "volume") {
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const recentEntries = sortedEntries.slice(-10);

    const data = recentEntries.map((e) => {
      if (type === "weight") return e.weight;
      if (type === "reps") return e.reps;
      return e.weight * e.reps;
    });

    const labels = recentEntries.map((e) => {
      const d = new Date(e.date);
      return `${d.getDate()}.${d.getMonth() + 1}`;
    });

    return { data, labels };
  }

  function renderChart(
    title: string,
    type: "weight" | "reps" | "volume",
    unit: string,
  ) {
    if (entries.length < 5) return null;

    const chartData = getChartData(type);
    if (chartData.data.length < 2) return null;

    return (
      <GlassCard style={styles.chartCard}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>{title}</Text>
        <View style={{ marginLeft: -40, marginRight: -16 }}>
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.data }],
            }}
            width={screenWidth - 8}
            height={220}
            chartConfig={{
              backgroundColor: "rgba(0,0,0,0)",
              backgroundGradientFrom: "rgba(0,0,0,0)",
              backgroundGradientTo: "rgba(0,0,0,0)",
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              decimalPlaces: type === "volume" ? 0 : 1,
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
              strokeWidth: 5,
              propsForBackgroundLines: {
                strokeDasharray: "",
                stroke: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              },
              propsForDots: {
                r: "0",
              },
              paddingRight: 0,
            }}
            bezier
            style={styles.chart}
            withDots={false}
            withHorizontalLabels={false}
            transparent
          />
        </View>
        <Text style={[styles.chartUnit, { color: colors.textSecondary }]}>
          {unit}
        </Text>
      </GlassCard>
    );
  }

  function renderItem({ item }: { item: WorkoutEntry }) {
    const isBest = item.weight === maxWeight;
    return (
      <GlassCard style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <View style={styles.weightRow}>
              <Text style={[styles.weightText, { color: colors.text }]}>
                {item.weight} kg
              </Text>
              <Text style={[styles.repsText, { color: colors.textSecondary }]}>
                × {item.reps} Wdh
              </Text>
              {isBest && (
                <View
                  style={[
                    styles.bestBadge,
                    {
                      backgroundColor: isDark
                        ? "rgba(251, 191, 36, 0.2)"
                        : "#fef3c7",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bestText,
                      { color: isDark ? "#fbbf24" : "#92400e" },
                    ]}
                  >
                    PR
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
              {formatDate(item.date)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.deleteBtn}
          >
            <FontAwesome name="trash-o" size={18} color={colors.destructive} />
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  }

  const headerComponent = (
    <>
      <Text style={[styles.screenTitle, { color: colors.text }]}>{name}</Text>
      <GlassCard style={styles.addForm} variant="regular">
        <Text style={[styles.addTitle, { color: colors.text }]}>
          Neuer Eintrag
        </Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Gewicht (kg)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.1)",
                  color: colors.text,
                },
              ]}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Wiederholungen
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.1)",
                  color: colors.text,
                },
              ]}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
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
          <FontAwesome name="calendar" size={14} color={colors.textSecondary} />
          <Text
            style={[styles.datePickerText, { color: colors.textSecondary }]}
          >
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
                <Text style={[styles.doneText, { color: colors.accent }]}>
                  Fertig
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.saveWrapper}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: colors.accent,
                opacity: isFilled ? 1 : 0.5,
              },
            ]}
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Speichern</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      {entries.length > 0 && (
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {entries.length}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                Einträge
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {maxWeight} kg
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                Max Gewicht
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {Math.max(...entries.map((e) => e.reps))}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                Max Wdh
              </Text>
            </View>
          </View>
        </GlassCard>
      )}

      {entries.length >= 5 && (
        <>
          {renderChart("Gewicht Progression", "weight", "Kilogramm")}
          {renderChart("Wiederholungen", "reps", "Anzahl")}
          {renderChart("Volumen", "volume", "kg × Wdh")}
        </>
      )}

      {entries.length > 0 && (
        <Text style={[styles.historyTitle, { color: colors.text }]}>
          Verlauf
        </Text>
      )}
    </>
  );

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <Stack.Screen options={{ title: name || "Übung" }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
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
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  Füge deinen ersten Eintrag oben hinzu!
                </Text>
              </View>
            }
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    marginTop: -16,
    marginBottom: 24,
  },
  list: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  addForm: {
    marginBottom: 16,
  },
  addTitle: {
    fontSize: 17,
    fontWeight: "700",
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
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 8,
  },
  datePickerText: {
    fontSize: 14,
  },
  doneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  doneText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveWrapper: {
    marginTop: 16,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  chartCard: {
    marginBottom: 16,
    overflow: "hidden",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -16,
  },
  chartUnit: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    marginBottom: 8,
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
  },
  repsText: {
    fontSize: 15,
    marginLeft: 4,
  },
  bestBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  bestText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateLabel: {
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
  },
});
