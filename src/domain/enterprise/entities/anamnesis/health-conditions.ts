export interface HealthConditions {
  smoker: boolean;
  circulatoryDisorder: boolean;
  epilepsy: boolean;
  regularMenstrualCycle: boolean;
  regularIntestinalFunction: boolean;
  cardiacAlterations: boolean;
  hormonalDisorder: boolean;
  hypoOrHypertension: boolean;
  renalDisorder: boolean;
  varicoseVeinsOrLesions: boolean;
  pregnant: boolean;
  gestationalWeeks?: number;
  underMedicalTreatment: boolean;
  medicalTreatmentDetails?: string;
}
