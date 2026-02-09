import { ExerciseGroup, WorkoutEntry } from "@/types/workout";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "gym_logbook_entries";
const EXERCISES_KEY = "gym_logbook_exercises";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

export async function getExercises(): Promise<string[]> {
  try {
    const json = await AsyncStorage.getItem(EXERCISES_KEY);
    if (!json) return [];
    return JSON.parse(json) as string[];
  } catch {
    return [];
  }
}

export async function addExercise(name: string): Promise<void> {
  const exercises = await getExercises();
  const trimmed = name.trim();
  if (!exercises.some((e) => e.toLowerCase() === trimmed.toLowerCase())) {
    exercises.push(trimmed);
    exercises.sort((a, b) => a.localeCompare(b));
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  }
}

export async function deleteExercise(name: string): Promise<void> {
  const exercises = await getExercises();
  const filtered = exercises.filter(
    (e) => e.toLowerCase() !== name.toLowerCase(),
  );
  await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(filtered));
  // Also delete all entries for this exercise
  const entries = await getAllEntries();
  const remaining = entries.filter(
    (e) => e.exercise.toLowerCase() !== name.toLowerCase(),
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}

export async function getAllEntries(): Promise<WorkoutEntry[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    return JSON.parse(json) as WorkoutEntry[];
  } catch {
    return [];
  }
}

export async function saveEntry(entry: WorkoutEntry): Promise<void> {
  const entries = await getAllEntries();
  entries.push(entry);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createEntry(
  exercise: string,
  weight: number,
  reps: number,
  date: Date,
): WorkoutEntry {
  return {
    id: generateId(),
    exercise: exercise.trim(),
    weight,
    reps,
    date: date.toISOString(),
  };
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getAllEntries();
  const filtered = entries.filter((e) => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function groupByExercise(entries: WorkoutEntry[]): ExerciseGroup[] {
  const map = new Map<string, WorkoutEntry[]>();

  for (const entry of entries) {
    const key = entry.exercise.toLowerCase().trim();
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(entry);
  }

  const groups: ExerciseGroup[] = [];

  Array.from(map.entries()).forEach(([, items]) => {
    // Sort by date descending
    items.sort(
      (a: WorkoutEntry, b: WorkoutEntry) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const latest = items[0];
    groups.push({
      exercise: latest.exercise,
      entries: items,
      lastWeight: latest.weight,
      lastReps: latest.reps,
      lastDate: latest.date,
    });
  });

  // Sort groups alphabetically
  groups.sort((a, b) => a.exercise.localeCompare(b.exercise));

  return groups;
}
