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
  constructionTypes: string[];
  worries: string[];
  worriesOther: string;
  size: string | null;
  timing: string | null;
  budget: string | null;
  paymentMethod: string | null;
  contact: DiagnosisContact;
};

export const initialDiagnosisAnswers: DiagnosisAnswers = {
  prefecture: null,
  municipality: null,
  constructionTypes: [],
  worries: [],
  worriesOther: "",
  size: null,
  timing: null,
  budget: null,
  paymentMethod: null,
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

export const TOTAL_STEPS = 7;
