export type NotificationType = {
  id: number; // Made id non-optional as it's a key identifier
  title: string; // Made title non-optional
  description: string; // Made description non-optional
  created_date: string; // Added created_date
  is_seen: boolean; // Added is_seen
  user?: number; // Added user as it's in the API response, marked optional for now
  date?: string; // Kept original date for now, can be removed if created_date replaces it
};
