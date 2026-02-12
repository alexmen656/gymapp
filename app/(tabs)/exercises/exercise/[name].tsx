import { GlassCard } from "@/components/GlassCard";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
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
    ScrollView,
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
  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
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
    return d.toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatShortDate(d: Date) {
    return d.toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function handleAdd() {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert(t("error"), t("invalidWeight"));
      return;
    }
    if (!reps || isNaN(Number(reps)) || Number(reps) <= 0) {
      Alert.alert(t("error"), t("invalidReps"));
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
      t("deleteEntry"),
      `${entry.weight}${t("kg")} × ${entry.reps} ${t("reps")} ${language === "de" ? "am" : "on"} ${formatDate(entry.date)}`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
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
      <View style={{ width: screenWidth - 32 }}>
        <GlassCard style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            {title}
          </Text>
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
                  stroke:
                    theme === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
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
      </View>
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
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(251, 191, 36, 0.2)"
                          : "#fef3c7",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bestText,
                      { color: theme === "dark" ? "#fbbf24" : "#92400e" },
                    ]}
                  >
                    <FontAwesome name="trophy" size={16} color={colors.text} />
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
          {t("newEntry")}
        </Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              {t("weight")} ({t("kg")})
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                  borderColor:
                    theme === "dark"
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
              {t("repetitions")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                  borderColor:
                    theme === "dark"
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
              locale={language === "de" ? "de" : "en"}
            />
            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={[styles.doneText, { color: colors.accent }]}>
                  {language === "de" ? "Fertig" : "Done"}
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
            <Text style={styles.saveButtonText}>{t("addEntry")}</Text>
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
                {t("entries")}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {maxWeight} {t("kg")}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                {language === "de" ? "Max Gewicht" : "Max Weight"}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {Math.max(...entries.map((e) => e.reps))}
              </Text>
              <Text
                style={[styles.summaryLabel, { color: colors.textSecondary }]}
              >
                {language === "de" ? "Max Wdh" : "Max Reps"}
              </Text>
            </View>
          </View>
        </GlassCard>
      )}

      {entries.length >= 5 && (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / (screenWidth - 32));
              setActiveChartIndex(index);
            }}
            scrollEventThrottle={16}
            contentContainerStyle={styles.chartsContainer}
          >
            {renderChart(t("weightTrend"), "weight", t("kilogram"))}
            {renderChart(
              t("repsTrend"),
              "reps",
              language === "de" ? "Anzahl" : "Count",
            )}
            {renderChart(
              t("volumeTrend"),
              "volume",
              `${t("kg")} × ${t("reps")}`,
            )}
          </ScrollView>
          <View style={styles.paginationDots}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      activeChartIndex === index
                        ? colors.tint
                        : theme === "dark"
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.2)",
                  },
                ]}
              />
            ))}
          </View>
        </>
      )}

      {entries.length > 0 && (
        <Text style={[styles.historyTitle, { color: colors.text }]}>
          {t("historyTitle")}
        </Text>
      )}
    </>
  );

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <Stack.Screen options={{ title: name || t("exercisesTitle") }} />
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
                  {t("noEntriesDesc")}
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
    fontSize: 20,
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
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  chartsContainer: {
    /*paddingHorizontal: 16,*/
    gap: 0,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chartCard: {
    marginBottom: 2,
    overflow: "hidden",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
    marginLeft: -16,
  },
  chartUnit: {
    fontSize: 14,
    textAlign: "center",
    /*marginTop: 4,*/
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
