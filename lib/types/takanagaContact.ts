// 高長建設 コーポレートサイト お問い合わせフォームの型定義

export type PreferredContact = "email" | "phone" | "either";
export type PreferredTime = "morning" | "afternoon" | "evening" | "any";
export type DesiredTime = "asap" | "within1month" | "within3months" | "within6months" | "undecided";

export type TakanagaContactInput = {
  // 必須
  name: string;
  phone: string;
  email: string;
  prefecture: string;
  city: string;
  desiredWork: string[];
  message: string;
  privacyAgreed: true;

  // 任意
  address?: string;
  preferredContact?: PreferredContact;
  preferredTime?: PreferredTime;
  desiredTiming?: DesiredTime;
  budget?: string;
  attachmentUrls?: string[];
};
