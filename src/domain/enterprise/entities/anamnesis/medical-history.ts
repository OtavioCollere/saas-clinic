export interface MedicalHistory {
  usesMedication: boolean;
  medicationDetails?: string;
  allergy: boolean;
  allergyDetails?: string;
  lactoseIntolerance: boolean;
  diabetes: "controlled" | "yes" | "no" | null;
  roacutan: boolean;
  recentSurgery: boolean;
  recentSurgeryDetails?: string;
  tumorOrPrecancerousLesion: boolean;
  tumorOrLesionDetails?: string;
  skinProblems: boolean;
  skinProblemsDetails?: string;
  orthopedicProblems: boolean;
  orthopedicProblemsDetails?: string;
  hasBodyOrFacialProsthesis: boolean;
  prosthesisDetails?: string;
  usingAcids: boolean;
  acidsDetails?: string;
  otherRelevantIssues?: string;
}
