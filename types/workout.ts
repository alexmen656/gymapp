export interface WorkoutEntry {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  date: string; // ISO string
}

export interface ExerciseGroup {
  exercise: string;
  entries: WorkoutEntry[];
  lastWeight: number;
  lastReps: number;
  lastDate: string;
}
