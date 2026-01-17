import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Anamnesis, type AnamnesisProps } from '@/domain/enterprise/entities/anamnesis/anamnesis';

export function makeAnamnesis(override: Partial<AnamnesisProps> = {}): Anamnesis {
  const anamnesis = Anamnesis.create({
    patientId: new UniqueEntityId(),
    aestheticHistory: {
      hadPreviousAestheticTreatment: false,
      botulinumToxin: false,
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: false,
    },
    healthConditions: {
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,
    },
    medicalHistory: {
      usesMedication: false,
      allergy: false,
      lactoseIntolerance: false,
      diabetes: 'no',
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,
    },
    physicalAssessment: {
      bloodPressure: '120/80',
      height: 170,
      initialWeight: 70,
    },
    ...override,
  });

  return anamnesis;
}

