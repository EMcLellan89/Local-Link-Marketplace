import { supabase } from './supabase';

export interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface ProgressDetail {
  completedLessonIds: string[];
  countCompleted: number;
  progressByLesson: Map<string, LessonProgress>;
}

export async function getProgressDetail(courseId: string, userId: string): Promise<ProgressDetail> {
  const { data, error } = await supabase
    .from('course_progress')
    .select('lesson_id, completed, completed_at')
    .eq('course_id', courseId)
    .eq('user_id', userId);

  if (error) throw error;

  const rows = data || [];
  const completedLessonIds = rows
    .filter(r => r.completed)
    .map(r => r.lesson_id);

  const progressByLesson = new Map<string, LessonProgress>();
  rows.forEach(row => {
    progressByLesson.set(row.lesson_id, row);
  });

  return {
    completedLessonIds,
    countCompleted: completedLessonIds.length,
    progressByLesson
  };
}

export async function markLessonComplete(
  courseId: string,
  lessonId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('course_progress')
    .upsert({
      course_id: courseId,
      lesson_id: lessonId,
      user_id: userId,
      completed: true,
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'course_id,lesson_id,user_id'
    });

  if (error) throw error;
}
