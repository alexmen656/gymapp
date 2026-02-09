import { WorkoutEntry } from "@/types/workout";

export interface ExerciseTrend {
  exercise: string;
  lastFiveWeights: number[];
  lastFiveDates: string[];
  shouldIncrease: boolean;
  currentWeight: number;
  suggestedWeight: number;
}

export interface WorkoutStats {
  totalWorkouts: number;
  uniqueExercises: number;
  mostFrequentExercise: string;
  totalVolume: number; // weight * reps
  lastWorkoutDate?: string;
}

/**
 * Analyzes if user should increase weight for an exercise
 * Returns true if last 5 entries have the same weight
 */
export function analyzeWeightProgression(
  entries: WorkoutEntry[],
): ExerciseTrend[] {
  const exerciseGroups = new Map<string, WorkoutEntry[]>();

  // Group entries by exercise
  entries.forEach((entry) => {
    if (!exerciseGroups.has(entry.exercise)) {
      exerciseGroups.set(entry.exercise, []);
    }
    exerciseGroups.get(entry.exercise)!.push(entry);
  });

  const trends: ExerciseTrend[] = [];

  exerciseGroups.forEach((exerciseEntries, exerciseName) => {
    // Sort by date descending (most recent first)
    const sorted = exerciseEntries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    if (sorted.length >= 5) {
      const lastFive = sorted.slice(0, 5);
      const weights = lastFive.map((e) => e.weight);
      const dates = lastFive.map((e) => e.date);
      const currentWeight = weights[0];

      // Check if all 5 have the same weight
      const allSameWeight = weights.every((w) => w === currentWeight);

      trends.push({
        exercise: exerciseName,
        lastFiveWeights: weights,
        lastFiveDates: dates,
        shouldIncrease: allSameWeight,
        currentWeight,
        suggestedWeight: allSameWeight ? currentWeight + 2.5 : currentWeight,
      });
    }
  });

  return trends.filter((t) => t.shouldIncrease);
}

/**
 * Get general workout statistics
 */
export function getWorkoutStats(entries: WorkoutEntry[]): WorkoutStats {
  const uniqueExercises = new Set(entries.map((e) => e.exercise));

  // Count exercise frequency
  const exerciseCounts = new Map<string, number>();
  let totalVolume = 0;

  entries.forEach((entry) => {
    exerciseCounts.set(
      entry.exercise,
      (exerciseCounts.get(entry.exercise) || 0) + 1,
    );
    totalVolume += entry.weight * entry.reps;
  });

  // Find most frequent exercise
  let mostFrequent = "";
  let maxCount = 0;
  exerciseCounts.forEach((count, exercise) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = exercise;
    }
  });

  // Get last workout date
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const lastWorkoutDate = sorted.length > 0 ? sorted[0].date : undefined;

  return {
    totalWorkouts: entries.length,
    uniqueExercises: uniqueExercises.size,
    mostFrequentExercise: mostFrequent,
    totalVolume,
    lastWorkoutDate,
  };
}

/**
 * Get chart data for an exercise's weight progression
 */
export function getExerciseChartData(
  entries: WorkoutEntry[],
  exerciseName: string,
  limit: number = 10,
) {
  const exerciseEntries = entries
    .filter((e) => e.exercise === exerciseName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-limit);

  const labels = exerciseEntries.map((e) => {
    const date = new Date(e.date);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  });

  const data = exerciseEntries.map((e) => e.weight);

  return { labels, data };
}

/**
 * Get top exercises by total volume
 */
export function getTopExercisesByVolume(
  entries: WorkoutEntry[],
  limit: number = 5,
): Array<{ exercise: string; volume: number }> {
  const volumeMap = new Map<string, number>();

  entries.forEach((entry) => {
    const volume = entry.weight * entry.reps;
    volumeMap.set(
      entry.exercise,
      (volumeMap.get(entry.exercise) || 0) + volume,
    );
  });

  return Array.from(volumeMap.entries())
    .map(([exercise, volume]) => ({ exercise, volume }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit);
}
