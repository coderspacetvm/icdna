// :check
export type UserType = {
  id: number;
  name: string;
  photo: string;
};

export type UserDataType = {
  pincode: string,
  address: string,
  profile_picture: string,
  name: string | null,
  whatsapp_number: string | null,
  mobile_number: number,
  google_id: string,
  latitude: string | number | null,
  longitude: string | number | null,
  email: string,
  fcm_token: string | null,
  wallet: number,
  state?: string,
  city?: string,
  referral_code?: string,
  landmark?: string,
  building_number?: string
}

export type UserAuhType = {
  access_token: string
  user_data: UserDataType
  status: number
  message?: string
  error?: string
}

