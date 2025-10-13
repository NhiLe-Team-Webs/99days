import { supabase } from "./supabase";

export interface GratitudeEntryRecord {
  id: string;
  member_id: string;
  entry_date: string;
  gratitude: string;
  created_at: string;
  updated_at: string;
}

export interface HomeworkSubmissionRecord {
  id: string;
  member_id: string;
  submission_date: string;
  lesson: string;
  submission: string;
  mentor_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgressUpdateRecord {
  id: string;
  member_id: string;
  recorded_at: string;
  recorded_for: string;
  weight: number;
  height: number;
  note: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchGratitudeEntries(memberId: string): Promise<GratitudeEntryRecord[]> {
  const { data, error } = await supabase
    .from("gratitude_entries")
    .select("id, member_id, entry_date, gratitude, created_at, updated_at")
    .eq("member_id", memberId)
    .order("entry_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function upsertGratitudeEntry(memberId: string, entryDate: string, gratitude: string) {
  const { data, error } = await supabase
    .from("gratitude_entries")
    .upsert(
      {
        member_id: memberId,
        entry_date: entryDate,
        gratitude,
      },
      { onConflict: "member_id,entry_date" },
    )
    .select("id, member_id, entry_date, gratitude, created_at, updated_at")
    .single<GratitudeEntryRecord>();

  if (error) throw error;
  return data;
}

export async function fetchHomeworkSubmissions(memberId: string): Promise<HomeworkSubmissionRecord[]> {
  const { data, error } = await supabase
    .from("homework_submissions")
    .select("id, member_id, submission_date, lesson, submission, mentor_notes, created_at, updated_at")
    .eq("member_id", memberId)
    .order("submission_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function upsertHomeworkSubmission(memberId: string, submissionDate: string, submission: string) {
  const { data, error } = await supabase
    .from("homework_submissions")
    .upsert(
      {
        member_id: memberId,
        submission_date: submissionDate,
        lesson: "Ghi chú luyện tập",
        submission,
      },
      { onConflict: "member_id,submission_date" },
    )
    .select("id, member_id, submission_date, lesson, submission, mentor_notes, created_at, updated_at")
    .single<HomeworkSubmissionRecord>();

  if (error) throw error;
  return data;
}

export async function fetchProgressUpdates(memberId: string): Promise<ProgressUpdateRecord[]> {
  const { data, error } = await supabase
    .from("progress_updates")
    .select("id, member_id, recorded_at, recorded_for, weight, height, note, photo_url, created_at, updated_at")
    .eq("member_id", memberId)
    .order("recorded_for", { ascending: false })
    .order("recorded_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function upsertProgressUpdate(
  memberId: string,
  recordedFor: string,
  weight: number,
  height: number,
  photoUrl: string | null,
) {
  const { data, error } = await supabase
    .from("progress_updates")
    .upsert(
      {
        member_id: memberId,
        recorded_for: recordedFor,
        weight,
        height,
        note: null,
        photo_url: photoUrl,
      },
      { onConflict: "member_id,recorded_for" },
    )
    .select("id, member_id, recorded_at, recorded_for, weight, height, note, photo_url, created_at, updated_at")
    .single<ProgressUpdateRecord>();

  if (error) throw error;
  return data;
}
