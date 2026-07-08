export type DiagnosisContact = {
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  agreePrivacy: boolean;
};

export type DiagnosisAnswers = {
  region: string | null;
  status: string | null;
  constructionTypes: string[];
  parkingCount: string | null;
  budget: string | null;
  timing: string | null;
  contact: DiagnosisContact;
};

export const initialDiagnosisAnswers: DiagnosisAnswers = {
  region: null,
  status: null,
  constructionTypes: [],
  parkingCount: null,
  budget: null,
  timing: null,
  contact: {
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    agreePrivacy: false,
  },
};

export const TOTAL_STEPS = 7;
