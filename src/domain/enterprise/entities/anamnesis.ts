import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from './../../../core/types/optional';
import { Entity } from '../../../core/entities/entity';


export interface AnamnesisProps {
  clientId: UniqueEntityID;

  // --- Aesthetic history ---
  hadPreviousAestheticTreatment: boolean;
  botulinumToxin: boolean;
  botulinumRegion?: string;
  filler: boolean;
  fillerRegion?: string;
  fillerProduct?: string;
  suspensionThreads: boolean;
  suspensionThreadsRegion?: string;
  suspensionThreadsProduct?: string;
  surgicalLift: boolean;
  surgicalLiftRegion?: string;
  surgicalLiftProduct?: string;
  chemicalPeeling: boolean;
  chemicalPeelingRegion?: string;
  chemicalPeelingProduct?: string;
  laser: boolean;
  laserRegion?: string;
  laserProduct?: string;
  exposedToHeatOrColdWork: boolean;

  // --- Health conditions & habits ---
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

  // --- Allergies, diseases, medications ---
  usesMedication: boolean;
  medicationDetails?: string;
  allergy: boolean;
  allergyDetails?: string;
  lactoseIntolerance: boolean;
  diabetes: "controlled" | "yes" | "no" | null;
  roacutan: boolean;

  // --- Additional medical history ---
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

  // --- Measurements ---
  bloodPressure?: string;
  height?: number;
  initialWeight?: number;
  finalWeight?: number;

  createdAt: Date;
  updatedAt?: Date;
}

export class Anamnesis extends Entity<AnamnesisProps> {
  // --- Core ---
  get clientId() {
    return this.props.clientId;
  }

  // --- Aesthetic history ---
  get hadPreviousAestheticTreatment() {
    return this.props.hadPreviousAestheticTreatment;
  }
  get botulinumToxin() {
    return this.props.botulinumToxin;
  }
  get botulinumRegion() {
    return this.props.botulinumRegion;
  }
  get filler() {
    return this.props.filler;
  }
  get fillerRegion() {
    return this.props.fillerRegion;
  }
  get fillerProduct() {
    return this.props.fillerProduct;
  }
  get suspensionThreads() {
    return this.props.suspensionThreads;
  }
  get suspensionThreadsRegion() {
    return this.props.suspensionThreadsRegion;
  }
  get suspensionThreadsProduct() {
    return this.props.suspensionThreadsProduct;
  }
  get surgicalLift() {
    return this.props.surgicalLift;
  }
  get surgicalLiftRegion() {
    return this.props.surgicalLiftRegion;
  }
  get surgicalLiftProduct() {
    return this.props.surgicalLiftProduct;
  }
  get chemicalPeeling() {
    return this.props.chemicalPeeling;
  }
  get chemicalPeelingRegion() {
    return this.props.chemicalPeelingRegion;
  }
  get chemicalPeelingProduct() {
    return this.props.chemicalPeelingProduct;
  }
  get laser() {
    return this.props.laser;
  }
  get laserRegion() {
    return this.props.laserRegion;
  }
  get laserProduct() {
    return this.props.laserProduct;
  }
  get exposedToHeatOrColdWork() {
    return this.props.exposedToHeatOrColdWork;
  }

  // --- Health conditions & habits ---
  get smoker() {
    return this.props.smoker;
  }
  get circulatoryDisorder() {
    return this.props.circulatoryDisorder;
  }
  get epilepsy() {
    return this.props.epilepsy;
  }
  get regularMenstrualCycle() {
    return this.props.regularMenstrualCycle;
  }
  get regularIntestinalFunction() {
    return this.props.regularIntestinalFunction;
  }
  get cardiacAlterations() {
    return this.props.cardiacAlterations;
  }
  get hormonalDisorder() {
    return this.props.hormonalDisorder;
  }
  get hypoOrHypertension() {
    return this.props.hypoOrHypertension;
  }
  get renalDisorder() {
    return this.props.renalDisorder;
  }
  get varicoseVeinsOrLesions() {
    return this.props.varicoseVeinsOrLesions;
  }
  get pregnant() {
    return this.props.pregnant;
  }
  get gestationalWeeks() {
    return this.props.gestationalWeeks;
  }
  get underMedicalTreatment() {
    return this.props.underMedicalTreatment;
  }
  get medicalTreatmentDetails() {
    return this.props.medicalTreatmentDetails;
  }

  // --- Allergies, diseases, medications ---
  get usesMedication() {
    return this.props.usesMedication;
  }
  get medicationDetails() {
    return this.props.medicationDetails;
  }
  get allergy() {
    return this.props.allergy;
  }
  get allergyDetails() {
    return this.props.allergyDetails;
  }
  get lactoseIntolerance() {
    return this.props.lactoseIntolerance;
  }
  get diabetes() {
    return this.props.diabetes;
  }
  get roacutan() {
    return this.props.roacutan;
  }

  // --- Additional medical history ---
  get recentSurgery() {
    return this.props.recentSurgery;
  }
  get recentSurgeryDetails() {
    return this.props.recentSurgeryDetails;
  }
  get tumorOrPrecancerousLesion() {
    return this.props.tumorOrPrecancerousLesion;
  }
  get tumorOrLesionDetails() {
    return this.props.tumorOrLesionDetails;
  }
  get skinProblems() {
    return this.props.skinProblems;
  }
  get skinProblemsDetails() {
    return this.props.skinProblemsDetails;
  }
  get orthopedicProblems() {
    return this.props.orthopedicProblems;
  }
  get orthopedicProblemsDetails() {
    return this.props.orthopedicProblemsDetails;
  }
  get hasBodyOrFacialProsthesis() {
    return this.props.hasBodyOrFacialProsthesis;
  }
  get prosthesisDetails() {
    return this.props.prosthesisDetails;
  }
  get usingAcids() {
    return this.props.usingAcids;
  }
  get acidsDetails() {
    return this.props.acidsDetails;
  }
  get otherRelevantIssues() {
    return this.props.otherRelevantIssues;
  }

  // --- Measurements ---
  get bloodPressure() {
    return this.props.bloodPressure;
  }
  get height() {
    return this.props.height;
  }
  get initialWeight() {
    return this.props.initialWeight;
  }
  get finalWeight() {
    return this.props.finalWeight;
  }

  // --- Timestamps ---
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<AnamnesisProps, "createdAt">, id?: UniqueEntityID) {
    const anamnesis = new Anamnesis(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return anamnesis;
  }
}