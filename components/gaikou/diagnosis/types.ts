import type { Prefecture } from "@/data/gaikou/municipalities";

export type DiagnosisContact = {
  name: string;
  phone: string;
  email: string;
  contactTime: string;
  addressDetail: string;
  photoName: string;
  note: string;
  agreePrivacy: boolean;
};

export type DiagnosisAnswers = {
  prefecture: Prefecture | null;
  municipality: string | null;
  /** 工事種別（new-construction=新築外構 / renovation=外構リフォーム） */
  workType: string | null;
  constructionTypes: string[];
  size: string | null;
  /** 工事希望時期（任意） */
  timing: string | null;
  contact: DiagnosisContact;
};

export const initialDiagnosisAnswers: DiagnosisAnswers = {
  prefecture: null,
  municipality: null,
  workType: null,
  constructionTypes: [],
  size: null,
  timing: null,
  contact: {
    name: "",
    phone: "",
    email: "",
    contactTime: "",
    addressDetail: "",
    photoName: "",
    note: "",
    agreePrivacy: false,
  },
};

// STEP1: 地域 / STEP2: 工事種別＋工事内容 / STEP3: 広さ＋希望時期 / STEP4: 概算表示＋連絡先
export const TOTAL_STEPS = 4;
