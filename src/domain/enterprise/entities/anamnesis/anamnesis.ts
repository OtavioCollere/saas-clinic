import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Entity } from '@/core/entities/entity';
import { AestheticHistory } from './aesthetic-history';
import { HealthConditions } from './health-conditions';
import { MedicalHistory } from './medical-history';
import { PhysicalAssessment } from './physical-assessment';

export interface AnamnesisProps {
  patientId: UniqueEntityId;
  aestheticHistory: AestheticHistory;
  healthConditions: HealthConditions;
  medicalHistory: MedicalHistory;
  physicalAssessment: PhysicalAssessment;
  createdAt: Date;
  updatedAt?: Date;
}

export class Anamnesis extends Entity<AnamnesisProps> {
  static create(props: Optional<AnamnesisProps, "createdAt" | "updatedAt">, id?: UniqueEntityId) {
    const anamnesis = new Anamnesis(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return anamnesis;
  }

  get patientId() {
    return this.props.patientId;
  }

  get aestheticHistory() {
    return this.props.aestheticHistory;
  }

  get healthConditions() {
    return this.props.healthConditions;
  }

  get medicalHistory() {
    return this.props.medicalHistory;
  }

  get physicalAssessment() {
    return this.props.physicalAssessment;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set patientId(patientId: UniqueEntityId) {
    this.props.patientId = patientId;
  }

  set aestheticHistory(aestheticHistory: AestheticHistory) {
    this.props.aestheticHistory = aestheticHistory;
  }

  set healthConditions(healthConditions: HealthConditions) {
    this.props.healthConditions = healthConditions;
  }

  set medicalHistory(medicalHistory: MedicalHistory) {
    this.props.medicalHistory = medicalHistory;
  }

  set physicalAssessment(physicalAssessment: PhysicalAssessment) {
    this.props.physicalAssessment = physicalAssessment;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
