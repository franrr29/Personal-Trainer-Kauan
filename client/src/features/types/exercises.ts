export interface Exercise {
  id: number;
  trainer_id: number;
  name: string;
  video_url: string | null;
  category: string;
  description: string | null;
  notes: string | null;
  created_at: string;
}