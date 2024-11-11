export interface Concept2Profile extends Record<string, any> {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  email: string;
  country: string;
  profile_image: string;
  age_restricted: boolean;
  email_permission: boolean | null;
  max_heart_rate: number | null;
  weight: number | null;
  logbook_privacy: string | null;
}
