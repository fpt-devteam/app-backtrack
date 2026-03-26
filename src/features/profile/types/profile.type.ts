import { Nullable } from "@/src/shared/types/global.type";

export type ProfileSettings = {
  customMessage: string;
  showEmail: boolean;
  showPhone: boolean;
}

export type PublicProfile = {
  id: string,
  displayName: Nullable<string>;
  avatarUrl: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  note: Nullable<string>;
}