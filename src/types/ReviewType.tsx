export type ReviewType = {
  id: number
  user: {
    profile_picture: string
    name: string
  } | null
  review: string
  average_rating: number
  created_at: string
  product: number
  order: number
};
